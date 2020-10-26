/*
 * Created on: Wed Oct 07 2020 10:01:21 PM
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
import { scaleBand as d3ScaleBand, scaleLog as d3ScaleLog } from "d3-scale";
import { range as d3ArrayRange, min as d3Min, max as d3Max } from "d3-array";
import { utcFormat as d3UTCFormat } from "d3-time-format";
import { format as d3Format } from "d3-format";

// let xRange = [50, 800]; //change with margin left, right
let yRange = [275, 0]; //change with height, margin top, bottom
let xIncrementSize = 5;
let yScaleIncrementValue = 2;

const getDateArray = (data) => {
  let dataArraySize = data.length;
  return d3ArrayRange(dataArraySize).map((i) => new Date(data[i].date));
};

const getXAxisFunction = (dateArray, xRange) => {
  return d3ScaleBand()
    .domain(dateArray)
    .range(xRange)
    .paddingInner(0.2)
    .paddingOuter(0.5);
};
const getYDomain = (data) => {
  let yDomain = [d3Min(data, (d) => d.low), d3Max(data, (d) => d.high)];
  return yDomain;
};
const getYAxisFunction = (data) => {
  let yDomain = getYDomain(data);
  return d3ScaleLog().domain(yDomain).rangeRound(yRange);
};

const getXAxisBandWidth = (xAxisFunction) => xAxisFunction.bandwidth();

const getTranslateXAxisPoint = (xAxisFunction, d, dragValue) =>
  `translate(${xAxisFunction(new Date(d.date)) + dragValue} ${0})`;

const getTranslateYAxisPoint = (yAxisFunction, d) =>
  `translate( ${0}) ${yAxisFunction(new Date(d.date))}`;

const getPolygonPoints = (openPrice, closePrice, bandWidth, yAxisFunction) => {
  let bandWidthMidPoint = bandWidth / 2;
  let candleWidth = bandWidth * 0.5; //candle size - 50% of bandwidth
  let halfCandle = candleWidth / 2;
  let x1 = bandWidthMidPoint - halfCandle;
  let x2 = bandWidthMidPoint + halfCandle;

  let y1 = yAxisFunction(openPrice);
  let y2 = yAxisFunction(closePrice);
  y2 = y1 === y2 ? y2 + 2 : y2;
  let points = `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}`;
  return { points };
};

const getLinePoints = (highPrice, lowPrice, bandWidth, yAxisFunction) => {
  let bandWidthMidPoint = bandWidth / 2;
  let x1 = bandWidthMidPoint;
  let x2 = bandWidthMidPoint;
  let y1 = yAxisFunction(highPrice);
  let y2 = yAxisFunction(lowPrice);
  return {
    x1,
    x2,
    y1,
    y2,
  };
};

const getXAxisTickValue = (dateArray) => {
  xIncrementSize = Math.ceil(dateArray.length / 25);
  let xTickValue = dateArray.filter(
    (value, index) => index % xIncrementSize === 0
  );
  return xTickValue;
};

const getFormattedDate = (date, prevDate = null) => {
  if (prevDate && date.getDate() !== prevDate.getDate()) {
    if (prevDate && date.getMonth() !== prevDate.getMonth()) {
      if (date.getYear() !== prevDate.getYear()) {
        return getLongYear(date);
      }
      return getShortMonthName(date);
    }
    return date.getDate();
  }
  return getShortDate(date);
};
const getShortMonthName = (date) => {
  let format = d3UTCFormat("%b");
  return format(date);
};
const getShortDate = (date) => {
  let format = d3UTCFormat("%d/%b");
  return format(date);
};
const getLongDate = (date) => {
  let format = d3UTCFormat("%d/%B/%Y");
  return format(date);
};
const getLongYear = (date) => {
  let format = d3UTCFormat("%Y");
  return format(date);
};

const getYScaleValues = (data) => {
  let yMaxValue = d3Max(data, (d) => Math.ceil(d.high));
  let yMinValue = d3Min(data, (d) => Math.floor(d.low));
  yScaleIncrementValue = (yMaxValue - yMinValue) / 10;
  let yScaleValues = d3ArrayRange(yMinValue, yMaxValue, yScaleIncrementValue);
  return yScaleValues;
};

const getFormattedValue = (value) => {
  let format = d3Format(".2f");
  return format(value);
};
const getPercentageValue = (y0, y1) => {
  let format = d3Format("+.2%");
  return format((y1 - y0) / y0);
};

const getMAPathPoints = (
  xAxisFunction,
  yAxisFunction,
  lineTotalValue,
  MAType = "DEFAULT"
) => {
  const {
    totalHigh,
    totalLow,
    totalOpen,
    totalClose,
    date,
    candleCount,
  } = lineTotalValue;
  let newPoint = 0;
  switch (MAType) {
    case "HLC":
      newPoint =
        (totalHigh / candleCount +
          totalLow / candleCount +
          totalClose / candleCount) /
        3;
      break;
    case "OC":
      newPoint = (totalOpen / candleCount + totalClose / candleCount) / 2;
      break;

    default:
      newPoint = (totalHigh / candleCount + totalLow / candleCount) / 2;
      break;
  }
  let newPath = {
    x: xAxisFunction(new Date(date)) + getXAxisBandWidth(xAxisFunction) / 2,
    y: yAxisFunction(newPoint),
  };
  return newPath;
};

export {
  getDateArray,
  getXAxisFunction,
  getYAxisFunction,
  getXAxisBandWidth,
  getTranslateXAxisPoint,
  getTranslateYAxisPoint,
  getLinePoints,
  getPolygonPoints,
  getXAxisTickValue,
  getFormattedDate,
  getYScaleValues,
  getFormattedValue,
  getPercentageValue,
  getLongDate,
  getShortDate,
  getMAPathPoints,
};
