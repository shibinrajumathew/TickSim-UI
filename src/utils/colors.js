/*
 * Created on: Wed Oct 07 2020 10:01:30 PM
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
import {
  schemePaired as d3SchemePaired,
  schemeSet3 as d3SchemeSet3,
} from "d3-scale-chromatic";
//colors
const preDefinedColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
  darkBlue: "rgb(1, 7, 21)",
  black: "rgb(0,0,0)",
};
const chartColors = {
  green: d3SchemePaired[3],
  red: d3SchemePaired[5],
  orange: d3SchemePaired[7],
  lightYellow: d3SchemeSet3[1],
  lightGrey: d3SchemeSet3[8],
};

export { preDefinedColors, chartColors };
