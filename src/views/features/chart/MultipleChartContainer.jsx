import React, { Component } from "react";
import ChartContainer from "./ChartContainer";
import candleData from "../../../utils/dummyData";

class MultipleChartContainer extends Component {
  render() {
    let svgDimension = {
      width: 700,
      height: 350,
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
    return (
      <React.Fragment>
        <ChartContainer
          type={sec}
          position={leftTop}
          svgDimension={svgDimension}
          candleData={candleData}
        />
        <ChartContainer
          type={min}
          svgDimension={svgDimension}
          position={rightTop}
          candleData={candleData}
        />
        <ChartContainer
          type={hour}
          svgDimension={svgDimension}
          position={leftBottom}
          candleData={candleData}
        />
        <ChartContainer
          type={day}
          svgDimension={svgDimension}
          position={rightBottom}
          candleData={candleData}
        />
      </React.Fragment>
    );
  }
}

export default MultipleChartContainer;
