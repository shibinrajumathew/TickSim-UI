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
  getMAPathPoints,
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
import { drag } from "d3";

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
let width = 840;
let height = 350;
let viewBoxWidth = 850;
let viewBoxHeight = 300;
let viewBoxX = -50;
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

let dataWebWorkerInstance = undefined;
let dynamicDataWorkerInstance = undefined;

class ChartContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      tempData: [],
      nCandlesTotal: {
        totalHigh: 0,
        totalLow: 0,
        totalOpen: 0,
        totalClose: 0,
        date: null,
      },
      initialMAPath: [],
      nCandlesTotalArray: [],
      nCandle: -100,
      maNCandle: 5,
      startCandle: 0,
      endCandle: 1,
      mousePointX: 0,
      mousePointY: 0,
      xRange: [],
      isDragging: false,
      dragValue: 0,
      trendLine: [],
      horizontalLine: [],
    };
    this.svgNode = React.createRef();
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
  }
  getDataWebWorkerInstance = () => {
    if (dataWebWorkerInstance === undefined)
      dataWebWorkerInstance = new webWorkerEnabler(dataWebWorker);
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
  stopDataWebWorkerInstance = () => {
    if (dataWebWorkerInstance !== undefined) {
      dataWebWorkerInstance.terminate();
      dataWebWorkerInstance = undefined;
    }
  };
  componentDidMount() {
    this.chartDraw();
    const nonPassiveEvents = {
      passive: false,
    };
    const svgNode = this.svgNode.current;

    document.addEventListener("keyup", this.onKeyPress, nonPassiveEvents);
    svgNode.addEventListener("wheel", this.onMouseWheel, nonPassiveEvents);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.onKeyPress);
    this.svgNode.current.removeEventListener("wheel", this.onMouseWheel);
  }
  // isWithInSvgBoundary = (mousePointX, mousePointY) => {
  //   let isWithInSvgBoundary = true;
  //   if (mousePointX < 40 || mousePointX > 800) isWithInSvgBoundary = false;
  //   // if(mousePointY //somecondition) isWithInSvgBoundary=false;
  //   return isWithInSvgBoundary;
  // };
  //event handlers
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
    //To Do remove below line after implementation
    this.setState({
      xRange: [
        this.svgNode.current.clientWidth,
        this.svgNode.current.clientHeight,
      ],
    });
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
  drawTrendLine() {
    let { trendLine, mousePointX: x, mousePointY: y } = this.state;
    console.log("received x, y", x, y);
    let newLine = {
      x1: x,
      x2: x + 250,
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
    console.log("svg:", e);
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
    } = e;
    if (tagName === "svg") {
      let { isDragging, mousePointX } = this.state;
      isDragging = true;
      console.log("e.currentTarget", e.currentTarget.tagName);
      this.setState({
        isDragging,
        xPositionBeforeDrag: mousePointX,
        draggingElement: tagName,
      });
    }
  };
  svgOnDragging = (xAxisBandWidth, e) => {
    this.handleCrossWire(e);
    console.log("svg drag end");
    let {
      isDragging,
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
      console.log("draggingElement", draggingElement);
      this.handleSvgDrag(xAxisBandWidth, xPositionBeforeDrag);
    }
    if (draggingElement === "circle" && draggingElementType === "trendLine") {
      console.log(
        "inside circle dragging of svg",
        draggingElementIndex,
        draggingElementPosition
      );
      let xPosition = draggingElementPosition[0];
      let yPosition = draggingElementPosition[1];
      trendLine[draggingElementIndex][xPosition] = mousePointX;
      trendLine[draggingElementIndex][yPosition] = mousePointY;
    }
    if (
      draggingElement === "circle" &&
      draggingElementType === "horizontalLine"
    ) {
      horizontalLine[draggingElementIndex]["y"] = mousePointY;
    }
    this.setState({ trendLine });
  };

  svgDragEnd = (e) => {
    console.log("svg drag end");
    this.setState({
      isDragging: false,
      draggingElement: null,
      draggingElementIndex: null,
    });
  };
  handleSvgDrag = (xAxisBandWidth, initialX) => {
    let { mousePointX, mousePointY, dragValue } = this.state;
    const { storeState } = this.props;
    let { xRange } = storeState;
    if (initialX < mousePointX) dragValue += xAxisBandWidth * 0.5;
    else dragValue -= xAxisBandWidth * 0.5;
    console.log("dragValue", dragValue, xRange);
    console.log("inside iif dragvalue between xrange");
    this.setState({
      dragValue,
      xPositionBeforeDrag: mousePointX,
    });
  };

  customLineDragStart = (type, position, index, e) => {
    e.stopPropagation();
    let {
      currentTarget: { tagName },
      button,
    } = e;
    console.log("button clicked", button === 0 ? "left" : "right");
    this.setState({
      draggingElement: tagName,
      draggingElementType: type,
      isDragging: true,
      draggingElementIndex: index,
      draggingElementPosition: position,
    });
  };

  chartDraw = () => {
    let { data, nCandle, tempData, startCandle, endCandle } = this.state;
    data = dbData.slice(startCandle, endCandle);
    tempData = dbData.slice(startCandle, endCandle);
    this.setState({ data, tempData });
    //dynamic data feed
    let dbDataLength = dbData.length;
    let candleSpeedInSec = 2;

    let candleSpeedInMilSec = candleSpeedInSec * 1000;
    let dynamicCandleSpeedInMilSec = candleSpeedInMilSec * 0.2; //always keep speed greater than 1 sec
    if (dataWebWorkerInstance === undefined) this.getDataWebWorkerInstance();

    dataWebWorkerInstance.postMessage({ candleSpeedInMilSec, dbData });
    dataWebWorkerInstance.onmessage = (e) => {
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
          if (tempData.length === dbDataLength)
            this.stopDataWebWorkerInstance();
        }
        if (dynamicCandleCounter >= 2) {
          this.stopDynamicDataWorker();
        }
        this.setState({ data });
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
      y2: "-300",
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
      d: "M-6,300.5H0.5V-10",
      strokeWidth: "1.5",
      strokeOpacity: "0.5",
    };
    let yScaleToLeftLineProps = {
      ...lightYellowStroke,
      x2: "-6",
      strokeWidth: "0.8",
    };
    let yScaleToRightLineProps = {
      ...orangeStroke,
      x2: "800",
      strokeWidth: "0.6",
      strokeOpacity: "0.2",
    };
    let getMAPoint = () => {
      let { nCandlesTotalArray, data } = this.state;
      let path = null;
      const yAxisFunction = getYAxisFunction(data);
      nCandlesTotalArray.map((data, i) => {
        let newMAPoint = getMAPathPoints(xAxisFunction, yAxisFunction, data);
        path = `${i === 0 ? "M" : path + "L"} ${newMAPoint.x} ${newMAPoint.y}`;
        return path;
      });
      return path;
    };
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
      width: 750,
      height: 320,
      x: 45,
      y: -300,
    };
    let yAxisClipId = "yAxisClip";
    let yAxisClipPathProps = {
      id: yAxisClipId,
      width: 850,
      height: 300,
      x: -50,
      y: 0,
    };

    let position1 = ["x1", "y1"];
    let position2 = ["x2", "y2"];
    return (
      <SVGComponent
        {...svgStyle}
        ref={this.svgNode}
        onMouseMove={this.svgOnDragging.bind(this, xAxisBandWidth)}
        onMouseDown={this.svgDragStart}
        onMouseUp={this.svgDragEnd}
      >
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
                onMouseDown={(e) => {
                  console.log(
                    "inside on mouseDown",
                    e,
                    e.currentTarget,
                    e.currentTarget.getAttribute("x1")
                  );
                }}
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
          return (
            <SVGGroupComponent key={"trendLine" + index}>
              <LineComponent
                {...{
                  x1,
                  x2,
                  y1,
                  y2,
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
