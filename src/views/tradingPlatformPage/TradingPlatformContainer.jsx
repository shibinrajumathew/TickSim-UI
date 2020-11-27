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
  Input,
  Button,
  Table,
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
      <Container className="mx-auto" fluid>
        {/* <Col className="mt-5 p-0">
          <h5>Simulator Trading Platform</h5>
        </Col> */}
        <Row>
          <Col className="my-5" xs={6}>
            <ChartContainer
              playChart={playChart}
              candleIndex={candleIndex}
              setCandleIndex={this.setCandleIndex}
              setChartPlay={this.setChartPlay}
            />
          </Col>
          <Col xs={2} className="p-0 m-0 ">
            <Col className="m-0 ">
              <Input
                type="number"
                className="rounded-0 mt-3 mb-2 bg-dark border-0 text-light"
                placeholder="Quantity"
              />
              <Input
                type="number"
                className="rounded-0 mb-2  bg-dark  border-0 text-light"
                placeholder="Limit Price"
              />
              <Input
                type="number"
                className="rounded-0 mb-2  bg-dark  border-0 text-light"
                placeholder="Target"
              />
              <Input
                type="number"
                className="rounded-0 mb-2  bg-dark  border-0 text-light"
                placeholder="StopLoss"
              />
              <Input
                type="number"
                className="rounded-0 mb-2  bg-dark  border-0 text-light"
                placeholder="Risk : Reward"
                disabled
              />

              <Button
                color="success"
                className="rounded-0 col-6  mb-2  border-0"
              >
                Buy
              </Button>
              <Button color="danger" className="rounded-0 col-6 mb-2  border-0">
                Sell
              </Button>
              <Button color="success" className="rounded-0 col-6  border-0">
                Buy @ Market Price
              </Button>
              <Button color="danger" className="rounded-0 col-6  border-0">
                Sell @ Market Price
              </Button>
            </Col>
          </Col>
          <Col xs={3} className="m-0 p-0 mt-3">
            <Table dark striped className="text-muted">
              <thead>
                <tr>
                  <th scope="col">Bid</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Offers</th>
                  <th scope="col">Qty</th>
                </tr>
              </thead>

              <tbody className="text-light">
                <tr scope="row">
                  <td>174.45</td>
                  <td>125463</td>
                  <td>175.00</td>
                  <td>3255</td>
                </tr>
                <tr scope="row">
                  <td>174.45</td>
                  <td>125463</td>
                  <td>175.00</td>
                  <td>3255</td>
                </tr>
                <tr>
                  <td>174.45</td>
                  <td>125463</td>
                  <td>175.00</td>
                  <td>3255</td>
                </tr>
                <tr>
                  <td>174.45</td>
                  <td>125463</td>
                  <td>175.00</td>
                  <td>3255</td>
                </tr>
                <tr>
                  <td>174.45</td>
                  <td>125463</td>
                  <td>175.00</td>
                  <td>3255</td>
                </tr>
              </tbody>
            </Table>
            <Col>
              <Row>
                <h5>{"P&L: "}</h5>
                <h5 className="text-danger"> &nbsp;{" -1,32,025.21"}</h5>
              </Row>
              <Row>
                <h5>{"A/c Balance: "}</h5>
                <h5 className="text-success"> &nbsp;{" 1,32,025.21"}</h5>
              </Row>
            </Col>
          </Col>
        </Row>
        <Row>
          <Table dark striped>
            <thead>
              <tr>
                <th scope="col">Bid</th>
                <th scope="col">Qty</th>
                <th scope="col">Offers</th>
                <th scope="col">Qty</th>
              </tr>
            </thead>

            <tbody className="text-light">
              <tr scope="row">
                <td>174.45</td>
                <td>125463</td>
                <td>175.00</td>
                <td>3255</td>
              </tr>
              <tr scope="row">
                <td>174.45</td>
                <td>125463</td>
                <td>175.00</td>
                <td>3255</td>
              </tr>
              <tr scope="row">
                <td>174.45</td>
                <td>125463</td>
                <td>175.00</td>
                <td>3255</td>
              </tr>
              <tr scope="row">
                <td>174.45</td>
                <td>125463</td>
                <td>175.00</td>
                <td>3255</td>
              </tr>
              <tr scope="row">
                <td>174.45</td>
                <td>125463</td>
                <td>175.00</td>
                <td>3255</td>
              </tr>
              <tr scope="row">
                <td>174.45</td>
                <td>125463</td>
                <td>175.00</td>
                <td>3255</td>
              </tr>
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export default TradingPlatformContainer;
