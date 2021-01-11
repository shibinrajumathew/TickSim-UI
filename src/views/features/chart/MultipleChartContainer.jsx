import React, { Component } from "react";
import ChartContainer from "./ChartContainer";
import dbData from "../../../utils/dummyData";
import { handleZoom } from "../../../utils/chartVisualizationUtil";
import dynamicDataWebWorker from "../../../utils/dynamicDataWebWorker";
import webWorkerEnabler from "../../../utils/WebWorkerEnabler";
import dataWebWorker from "../../../utils/dataWebWorker";
import constants from "../../../utils/constants";
let scales = [];
const {
  EVENTS: { BLUR, FOCUS },
} = constants;
let singleCandleWebWorkerInstance = undefined;
let dynamicDataWorkerInstance = undefined;
class MultipleChartContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nCandlesTotalArray: [],
      data: [],
      isInitialData: true,
      nCandle: 25,
      playChart: true,
    };
    this.zoomHandler = this.zoomHandler.bind(this);
  }
  getSingleCandleDataWebWorkerInstance = () => {
    if (singleCandleWebWorkerInstance === undefined)
      singleCandleWebWorkerInstance = new webWorkerEnabler(dataWebWorker);
  };
  getDynamicDataWorkerInstance = () => {
    if (dynamicDataWorkerInstance === undefined)
      dynamicDataWorkerInstance = new webWorkerEnabler(dynamicDataWebWorker);
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

    this.chartDraw();
  }
  componentWillUnmount() {
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
    this.setState({ data, tempData });
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
        this.props.setCurrentValue(dynamicCandleData.close);
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
        this.setState({
          data,
          totalFilledCandles,
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
    let rightTop = {
      x: svgDimension.width,
      y: 0,
    };
    let leftBottom = {
      x: 0,
      y: svgDimension.height,
    };
    let rightBottom = {
      x: svgDimension.width,
      y: svgDimension.height,
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
    const { sec, min, hour, twoHour, threeHour, day, month, none } = chartType;
    const { data: dynamicCandleData, isInitialData, nCandle } = this.state;
    return (
      <React.Fragment>
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
        {/* <ChartContainer
          type={min}
          svgDimension={svgDimension}
          position={rightTop}
          svgDimension={svgDimension}
          candleData={dynamicCandleData}
          isInitialData={isInitialData}
          zoomHandler={this.zoomHandler}
          scales={scales}
          nCandle={nCandle}
        />
        <ChartContainer
          type={hour}
          svgDimension={svgDimension}
          position={leftBottom}
          svgDimension={svgDimension}
          candleData={dynamicCandleData}
          isInitialData={isInitialData}
          zoomHandler={this.zoomHandler}
          scales={scales}
          nCandle={nCandle}
        />
        <ChartContainer
          type={day}
          svgDimension={svgDimension}
          position={rightBottom}
          svgDimension={svgDimension}
          candleData={dynamicCandleData}
          isInitialData={isInitialData}
          zoomHandler={this.zoomHandler}
          scales={scales}
          nCandle={nCandle}
        /> */}
      </React.Fragment>
    );
  }
}

export default MultipleChartContainer;
