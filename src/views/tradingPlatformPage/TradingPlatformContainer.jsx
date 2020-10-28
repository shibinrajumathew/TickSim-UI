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
import ChartContainer from "../features/chart/ChartContainerTest";
import {
  Container,
  Col,
  Row,
} from "../common/cssFrameworkComponents/CoreComponents";

class TradingPlatformContainer extends Component {
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
    console.log("endCandle::::inside parent container", endCandle);
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
      <Container className="mx-auto">
        <Col className="mt-5 px-auto">
          <h5>Simulator Trading Platform</h5>
        </Col>
        <Col className="my-5">
          <Row>
            <ChartContainer
              playChart={playChart}
              candleIndex={candleIndex}
              setCandleIndex={this.setCandleIndex}
              setChartPlay={this.setChartPlay}
            />
          </Row>
        </Col>
      </Container>
    );
  }
}

export default TradingPlatformContainer;
