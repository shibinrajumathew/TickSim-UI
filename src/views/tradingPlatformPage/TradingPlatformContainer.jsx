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
import dataWebWorker from "../../utils/dataWebWorker";
import dynamicDataWebWorker from "../../utils/dynamicDataWebWorker";
import constants from "../../utils/constants";
import dbData from "../../utils/dummyData";
import { handleZoom } from "../../utils/chartVisualizationUtil";
import OrderPlacingForm from "./OrderPlacingForm";
import StatusInfo from "./StatusInfo";
import PortfolioTable from "./PortfolioTable";
import {
  buyOrSellAtMarketPrice,
  orderSearch,
} from "../../utils/orderManagerUtil";
let scales = [];
const {
  EVENTS: { BLUR, FOCUS, SUBMIT, NON_PASSIVE_EVENTS },
} = constants;
let singleCandleWebWorkerInstance = undefined;
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
      playChart: true,
      currentPrice: 0,
      instrumentId: "NIFTY50",
      orderTrigger: {},
      orderQueueObj: {},
      orderPosition: [],
    };
    this.zoomHandler = this.zoomHandler.bind(this);
    this.handleOrderFormSubmit = this.handleOrderFormSubmit.bind(this);
    this.orderFormNode = React.createRef();
  }
  getSingleCandleDataWebWorkerInstance = () => {
    if (singleCandleWebWorkerInstance === undefined)
      singleCandleWebWorkerInstance = new WebWorkerEnabler(dataWebWorker);
  };
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
  stopSingleCandleDataWebWorkerInstance = () => {
    if (singleCandleWebWorkerInstance !== undefined) {
      singleCandleWebWorkerInstance.terminate();
      singleCandleWebWorkerInstance = undefined;
    }
  };

  componentDidMount() {
    window.addEventListener(BLUR, this.pauseChart);
    window.addEventListener(FOCUS, this.resumeChart);
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
    // orderFormNode.removeEventListener(SUBMIT, this.buyOrderByButtonClick);
    window.removeEventListener(BLUR, this.pauseChart);
    window.removeEventListener(FOCUS, this.resumeChart);
  }
  pauseChart = () => {
    this.setState({ playChart: false });
    this.stopDynamicDataWorker();
    this.stopSingleCandleDataWebWorkerInstance();
    // this.pauseChart();
  };
  //  To play chart on foreground
  resumeChart = () => {
    // this.resumeChart();

    this.setState({ playChart: true }, () => {
      this.chartDraw();
    });
  };
  chartDraw = () => {
    let { data, nCandle, tempData, playChart, totalFilledCandles } = this.state;
    let lastCandle = totalFilledCandles || nCandle;

    data = dbData.slice(0, lastCandle);
    let currentPrice = data[lastCandle - 1].close;
    this.setState({ data, tempData, currentPrice });
    //dynamic data feed
    let dbDataLength = dbData.length;
    let candleSpeedInSec = 4;
    let lastIndexAfterSlice = data.length - 1;

    let candleSpeedInMilSec = candleSpeedInSec * 1000;
    let dynamicCandleSpeedInMilSec = candleSpeedInMilSec * 0.251; //always keep speed greater than 1 sec
    //To avoid webworker running background on focus
    if (data.length === dbDataLength) {
      return;
    }
    if (singleCandleWebWorkerInstance === undefined)
      this.getSingleCandleDataWebWorkerInstance();

    singleCandleWebWorkerInstance.postMessage({
      candleSpeedInMilSec,
      dbData,
      lastIndexAfterSlice,
    });
    singleCandleWebWorkerInstance.onmessage = (e) => {
      let {
        data: { candleData, index },
      } = e;
      // let { data, tempData } = this.state;
      let { high, low, open, close, date } = candleData;
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
      if (dynamicDataWorkerInstance === undefined)
        this.getDynamicDataWorkerInstance();

      this.setState({ isInitialData: false });
      dynamicDataWorkerInstance.postMessage({
        dynamicData,
        dynamicCandleSpeedInMilSec,
        index,
      });
      dynamicDataWorkerInstance.onmessage = (e) => {
        let {
          data: { dynamicCandleData, dynamicCandleCounter, index },
        } = e;
        if (dynamicCandleCounter === 0) {
          data = [...data, dynamicCandleData];
        }
        if (dynamicCandleCounter > 0) {
          data[index] = dynamicCandleData;
        }
        if (dynamicCandleCounter >= 2) {
          totalFilledCandles = data.length;
          this.stopDynamicDataWorker();
          if (playChart) {
            if (totalFilledCandles === dbDataLength)
              this.stopSingleCandleDataWebWorkerInstance();
          } else {
            this.stopSingleCandleDataWebWorkerInstance();
          }
        }

        let {
          orderQueueObj,
          instrumentId,
          prevPrice,
          currentPrice,
          orderTrigger,
          orderPosition,
        } = this.state;

        prevPrice = currentPrice;
        currentPrice = dynamicCandleData.close;
        // console.log(
        //   "orderQueueObj, orderTrigger, positionQueue",
        //   orderQueueObj,
        //   orderTrigger,
        //   orderPosition
        // );
        if (
          Object.keys(orderQueueObj).length > 0 &&
          orderQueueObj.constructor === Object &&
          Object.keys(orderTrigger).length > 0 &&
          orderTrigger.constructor === Object
        ) {
          // console.log(
          //   " orderQueueObj, orderTrigger, positionQueue, prevPrice, currentPrice::::",
          //   orderQueueObj,
          //   orderTrigger,
          //   orderPosition,
          //   prevPrice,
          //   currentPrice
          // );
          const response = orderSearch(
            orderQueueObj,
            orderTrigger,
            orderPosition,
            instrumentId,
            prevPrice,
            currentPrice
          );
          console.log("inside order search container response::>", response);
          orderQueueObj = response.responseOrderQueueObj;
          orderTrigger = response.responseOrderTrigger;
          orderPosition = response.responsePositionQueue;
        }

        this.setState({
          data,
          currentPrice,
          prevPrice,
          totalFilledCandles,
          orderQueueObj,
          orderTrigger,
          orderPosition,
        });
      };
    };
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
        riskReward: { value: riskReward },
      },
      submitter: {
        dataset: { orderType },
      },
    } = e;
    const {
      orderTrigger,
      orderQueueObj,
      orderPosition,
      instrumentId,
      currentPrice,
    } = this.state;
    let response = null;
    quantity = parseInt(quantity);
    target = parseFloat(target);
    stopLoss = parseFloat(stopLoss);
    limitPrice = parseFloat(limitPrice);
    response = buyOrSellAtMarketPrice(
      orderQueueObj,
      orderTrigger,
      orderPosition,
      instrumentId,
      orderType,
      quantity,
      currentPrice,
      target,
      stopLoss,
      limitPrice
    );
    const {
      returnedOrderQueueObj,
      returnedTriggerObj,
      returnedPositionQueue,
    } = response;
    console.log(
      "returnobj",
      returnedOrderQueueObj,
      returnedTriggerObj,
      returnedPositionQueue
    );
    this.setState({
      orderQueueObj: returnedOrderQueueObj,
      orderTrigger: returnedTriggerObj,
      orderPosition: returnedPositionQueue,
    });
  }

  updatePL(pL) {
    console.log("update pl inside onctainer", pL);
    currentPL = parseFloat(pL);
    fundBalance = parseFloat(fundBalance) + currentPL;
    fundBalance = fundBalance.toFixed(2);
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
      orderQueueObj,
      orderPosition,
    } = this.state;
    // console.log("orderQueueObj", orderQueueObj);
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
          <Col xs={2} className="ml-3">
            <OrderPlacingForm
              ref={this.orderFormNode}
              currentPrice={currentPrice}
            />
            <StatusInfo
              currentPrice={currentPrice}
              currentPL={currentPL}
              fundBalance={fundBalance}
            />
          </Col>
        </Row>
        <Row>
          <PortfolioTable
            orderQueueObj={orderQueueObj}
            orderPosition={orderPosition}
            currentPrice={currentPrice}
            updatePL={this.updatePL}
          />
        </Row>
      </Container>
    );
  }
}

export default TradingPlatformContainer;
