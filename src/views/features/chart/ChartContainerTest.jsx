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
import { getMAPoint, slicedData as dbData } from "../../../utils/dummyData";

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
  clipPath: "url(#clip)",
};
let svgStyle = {
  width,
  height,
  viewBox,
  style: darkBlueBg,
};
let highLowLineWidth = 1;

let dataWebWorkerInstance = new webWorkerEnabler(dataWebWorker);

class ChartContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      data: dbData.slice(0, 1),
      tempData: dbData.slice(0, 1),
      nCandlesTotal: {
        totalHigh: 0,
        totalLow: 0,
        totalOpen: 0,
        totalClose: 0,
        date: null,
      },
      initialMAPath: [],
      nCandlesTotalArray: [],
      nCandle: 25,
      maNCandle: 5,
    };
  }
  componentDidMount() {
    //dynamic data feed
    let i = 6;
    let dbDataLength = dbData.length;
    let candleSpeedInSec = 1;
    let candleSpeedInMilSec = candleSpeedInSec * 1000;
    let dynamicCandleSpeedInMilSec = candleSpeedInMilSec * 0.3;
    let { data, nCandlesTotalArray, nCandle, maNCandle, tempData } = this.state;
    // nCandlesTotalArray = getMAPoint();
    data.map((data, i) => {
      let { date } = data;
      let dummyDataIndicator = {
        totalHigh: 1,
        totalLow: 1,
        totalOpen: 1,
        totalClose: 1,
        date,
        candleCount: 1,
      };
      nCandlesTotalArray = [...nCandlesTotalArray, dummyDataIndicator];
      return nCandlesTotalArray;
    });

    dataWebWorkerInstance.postMessage({ candleSpeedInMilSec, dbData });
    dataWebWorkerInstance.onmessage = (e) => {
      let {
        data: { candleData, index },
      } = e;
      let { data } = this.state;

      let dynamicDataWorkerInstance = new webWorkerEnabler(
        dynamicDataWebWorker
      );
      dynamicDataWorkerInstance.postMessage({
        candleData,
        dynamicCandleSpeedInMilSec,
      });
      dynamicDataWorkerInstance.onmessage = (e) => {
        let {
          data: { dynamicCandleData, dynamicCandleCounter },
        } = e;
        if (dynamicCandleCounter === 1) {
          tempData = [...tempData, dynamicCandleData];
          data = tempData.slice(0).slice(-nCandle);
        }
        if (dynamicCandleCounter > 1) {
          tempData[index] = dynamicCandleData;
          let dynamicDataLastIndex = data.length - 1;
          data[dynamicDataLastIndex] = tempData[index];
        }
        if (dynamicCandleCounter >= 3) {
          dynamicDataWorkerInstance.terminate();
          // data = data.slice(0).slice(-nCandle);
        }
        this.setState({ data });
      };

      if (tempData.length === dbDataLength) dataWebWorkerInstance.terminate();
    };
  }
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
  getXAxisTickPosition = (tick, midPoint, index, xAxisFunction) => {
    let xValue = xAxisFunction(tick) + midPoint;
    let returnProps = {
      key: "bottomAxis" + index,
      transform: `translate(${xValue},0)`,
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
      key: "yscale" + index,
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
    const { data } = this.state;
    //d3 functions calculated data;
    const dateArray = getDateArray(data);
    const xAxisFunction = getXAxisFunction(dateArray);
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
      d: `M40.5,6V0.5H${viewBoxWidth}`,
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
    let clipPathProps = {
      id: "clip",
      width: 800,
      height: 300,
      x: 50,
    };

    return (
      <SVGComponent {...svgStyle}>
        <ClipPathComponent {...clipPathProps} />
        <SVGGroupComponent {...svgGroupRootStyle}>
          {data.map((candleData, i) => {
            const { open, close, high, low, date } = candleData;
            return (
              <SVGGroupComponent
                transform={getTranslateXAxisPoint(xAxisFunction, candleData)}
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
        <SVGGroupComponent {...bottomAxisSVGGroupProps}>
          <PathComponent {...bottomAxisPathProps} />
          {xTickValue.map((tick, index) => {
            return (
              <SVGGroupComponent
                {...this.getXAxisTickPosition(
                  tick,
                  xAxisBandWidthMidPoint,
                  index,
                  xAxisFunction
                )}
              >
                <LineComponent {...tickVerticalLineProps} />
                <LineComponent {...xAxisToTopLineProps} />
                <TextComponent
                  {...this.tickValueProps(tick, xTickValue[index - 1])}
                />
              </SVGGroupComponent>
            );
          })}
        </SVGGroupComponent>
        <SVGGroupComponent {...yScaleSVGGroupProps}>
          <PathComponent {...yScalePathProps} />
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
        {}
        <SVGGroupComponent fill="none" clipPath="url(#clip)">
          <PathComponent {...yScaleMAPathProps} />
        </SVGGroupComponent>
      </SVGComponent>
    );
  }
}

export default ChartContainer;
