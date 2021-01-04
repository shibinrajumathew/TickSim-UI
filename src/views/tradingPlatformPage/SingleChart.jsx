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
import { Container } from "../common/cssFrameworkComponents/CoreComponents";

class SingleChart extends Component {
  constructor(props) {
    super();
    this.state = {
      startCandle: 0,
      endCandle: 1,
      playChart: true,
    };
    this.setChartPlay = this.setChartPlay.bind(this);
  }
  setCandleIndex = (endCandle = 1, startCandle = 0) => {
    this.setState({
      startCandle,
      endCandle,
    });
  };
  setChartPlay = (playChart) => {
    this.setState({
      playChart,
    });
  };

  render() {
    const { startCandle, endCandle, playChart } = this.state;
    const candleIndex = { startCandle, endCandle };
    return (
      <Container className="mx-auto" fluid>
        <ChartContainer
          playChart={playChart}
          candleIndex={candleIndex}
          setCandleIndex={this.setCandleIndex}
          setChartPlay={this.setChartPlay}
        />
      </Container>
    );
  }
}

export default SingleChart;
