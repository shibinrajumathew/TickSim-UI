/*
 * Created on: Wed Oct 07 2020 10:01:00 PM
 * Author: Shibin Raju Mathew
 * Email: shibinrajumathew@yahoo.com
 * Website: vveeo.com
 *
 * This project is licensed proprietary, not free software, or open source.
 * Strictly prohibited Unauthorized copying or modifications.
 * This project owned and maintained by Shibin Raju Mathew.
 *
 * All rights reserved.
 * Copyright (c) 2020 VVEEO
 */
import React, { Component } from "react";
import ChartContainer from "../features/chart/ChartContainer";
import {
  Container,
  Col,
  Row,
} from "../common/cssFrameworkComponents/CoreComponents";
import WebWorkerEnabler from "../../utils/WebWorkerEnabler";
import dynamicDataWebWorker from "../../utils/dynamicDataWebWorker";
import constants from "../../utils/constants";
import { handleZoom } from "../../utils/chartVisualizationUtil";
import OrderPlacingForm from "./OrderPlacingForm";
import StatusInfo from "./StatusInfo";
import PortfolioTable from "./PortfolioTable";
import {
  orderManager,
  orderSearchAndModifyQueue,
  orderSearchAndTrigger,
} from "../../utils/orderManagerUtil";
import {
  getCandleData,
  getNextDayCandleData,
} from "../../integrations/getDataWithInRange";
import DropDownMenuComponent from "../common/ui/DropDownMenuComponent";
import PlayPauseButtonComponent from "../common/ui/PlayPauseButtonComponent";
import DateComponent from "./DateComponent";
import TradeNextDayComponent from "../common/ui/TradeNextDayComponent";
let scales = [];
const {
  EVENTS: { BLUR, SUBMIT, NON_PASSIVE_EVENTS },
  ORDER_TYPE: { BUY_AT_LIMIT_PRICE, SELL_AT_LIMIT_PRICE },
  TICK_SIM_CONSTANTS: { BUY, SELL },
  CONSTANT_STRING_MAPPING: { MAPPED_ORDER_TYPE },
  ERRORS,
  ERROR_MESSAGES,
  ORDER_ATTRIBUTES: {
    STOP_LOSS_PRICE,
    STOP_LOSS_POINT,
    TARGET_PRICE,
    TARGET_POINT,
  },
} = constants;
let dynamicDataWorkerInstance = undefined;
let currentPL = 0;
let fundBalance = 132025.21;
class TradingPlatformContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      nCandlesTotalArray: [],
      data: [],
      isInitialData: true,
      nCandle: 25,
      playChart: false,
      currentPrice: 0,
      prevClose: 0,
      instrumentId: "NIFTY50",
      orderTrigger: {},
      orderObj: {},
      orderPosition: [],
      alertOrderField: false,
      currentTimeScaleKey: "5minute",
      tradingDate: new Date("02/09/2015"),
      didCandleEnd: false,
      doesOrderEditFormDisabled: {},
      modifiedStopLoss: null,
      modifiedTarget: null,
      alertFlagObj: {},
      keyElement: Date.now(),
      modifiedOrderObj: {},
      isTradeNextDayButtonClicked: false,
    };
    this.zoomHandler = this.zoomHandler.bind(this);
    this.handleOrderFormSubmit = this.handleOrderFormSubmit.bind(this);
    this.handlePlayPauseButton = this.handlePlayPauseButton.bind(this);
    this.setTimeScaleKey = this.setTimeScaleKey.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.updatedChartOnButtonClick = this.updatedChartOnButtonClick.bind(this);
    this.toggleOrderEditForm = this.toggleOrderEditForm.bind(this);
    this.saveModifiedOrder = this.saveModifiedOrder.bind(this);

    this.orderFormNode = React.createRef();
  }
  getDynamicDataWorkerInstance = () => {
    if (dynamicDataWorkerInstance === undefined)
      dynamicDataWorkerInstance = new WebWorkerEnabler(dynamicDataWebWorker);
  };
  stopDynamicDataWorker = () => {
    if (dynamicDataWorkerInstance !== undefined) {
      dynamicDataWorkerInstance.terminate();
      dynamicDataWorkerInstance = undefined;
    }
  };

  componentDidMount() {
    window.addEventListener(BLUR, this.pauseChart);
    const orderFormNode = this.orderFormNode.current;
    orderFormNode.addEventListener(
      SUBMIT,
      this.handleOrderFormSubmit,
      NON_PASSIVE_EVENTS
    );

    this.chartDraw();
  }
  componentWillUnmount() {
    const orderFormNode = this.orderFormNode.current;
    orderFormNode.removeEventListener(SUBMIT, this.handleOrderFormSubmit);
    window.removeEventListener(BLUR, this.pauseChart);

    this.stopDynamicDataWorker();
  }
  pauseChart = () => {
    this.setState({ playChart: false });
    this.stopDynamicDataWorker();
    // this.pauseChart();
  };
  //  To play chart on foreground
  resumeChart = () => {
    this.setState({ playChart: true }, () => {
      this.chartDraw();
    });
  };
  chartDraw = async () => {
    let {
      data,
      nCandle,
      tempData,
      playChart,
      totalFilledCandles,
      currentTimeScaleKey,
      tradingDate,
      isTradeNextDayButtonClicked,
    } = this.state;
    let initialDynamicDataIndex = 0;
    let totalCandleCount = 1;
    let dbData = {};
    if (isTradeNextDayButtonClicked)
      ({
        candles: dbData,
        initialDynamicDataIndex,
        totalCandleCount,
      } = await getNextDayCandleData(currentTimeScaleKey, tradingDate));
    else {
      ({
        candles: dbData,
        initialDynamicDataIndex,
        totalCandleCount,
      } = await getCandleData(currentTimeScaleKey, tradingDate));
    }
    if (dbData.length > 0) {
      let tradingDate = dbData[initialDynamicDataIndex].date;
      console.log("tradingDate", tradingDate);
      tradingDate = new Date(tradingDate);
      nCandle = dbData.length - totalCandleCount;
      let lastCandle = totalFilledCandles || nCandle;
      data = dbData.slice(0, lastCandle);
      let currentPrice = data[lastCandle - 1].close;
      this.setState({
        data,
        tradingDate,
        tempData,
        currentPrice,
        nCandle,
        prevClose: dbData[nCandle - 1].close,
        isTradeNextDayButtonClicked: false,
      });
      //dynamic data feed
      let dbDataLength = dbData.length;
      let candleSpeedInSec = 3;
      let lastIndexAfterSlice = data.length - 1;

      let candleSpeedInMilSec = candleSpeedInSec * 1000;
      let dynamicCandleSpeedInMilSec = candleSpeedInMilSec; //always keep speed greater than 1 second
      //To avoid webworker running background on focus

      // let { data, tempData } = this.state;
      let index = lastIndexAfterSlice + 1;

      if (dynamicDataWorkerInstance === undefined)
        this.getDynamicDataWorkerInstance();

      this.setState({ isInitialData: false });
      dynamicDataWorkerInstance.postMessage({
        dynamicCandleSpeedInMilSec,
        index,
      });
      dynamicDataWorkerInstance.onmessage = (e) => {
        let {
          data: { dynamicCandleCounter, index },
        } = e;
        let {
          orderObj,
          modifiedOrderObj,
          instrumentId,
          prevPrice,
          currentPrice,
          orderTrigger,
          orderPosition,
        } = this.state;
        if (data.length === dbDataLength) {
          playChart = false;
          this.setState({
            didCandleEnd: true,
            playChart,
          });
        }

        if (playChart) {
          let { high, low, open, close, date } = dbData[index];
          //dynamic candle data
          let firstDynamicCandle = {
            date,
            open,
            close: low,
            high: open,
            low,
          };
          let secondDynamicCandle = {
            ...firstDynamicCandle,
            ...{ close: high, high },
          };
          let thirdDynamicCandle = { ...secondDynamicCandle, ...{ close } };

          let dynamicData = [
            firstDynamicCandle,
            secondDynamicCandle,
            thirdDynamicCandle,
          ];
          if (dynamicCandleCounter < 3) {
            const dynamicCandleData = dynamicData[dynamicCandleCounter];
            prevPrice = currentPrice;
            currentPrice = dynamicCandleData.close;
            if (dynamicCandleCounter === 0) {
              data = [...data, dynamicCandleData];
            }
            if (dynamicCandleCounter > 0) {
              data[index] = dynamicCandleData;
            }
            if (dynamicCandleCounter >= 2) {
              totalFilledCandles = data.length;
            }
          }
        } else {
          this.stopDynamicDataWorker();
          this.setState({ playChart: false });
        }
        if (
          Object.keys(orderObj).length > 0 &&
          orderObj.constructor === Object &&
          Object.keys(orderTrigger).length > 0 &&
          orderTrigger.constructor === Object
        ) {
          const response = orderSearchAndTrigger(
            orderObj,
            orderTrigger,
            instrumentId,
            prevPrice,
            currentPrice,
            modifiedOrderObj
          );
          ({ orderObj, orderTrigger, modifiedOrderObj } = response);
        }

        this.setState({
          data,
          currentPrice,
          prevPrice,
          totalFilledCandles,
          orderObj,
          orderTrigger,
          orderPosition,
          modifiedOrderObj,
        });
      };
    }
  };
  zoomHandler(
    event,
    xScale,
    xAxis,
    gXAxis,
    yScale,
    yAxis,
    gYAxis,
    dateArray,
    xBand,
    xAxisLeftEnd,
    xAxisRightEnd,
    endingId
  ) {
    let { transform } = event;
    let xNewScale = transform.rescaleX(xScale);
    let yNewScale = transform.rescaleY(yScale);
    scales[endingId] = {
      xScale: xNewScale,
      yScale: yNewScale,
      transform,
    };
    handleZoom(
      xScale,
      xAxis,
      gXAxis,
      yScale,
      yAxis,
      gYAxis,
      dateArray,
      xBand,
      xAxisLeftEnd,
      xAxisRightEnd,
      endingId,
      transform
    );
  }
  //TO DO
  //1 rename to buy at market price by buttonClick
  //2 do same for buy using limit price
  //3 implement logic for placing order
  handleOrderFormSubmit(e) {
    e.preventDefault();
    let {
      target: {
        quantity: { value: quantity },
        limitPrice: { value: limitPrice },
        target: { value: target },
        stopLoss: { value: stopLoss },
      },
      submitter: {
        dataset: { orderType },
      },
    } = e;
    const { orderTrigger, orderObj, instrumentId, currentPrice } = this.state;
    let response = null;

    //parse input value
    quantity = parseInt(quantity);
    target = parseFloat(target);
    stopLoss = parseFloat(stopLoss);
    limitPrice = parseFloat(limitPrice);

    //validate input value
    const numberOnlyRegex = /^\d*\.?\d*$/;
    let isValidInput =
      numberOnlyRegex.test(quantity) &&
      numberOnlyRegex.test(target) &&
      numberOnlyRegex.test(stopLoss);

    if (orderType === BUY_AT_LIMIT_PRICE || orderType === SELL_AT_LIMIT_PRICE) {
      isValidInput = isValidInput && numberOnlyRegex.test(limitPrice);
      let mappedOrderType = MAPPED_ORDER_TYPE[orderType];
      switch (mappedOrderType) {
        case BUY:
          isValidInput = limitPrice >= currentPrice;
          break;
        case SELL:
          isValidInput = limitPrice <= currentPrice;
          break;
        default:
          break;
      }
    }
    //process order if valid else alert on order form
    if (isValidInput) {
      response = orderManager(
        orderObj,
        orderTrigger,
        instrumentId,
        orderType,
        quantity,
        currentPrice,
        target,
        stopLoss,
        limitPrice
      );

      const { updatedOrderObj, updatedTriggerObj } = response;
      let modifiedOrderObj = JSON.parse(JSON.stringify(updatedOrderObj));
      this.setState({
        alertOrderField: false,
        orderObj: updatedOrderObj,
        modifiedOrderObj,
        orderTrigger: updatedTriggerObj,
      });
    } else {
      this.setState({
        alertOrderField: true,
      });
    }
  }
  //To update pl in paper trading page
  updatePL(pL) {
    currentPL = parseFloat(pL);
    fundBalance = parseFloat(fundBalance) + currentPL;
    fundBalance = fundBalance.toFixed(2);
  }
  handlePlayPauseButton = () => {
    const { playChart } = this.state;
    if (playChart) {
      this.pauseChart();
    } else {
      this.resumeChart();
    }
  };

  setTimeScaleKey = (currentTimeScaleKey) => {
    this.setState({ currentTimeScaleKey });
  };
  onDateChange = (tradingDate) => {
    this.setState({ tradingDate });
  };
  updatedChartOnButtonClick = () => {
    // let { tradingDate } = this.state;

    // let nextDate = new Date(tradingDate);
    // let oneDayTime = 24 * 60 * 60 * 1000;
    // let totalDays = oneDayTime * 1;
    // nextDate.setTime(nextDate.getTime() + totalDays);
    // tradingDate = nextDate;
    this.setState(
      {
        nCandle: 25,
        data: [],
        playChart: false,
        didCandleEnd: false,
        totalFilledCandles: 0,
        isTradeNextDayButtonClicked: true,
      },
      () => {
        this.chartDraw();
      }
    );
  };
  modifyOrder = (e, instrumentId, orderId, orderType, limitPrice, index) => {
    let {
      target: { name: modifiedPriceType, value: modifiedValue },
    } = e;
    let { modifiedOrderObj } = this.state;
    modifiedValue = parseFloat(modifiedValue);
    const { currentPrice, alertFlagObj } = this.state;
    const numberOnlyRegex = /^\d*\.?\d*$/;
    let isValidPrice = numberOnlyRegex.test(modifiedValue);
    let mappedOrderType = MAPPED_ORDER_TYPE[orderType];
    let {
      STOP_LOSS_MUST_BE_LESS_THAN_LTP,
      STOP_LOSS_MUST_BE_GREATER_THAN_LTP,
    } = ERRORS;
    let alertInfo = "";
    let pricePointType = TARGET_POINT;
    switch (true) {
      case mappedOrderType === BUY && modifiedPriceType === STOP_LOSS_PRICE:
        isValidPrice = isValidPrice && modifiedValue <= currentPrice;
        alertInfo = `${STOP_LOSS_MUST_BE_LESS_THAN_LTP} : ${ERROR_MESSAGES[STOP_LOSS_MUST_BE_LESS_THAN_LTP]}`;
        pricePointType = STOP_LOSS_POINT;
        break;
      case mappedOrderType === SELL && modifiedPriceType === STOP_LOSS_PRICE:
        isValidPrice = isValidPrice && modifiedValue >= currentPrice;
        alertInfo = `${STOP_LOSS_MUST_BE_GREATER_THAN_LTP} : ${ERROR_MESSAGES[STOP_LOSS_MUST_BE_GREATER_THAN_LTP]}`;
        pricePointType = STOP_LOSS_POINT;
        break;
      default:
        break;
    }
    if (isValidPrice) {
      alertFlagObj[index] = {
        isAlertEnabled: false,
        modifiedPriceType,
        alertInfo,
      };
      modifiedOrderObj[instrumentId][orderId][
        modifiedPriceType
      ] = modifiedValue;
      console.log("modifiedValue", modifiedValue);
      if (
        modifiedPriceType === TARGET_PRICE ||
        modifiedPriceType === STOP_LOSS_PRICE
      ) {
        let pricePoint = Math.abs(limitPrice - modifiedValue).toFixed(2);
        modifiedOrderObj[instrumentId][orderId][pricePointType] = pricePoint;
      }
    } else {
      alertFlagObj[index] = {
        isAlertEnabled: true,
        modifiedPriceType,
        alertInfo,
      };
    }

    //TO DO alert on ui using any state, add to orderQueue, orderObj
    this.setState({ alertFlagObj, modifiedOrderObj });
  };
  toggleOrderEditForm = (buttonType, index, instrumentId, orderId) => {
    let { doesOrderEditFormDisabled, modifiedOrderObj, orderObj } = this.state;
    doesOrderEditFormDisabled[index] = false;
    let keyElement = "";

    if (buttonType === "saveButton") {
      doesOrderEditFormDisabled[index] = true;
      this.saveModifiedOrder(index, instrumentId, orderId);
    }
    if (buttonType === "cancelButton") {
      doesOrderEditFormDisabled[index] = true;
      keyElement = Date.now();
      modifiedOrderObj = {};
      modifiedOrderObj = JSON.parse(JSON.stringify(orderObj));
    }
    this.setState({
      doesOrderEditFormDisabled,
      keyElement,
      modifiedOrderObj,
    });
  };
  saveModifiedOrder(index, instrumentId, orderId) {
    let { orderObj, modifiedOrderObj, orderTrigger, alertFlagObj } = this.state;
    let { isAlertEnabled } = alertFlagObj[index];
    const isValidModification = !isAlertEnabled;

    if (isValidModification && orderObj[instrumentId]) {
      let { limitPrice, stopLossPrice, targetPrice } = orderObj[instrumentId][
        orderId
      ];
      let {
        limitPrice: modifiedLimitPrice,
        stopLossPrice: modifiedStopLossPrice,
        stopLossPoint: modifiedStopLossPoint,
        targetPrice: modifiedTargetPrice,
        targetPoint: modifiedTargetPoint,
      } = modifiedOrderObj[instrumentId][orderId];
      console.log(
        "modifiedOrderObj[instrumentId][orderId]",
        modifiedOrderObj[instrumentId][orderId],
        modifiedLimitPrice,
        limitPrice
      );
      let newPriceArray = [];
      let oldPriceArray = [];
      if (modifiedLimitPrice !== limitPrice) {
        orderObj[instrumentId][orderId].limitPrice = modifiedLimitPrice;
        newPriceArray = [modifiedLimitPrice];
        oldPriceArray = [limitPrice];
      }
      if (modifiedStopLossPrice !== stopLossPrice) {
        orderObj[instrumentId][orderId].stopLossPrice = modifiedStopLossPrice;
        orderObj[instrumentId][orderId].stopLossPoint = modifiedStopLossPoint;
        newPriceArray = [...newPriceArray, modifiedStopLossPrice];
        oldPriceArray = [...oldPriceArray, stopLossPrice];
      }
      if (modifiedTargetPrice !== targetPrice) {
        orderObj[instrumentId][orderId].targetPrice = modifiedTargetPrice;
        orderObj[instrumentId][orderId].targetPoint = modifiedTargetPoint;
        newPriceArray = [...newPriceArray, modifiedTargetPrice];
        oldPriceArray = [...oldPriceArray, targetPrice];
      }
      let updatedTriggerObj = orderSearchAndModifyQueue(
        orderTrigger,
        orderId,
        newPriceArray,
        oldPriceArray
      );
      this.setState({ orderObj, orderTrigger: updatedTriggerObj });
    }
  }
  render() {
    let svgDimension = {
      width: 1020,
      height: 620,
      x: 0,
      y: 0,
    };
    let leftTop = {
      x: 0,
      y: 0,
    };
    let chartType = {
      sec: "Sec",
      min: "Min",
      hour: "Hour",
      twoHour: "TwoHour",
      threeHour: "ThreeHour",
      day: "Day",
      month: "Month",
      none: "",
    };
    const { sec } = chartType;
    const {
      data: dynamicCandleData,
      isInitialData,
      nCandle,
      currentPrice,
      prevClose,
      orderPosition,
      alertOrderField,
      playChart,
      currentTimeScaleKey,
      tradingDate,
      didCandleEnd,
      doesOrderEditFormDisabled,
      alertFlagObj,
      keyElement,
      modifiedOrderObj,
      orderObj,
    } = this.state;
    return (
      <Container className="mx-auto" fluid>
        {/* <Col className="mt-5 p-0">
          <h5>Simulator Trading Platform</h5>
        </Col> */}
        <Row>
          {/* chart column */}
          <Col xs={9}>
            <ChartContainer
              type={sec}
              position={leftTop}
              svgDimension={svgDimension}
              candleData={dynamicCandleData}
              isInitialData={isInitialData}
              zoomHandler={this.zoomHandler}
              scales={scales}
              nCandle={nCandle}
            />
          </Col>
          {/* order placing form with status */}
          <Col xs={2} className="ml-5">
            <OrderPlacingForm
              ref={this.orderFormNode}
              currentPrice={currentPrice}
              alertOrderField={alertOrderField}
            />
            <Row>
              <StatusInfo
                prevClose={prevClose}
                currentPrice={currentPrice}
                currentPL={currentPL}
                fundBalance={fundBalance}
              />
              <PlayPauseButtonComponent
                handlePlayPauseButton={this.handlePlayPauseButton}
                playChart={playChart}
              />
              <DropDownMenuComponent
                setTimeScaleKey={this.setTimeScaleKey}
                currentTimeScaleKey={currentTimeScaleKey}
              />
              <DateComponent
                tradingDate={tradingDate}
                onDateChange={this.onDateChange}
              />
              <TradeNextDayComponent
                didCandleEnd={didCandleEnd}
                updatedChartOnButtonClick={this.updatedChartOnButtonClick}
              />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="ml-1">
            <PortfolioTable
              orderPosition={orderPosition}
              currentPrice={currentPrice}
              updatePL={this.updatePL}
              toggleOrderEditForm={this.toggleOrderEditForm}
              doesOrderEditFormDisabled={doesOrderEditFormDisabled}
              modifyOrder={this.modifyOrder}
              alertFlagObj={alertFlagObj}
              keyElement={keyElement}
              modifiedOrderObj={modifiedOrderObj}
              orderObj={orderObj}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default TradingPlatformContainer;
