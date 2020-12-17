/*
 * Created on: Wed Oct 07 2020 10:00:40 PM
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
import ClipPathComponent from "../../common/svgCoreComponents/ClipPathComponent";
import LineComponent from "../../common/svgCoreComponents/LineComponent";
import PathComponent from "../../common/svgCoreComponents/PathComponent";
import PolygonComponent from "../../common/svgCoreComponents/PolygonComponent";
import SVGComponent from "../../common/svgCoreComponents/SVGComponent";
import SVGGroupComponent from "../../common/svgCoreComponents/SVGGroupComponent";
import TextComponent from "../../common/svgCoreComponents/TextComponent";
import TitleComponent from "../../common/svgCoreComponents/TitleComponent";
import dynamicDataWebWorker from "../../../utils/dynamicDataWebWorker";
import webWorkerEnabler from "../../../utils/WebWorkerEnabler";
import dataWebWorker from "../../../utils/dataWebWorker";

import {
  getDateArray,
  getFormattedDate,
  getFormattedValue,
  getLinePoints,
  getLongDate,
  getPercentageValue,
  getPolygonPoints,
  getTranslateXAxisPoint,
  getXAxisBandWidth,
  getXAxisFunction,
  getXAxisTickValue,
  getYAxisFunction,
  getYScaleValues,
} from "../../../utils/chartPointCalculator";
import { chartColors, preDefinedColors } from "../../../utils/colors";
import { slicedData as dbData } from "../../../utils/dummyData";
import { tsChildWrapper } from "../../../utils/tsWrapper";
import CircleComponent from "../../common/svgCoreComponents/CircleComponent";
import constants from "../../../utils/constants";

const {
  EVENTS: {
    BLUR,
    FOCUS,
    KEYUP,
    WHEEL,
    MOUSE_DOWN,
    MOUSE_MOVE,
    MOUSE_UP,
    CONTEXT_MENU,
  },
} = constants;
const { green, red, orange, lightGrey, lightYellow } = chartColors;
const { darkBlue, black } = preDefinedColors;
//predefined styles
let orangeStroke = { stroke: orange };
let lightYellowStroke = { stroke: lightYellow };
let blackStroke = { stroke: black };
let darkBlueBg = {
  background: darkBlue,
};
//design defaults
let strokeShape = {
  strokeLinecap: "square",
};
let scaleFontStyle = {
  fontSize: "10",
  fontFamily: "sans-serif",
};
let width = window.innerWidth;
let height = window.innerHeight;
let marginBottom = 50;
let bottomPoint = height - marginBottom;
let viewBoxWidth = window.innerWidth;
let viewBoxHeight = height;
let viewBoxX = 0;
let viewBoxY = 0;
let viewBox = `${viewBoxX}, ${viewBoxY}, ${viewBoxWidth}, ${viewBoxHeight}`; //-x for yScale up to 10 digit with 2 decimal points
let svgGroupRootStyle = {
  ...strokeShape,
  ...blackStroke,
};
let svgStyle = {
  width,
  height,
  viewBox,
  style: darkBlueBg,
};

let highLowLineWidth = 1;

let singleCandleWebWorkerInstance = undefined;
let dynamicDataWorkerInstance = undefined;

class ChartContainer extends Component {
  constructor(props) {
    width = 1035;
    viewBoxWidth = width;
    viewBoxHeight = height - 50;
    viewBoxX = 0;
    viewBoxY = 0;
    viewBox = `${viewBoxX}, ${viewBoxY}, ${viewBoxWidth}, ${viewBoxHeight}`; //-x for yScale up to 10 digit with 2 decimal points
    svgStyle = {
      width,
      height,
      viewBox,
      style: darkBlueBg,
    };
    const { playChart } = props;
    super();
    this.state = {
      data: [],
      tempData: [],
      nCandle: -100,
      mousePointX: 0,
      mousePointY: 0,
      xRange: [],
      isDragging: false,
      dragValue: 0,
      trendLine: [],
      horizontalLine: [],
      playChart,
    };
    this.tickValuesForPlot = [];
    this.svgNode = React.createRef();
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
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
    this.chartDraw();
    const nonPassiveEvents = {
      passive: false,
    };
    const svgNode = this.svgNode.current;

    window.addEventListener(BLUR, this.onBlur);
    window.addEventListener(FOCUS, this.onFocus);
    document.addEventListener(KEYUP, this.onKeyPress, nonPassiveEvents);
    svgNode.addEventListener(WHEEL, this.onMouseWheel, nonPassiveEvents);
    svgNode.addEventListener(MOUSE_DOWN, this.svgDragStart, nonPassiveEvents);
    svgNode.addEventListener(MOUSE_MOVE, this.svgOnDragging, nonPassiveEvents);
    svgNode.addEventListener(MOUSE_UP, this.svgDragEnd, nonPassiveEvents);
    svgNode.addEventListener(
      CONTEXT_MENU,
      this.handleContextMenu,
      nonPassiveEvents
    );
  }

  componentWillUnmount() {
    const svgNode = this.svgNode.current;
    window.removeEventListener(BLUR, this.onBlur);
    window.removeEventListener(FOCUS, this.onFocus);
    document.removeEventListener(KEYUP, this.onKeyPress);
    svgNode.removeEventListener(WHEEL, this.onMouseWheel);
    svgNode.addEventListener(MOUSE_DOWN, this.svgDragStart);
    svgNode.addEventListener(MOUSE_MOVE, this.svgOnDragging);
    svgNode.addEventListener(MOUSE_UP, this.svgDragEnd);
    svgNode.removeEventListener(CONTEXT_MENU, this.handleContextMenu);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { playChart } = nextProps;
    return {
      playChart,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { playChart: prevPlayChart } = prevProps;
    const { playChart: nextPlayChart } = this.props;
    if (prevPlayChart !== nextPlayChart && nextPlayChart) {
      this.chartDraw();
    }
  }
  pauseChart = () => {
    const { data } = this.state;
    const lastCandleIndex = data.length;
    this.props.setCandleIndex(lastCandleIndex);
    this.props.setChartPlay(false);
    this.stopDynamicDataWorker();
    this.stopSingleCandleDataWebWorkerInstance();
  };
  resumeChart = () => {
    this.props.setChartPlay(true);
  };
  /**
   * EVENT HANDLERS
   */
  //To pause chart on background
  onBlur = () => {
    this.pauseChart();
  };
  //  To play chart on foreground
  onFocus = () => {
    this.resumeChart();
  };
  //To handle right button events
  handleContextMenu = (e) => {
    e.preventDefault();
    let {
      target: {
        dataset: { line, id },
      },
    } = e;
    id = parseInt(id);
    let { trendLine, horizontalLine, isDragging, draggingElement } = this.state;
    switch (line) {
      case "trendLine":
        trendLine = trendLine.filter((data, arrayIndex) => arrayIndex !== id);

        console.log("trendLine::::", trendLine);
        isDragging = false;
        draggingElement = null;
        break;
      case "horizontalLine":
        horizontalLine = horizontalLine.filter(
          (data, arrayIndex) => arrayIndex !== id
        );
        isDragging = false;
        draggingElement = null;
        break;

      default:
        break;
    }

    this.setState({
      trendLine,
      horizontalLine,
      draggingElement,
      isDragging,
    });
    return false;
  };
  handleCrossWire = (e) => {
    let { clientX, clientY } = e;
    let svg = this.svgNode.current;
    let pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    let svgPT = pt.matrixTransform(svg.getScreenCTM().inverse());
    let mousePointX = svgPT.x;
    let mousePointY = svgPT.y;
    this.setState({
      mousePointX,
      mousePointY,
    });
  };
  onMouseWheel(e) {
    e.preventDefault();
    const { incrementX1Only, decrementX1Only } = this.props;
    let { deltaY } = e;
    switch (true) {
      case deltaY > 0:
        incrementX1Only();
        break;
      case deltaY < 0:
        decrementX1Only();
        break;
      default:
        break;
    }
  }
  getClosestXValueFromMousePoint = () => {
    let {
      mousePointX: xPosition,
      mousePointY: y,
      xTickValue,
      xAxisFunction,
    } = this.state;
    const xAxisBandWidth = getXAxisBandWidth(xAxisFunction);
    const xAxisBandWidthMidPoint = xAxisBandWidth / 2;
    let x1 = xTickValue.reduce((prev, current, currIndex) => {
      let prevXPosition = xAxisFunction(prev) + xAxisBandWidthMidPoint;
      let currentXPosition = xAxisFunction(current) + xAxisBandWidthMidPoint;
      let nearestPoint =
        Math.abs(prevXPosition - xPosition) <
        Math.abs(currentXPosition - xPosition)
          ? prev
          : current;
      return nearestPoint;
    });
    let closestValueIndex = xTickValue.indexOf(x1);
    let x2 = x1;
    if (closestValueIndex >= 0 && closestValueIndex < xTickValue.length - 1)
      x2 = xTickValue[closestValueIndex + 1];
    return {
      x1,
      x2,
    };
  };
  drawTrendLine() {
    let { trendLine, mousePointX: xPosition, mousePointY: y } = this.state;
    let { x1, x2 } = this.getClosestXValueFromMousePoint();
    let newLine = {
      x1,
      x2,
      y1: y,
      y2: y + 10,
    };
    trendLine = [...trendLine, newLine];
    this.setState({
      trendLine,
    });
  }

  drawHLine() {
    let { horizontalLine, mousePointY: y } = this.state;
    let newHLine = {
      y,
    };
    horizontalLine = [...horizontalLine, newHLine];
    this.setState({
      horizontalLine,
    });
  }

  onKeyPress(e) {
    const { key } = e;
    switch (key) {
      case "t":
      case "T":
        console.log("key t pressed");
        this.drawTrendLine();
        //draw trend line
        break;
      case "h":
      case "H":
        console.log("key h pressed");
        this.drawHLine();
        //draw horizontal line
        break;

      default:
        break;
    }
  }
  svgDragStart = (e) => {
    let {
      currentTarget: { tagName },
      button,
    } = e;
    if (button !== 0) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    if (tagName === "svg") {
      let { isDragging, mousePointX } = this.state;
      isDragging = true;
      this.setState({
        isDragging,
        xPositionBeforeDrag: mousePointX,
        draggingElement: tagName,
      });
    }
  };
  svgOnDragging = (e) => {
    e.preventDefault();
    this.handleCrossWire(e);
    let {
      xPositionBeforeDrag,
      draggingElement,
      draggingElementIndex,
      draggingElementPosition,
      trendLine,
      mousePointX,
      mousePointY,
      draggingElementType,
      horizontalLine,
    } = this.state;
    // isDragging = false;
    if (draggingElement === "svg") {
      this.handleSvgDrag(xPositionBeforeDrag);
    }
    if (draggingElement === "circle" && draggingElementType === "trendLine") {
      let xPosition = draggingElementPosition[0];
      let yPosition = draggingElementPosition[1];
      let { x1 } = this.getClosestXValueFromMousePoint();
      trendLine[draggingElementIndex][xPosition] = x1;
      trendLine[draggingElementIndex][yPosition] = mousePointY;

      this.setState({ trendLine });
    }
    if (
      draggingElement === "circle" &&
      draggingElementType === "horizontalLine"
    ) {
      horizontalLine[draggingElementIndex]["y"] = mousePointY;
    }
  };

  svgDragEnd = (e) => {
    this.setState({
      isDragging: false,
      draggingElement: null,
      draggingElementIndex: null,
    });
  };
  handleSvgDrag = (initialX) => {
    let { mousePointX, dragValue, trendLine } = this.state;
    const { storeState } = this.props;
    let { xRange } = storeState;
    if (initialX < mousePointX)
      dragValue +=
        Math.abs(xRange[0] - xRange[1]) *
        (Math.abs(mousePointX - initialX) / 100);
    else
      dragValue -=
        Math.abs(xRange[0] - xRange[1]) *
        (Math.abs(mousePointX - initialX) / 100);
    if (dragValue > Math.abs(xRange[0] - xRange[1]))
      dragValue = Math.abs(xRange[0] - xRange[1]);
    if (dragValue < -Math.abs(xRange[0] - xRange[1]))
      dragValue = -Math.abs(xRange[0] - xRange[1]);
    let newTrendLine = [];
    // if (trendLine && trendLine.length > 0) {
    //   newTrendLine = trendLine.map((data, index) => {
    //     console.log("trendLine inside svg drag", data);
    //     let { x1, x2, y1, y2 } = data;
    //     return {
    //       x1: x1 + dragValue,
    //       x2: x2 + dragValue,
    //       y1,
    //       y2,
    //     };
    //   });
    //   trendLine = newTrendLine;
    // }
    this.setState({
      trendLine,
      dragValue,
      xPositionBeforeDrag: mousePointX,
    });
  };

  customLineDragStart = (type, position, index, e) => {
    e.stopPropagation();
    let {
      currentTarget: { tagName },
    } = e;
    let draggingElement = tagName;
    this.setState({
      draggingElement,
      draggingElementType: type,
      draggingElementIndex: index,
      draggingElementPosition: position,
    });
  };

  chartDraw = () => {
    let { data, nCandle, tempData, playChart } = this.state;
    const {
      candleIndex: { startCandle, endCandle },
    } = this.props;
    data = dbData.slice(startCandle, endCandle);
    tempData = dbData.slice(startCandle, endCandle);
    this.setState({ data, tempData });
    //dynamic data feed
    let dbDataLength = dbData.length;
    let candleSpeedInSec = 2;
    let lastIndexAfterSlice = data.length - 1;

    let candleSpeedInMilSec = candleSpeedInSec * 1000;
    let dynamicCandleSpeedInMilSec = candleSpeedInMilSec * 0.2; //always keep speed greater than 1 sec
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
      let { data } = this.state;
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
          tempData = [...tempData, dynamicCandleData];
          data = tempData.slice(0).slice(nCandle);
        }
        if (dynamicCandleCounter > 0) {
          tempData[index] = dynamicCandleData;
          let dynamicDataLastIndex = data.length - 1;
          data[dynamicDataLastIndex] = tempData[index];
        }
        if (dynamicCandleCounter >= 2) {
          this.stopDynamicDataWorker();
          if (playChart) {
            if (tempData.length === dbDataLength)
              this.stopSingleCandleDataWebWorkerInstance();
          } else {
            this.stopSingleCandleDataWebWorkerInstance();
          }
        }
        const { storeState } = this.props;
        let { xRange } = storeState;
        //d3 functions calculated data;
        const dateArray = getDateArray(data);
        const xAxisFunction = getXAxisFunction(dateArray, xRange);
        const xTickValue = getXAxisTickValue(dateArray);
        this.setState({ data, xAxisFunction, xTickValue });
      };
    };
  };
  getLineProps = (candleData, xAxisBandWidth, yAxisFunction) => {
    const { open, close, high, low } = candleData;
    let linePoints = getLinePoints(high, low, xAxisBandWidth, yAxisFunction);
    let lineProps = {
      ...linePoints,
      strokeWidth: highLowLineWidth,
      stroke: open <= close ? green : red,
    };
    return lineProps;
  };
  getPolygonProps = (open, close, xAxisBandWidth, yAxisFunction) => {
    let candleStyle = {
      stroke: "none",
      fill: open <= close ? green : red,
    };
    //getPolygonPoints
    let polygonPoints = getPolygonPoints(
      open,
      close,
      xAxisBandWidth,
      yAxisFunction
    );

    let polygonProps = {
      ...polygonPoints,
      style: candleStyle,
    };

    return polygonProps;
  };
  getXAxisTickPosition = (tick, midPoint, index, xAxisFunction, dragValue) => {
    let xValue = xAxisFunction(tick) + midPoint;
    let returnProps = {
      key: "bottomAxis" + index,
      transform: `translate(${xValue + dragValue},0)`,
    };
    return returnProps;
  };
  tickValueProps = (date, prevDate = null) => {
    return {
      attribute: { fill: lightGrey, y: "9", dy: "0.71em" },
      data: getFormattedDate(date, prevDate),
    };
  };
  getYScaleValuePosition = (value, index, yAxisFunction) => {
    return {
      key: "yScale" + index,
      transform: `translate(0,${yAxisFunction(value)})`,
    };
  };
  getScaleValuesProps = (value) => {
    return {
      attribute: { fill: lightGrey, x: "-9", dy: "0.32em" },
      data: value,
    };
  };
  getTitle(date, open, close, high, low) {
    let formattedDate = getLongDate(new Date(date));
    let formattedOpen = getFormattedValue(open);
    let formattedClose = getFormattedValue(close);
    let formattedHigh = getFormattedValue(high);
    let formattedLow = getFormattedValue(low);
    let percentageChange = getPercentageValue(open, close);
    let titleData = `${formattedDate}
    Open: ${formattedOpen}
    Close: ${formattedClose}
    Change: ${percentageChange}
    Low: ${formattedLow}
    High: ${formattedHigh}`;
    return { titleData };
  }
  render() {
    const {
      data,
      mousePointX: mouseTrackHorizontalPoint,
      mousePointY: mouseTrackVerticalPoint,
      dragValue,
      trendLine,
      horizontalLine,
    } = this.state;

    const { storeState } = this.props;
    let { xRange } = storeState;
    //d3 functions calculated data;
    const dateArray = getDateArray(data);
    const xAxisFunction = getXAxisFunction(dateArray, xRange);
    const yAxisFunction = getYAxisFunction(data);
    const xAxisBandWidth = getXAxisBandWidth(xAxisFunction);
    const xTickValue = getXAxisTickValue(dateArray);
    this.tickValuesForPlot = xTickValue;
    const xAxisBandWidthMidPoint = xAxisBandWidth / 2;
    const yScaleValues = getYScaleValues(data);
    //props predefined
    let bottomAxisSVGGroupProps = {
      fill: "none",
      transform: `translate(0,${viewBoxHeight})`,
      ...scaleFontStyle,
      textAnchor: "middle",
    };
    let bottomAxisPathProps = {
      className: "domain",
      ...lightYellowStroke,
      d: `M40.5,6V0.5H${viewBoxWidth + viewBoxX}`,
      strokeWidth: "1.5",
      strokeOpacity: "0.5",
    };
    let tickVerticalLineProps = {
      ...lightYellowStroke,
      y2: "6",
    };
    let xAxisToTopLineProps = {
      ...orangeStroke,
      y2: `-${bottomPoint}`,
      strokeWidth: "0.8",
      strokeOpacity: "0.2",
    };
    let yScaleSVGGroupProps = {
      fill: "none",
      transform: "translate(40 0)",
      ...scaleFontStyle,
      textAnchor: "end",
    };
    let yScalePathProps = {
      ...lightYellowStroke,
      strokeWidth: "1.5",
      d: `M-6,${bottomPoint}.5H0.5V-10`,
      strokeOpacity: "0.5",
    };
    let yScaleToLeftLineProps = {
      ...lightYellowStroke,
      x2: "-6",
      strokeWidth: "0.8",
    };
    let yScaleToRightLineProps = {
      ...orangeStroke,
      x2: width,
      strokeWidth: "0.6",
      strokeOpacity: "0.2",
    };
    let getMAPoint = () => {};
    let yScaleMAPathProps = {
      ...lightYellowStroke,
      d: getMAPoint(),
      strokeWidth: "1.5",
      strokeOpacity: "0.5",
    };
    let candleStickClipId = "candleStickClip";
    let candleStickClipPathProps = {
      id: candleStickClipId,
      width: 800,
      height: 300,
      x: 50,
      y: 0,
    };
    let xAxisClipId = "xAxisClip";
    let xAxisClipPathProps = {
      id: xAxisClipId,
      width,
      height,
      x: 45,
      y: -bottomPoint,
    };
    let yAxisClipId = "yAxisClip";
    let yAxisClipPathProps = {
      id: yAxisClipId,
      width,
      height,
      x: -50,
      y: 0,
    };
    // if (trendLine.length > 0) {
    //   trendLine.map((data, index) => {
    //     let { x1: xPosition } = data;
    //     let closestValue = xTickValue.reduce((prev, current, currIndex) => {
    //       let prevXPosition = xAxisFunction(prev) + xAxisBandWidthMidPoint;
    //       let currentXPosition =
    //         xAxisFunction(current) + xAxisBandWidthMidPoint;
    //       let nearestPoint =
    //         Math.abs(prevXPosition - xPosition) <
    //         Math.abs(currentXPosition - xPosition)
    //           ? prev
    //           : current;
    //       return nearestPoint;
    //     });

    //     trendLine[0]["x1"] =
    //       xAxisFunction(closestValue) + xAxisBandWidthMidPoint;
    //     // this.setState({ trendLine });
    //     console.log("closestValue", closestValue);
    //   });
    // }

    let position1 = ["x1", "y1"];
    let position2 = ["x2", "y2"];
    return (
      <SVGComponent {...svgStyle} ref={this.svgNode}>
        {/* To Do move yRange to redux state then check here to display none for crosshair */}
        <LineComponent
          {...{
            x1: 40,
            x2: 800,
            y1: mouseTrackVerticalPoint,
            y2: mouseTrackVerticalPoint,
            style: {
              stroke: "rgb(255,255,255)",
              strokeWidth: 0.5,
              strokeDasharray: 3,
            },
          }}
        />
        <LineComponent
          {...{
            x1: mouseTrackHorizontalPoint,
            x2: mouseTrackHorizontalPoint,
            y1: 0,
            y2: 300,
            style: {
              display:
                mouseTrackHorizontalPoint < xRange[0] ||
                mouseTrackHorizontalPoint > xRange[1]
                  ? "none"
                  : null,
              stroke: "rgb(255,255,255)",
              strokeWidth: 0.5,
              strokeDasharray: 3,
            },
          }}
        />
        {/* {Candle stick clip to hide overflow} */}
        <ClipPathComponent {...candleStickClipPathProps} />
        {/* {Candle + high-low line drawings} */}
        <SVGGroupComponent
          clipPath={`url(#${candleStickClipId})`}
          {...svgGroupRootStyle}
        >
          <text
            x={150}
            y={100}
            font-size="40px"
            font-style="bold"
            fill="#212529"
          >
            BETA.Version - vveeo.com
          </text>
          {data.map((candleData, i) => {
            const { open, close, high, low, date } = candleData;
            return (
              <SVGGroupComponent
                transform={getTranslateXAxisPoint(
                  xAxisFunction,
                  candleData,
                  dragValue
                )}
                key={i}
              >
                <LineComponent
                  {...this.getLineProps(
                    candleData,
                    xAxisBandWidth,
                    yAxisFunction
                  )}
                />
                <PolygonComponent
                  {...this.getPolygonProps(
                    candleData.open,
                    candleData.close,
                    xAxisBandWidth,
                    yAxisFunction
                  )}
                >
                  <TitleComponent
                    {...this.getTitle(date, open, close, high, low)}
                  />
                </PolygonComponent>
              </SVGGroupComponent>
            );
          })}
        </SVGGroupComponent>
        {/* {X Axis clip to hide overflow} */}
        <ClipPathComponent {...xAxisClipPathProps} />
        {/* {horizontal X axis drawings} */}
        <SVGGroupComponent {...bottomAxisSVGGroupProps}>
          <PathComponent {...bottomAxisPathProps} />
          <SVGGroupComponent clipPath={`url(#${xAxisClipId})`}>
            {xTickValue.map((tick, index) => {
              return (
                <SVGGroupComponent
                  {...this.getXAxisTickPosition(
                    tick,
                    xAxisBandWidthMidPoint,
                    index,
                    xAxisFunction,
                    dragValue
                  )}
                >
                  <LineComponent {...xAxisToTopLineProps} />
                  <LineComponent {...tickVerticalLineProps} />
                  <TextComponent
                    {...this.tickValueProps(tick, xTickValue[index - 1])}
                  />
                </SVGGroupComponent>
              );
            })}
          </SVGGroupComponent>
        </SVGGroupComponent>
        {/* {vertical Y axis drawings} */}
        <ClipPathComponent {...yAxisClipPathProps} />
        <SVGGroupComponent {...yScaleSVGGroupProps}>
          <PathComponent {...yScalePathProps} />
          <SVGGroupComponent clipPath={`url(#${yAxisClipId})`}>
            {yScaleValues.map((value, index) => {
              return (
                <SVGGroupComponent
                  {...this.getYScaleValuePosition(value, index, yAxisFunction)}
                >
                  <LineComponent {...yScaleToLeftLineProps} />
                  <LineComponent {...yScaleToRightLineProps} />
                  <TextComponent {...this.getScaleValuesProps(value)} />
                </SVGGroupComponent>
              );
            })}
          </SVGGroupComponent>
        </SVGGroupComponent>
        {/* {moving average path} */}
        <SVGGroupComponent fill="none" clipPath={`url(#${candleStickClipId})`}>
          <PathComponent {...yScaleMAPathProps} />
        </SVGGroupComponent>
        {/* trendline */}
        {trendLine.map((data, index) => {
          let { x1, x2, y1, y2 } = data;
          x1 = xAxisFunction(x1) + xAxisBandWidthMidPoint + dragValue;
          x2 = xAxisFunction(x2) + xAxisBandWidthMidPoint + dragValue;
          return (
            <SVGGroupComponent
              key={"trendLine" + index}
              clipPath={`url(#${candleStickClipId})`}
            >
              <LineComponent
                {...{
                  x1,
                  x2,
                  y1,
                  y2,
                  "data-line": "trendLine",
                  "data-id": index,
                  style: {
                    stroke: "rgb(255,255,255)",
                    strokeWidth: 2,
                  },
                }}
              />
              <CircleComponent
                onMouseDown={this.customLineDragStart.bind(
                  this,
                  "trendLine",
                  position1,
                  index
                )}
                r="5"
                data-line="trendLine"
                data-id={index}
                cx={x1}
                cy={y1}
                style={{ fill: "white" }}
              />
              <CircleComponent
                onMouseDown={this.customLineDragStart.bind(
                  this,
                  "trendLine",
                  position2,
                  index
                )}
                r="5"
                cx={x2}
                cy={y2}
                data-line="trendLine"
                data-id={index}
                style={{ fill: "white" }}
              />
            </SVGGroupComponent>
          );
        })}
        {/* horizontal line */}
        {horizontalLine.map((data, index) => {
          let { y } = data;
          return (
            <SVGGroupComponent key={"horizontalLine" + index}>
              <LineComponent
                {...{
                  x1: 0,
                  x2: 800,
                  y1: y,
                  y2: y,
                  "data-line": "horizontalLine",
                  "data-id": index,
                  style: {
                    stroke: "rgb(255,255,255)",
                    strokeWidth: 2,
                  },
                }}
              />
              <CircleComponent
                onMouseDown={this.customLineDragStart.bind(
                  this,
                  "horizontalLine",
                  position1,
                  index
                )}
                r="5"
                cx={800 / 2}
                cy={y}
                data-line="horizontalLine"
                data-id={index}
                style={{ fill: "white" }}
              />
            </SVGGroupComponent>
          );
        })}
      </SVGComponent>
    );
  }
}

export default tsChildWrapper(ChartContainer);
