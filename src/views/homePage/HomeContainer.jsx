/*
 * Created on: Wed Oct 07 2020 10:00:49 PM
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
import HomeComponent from "./HomeComponent";
class HomeContainer extends Component {
  render() {
    const { incrementXRange, decrementXRange } = this.props;
    // let { xRange } = storeState;
    return (
      <div
        onWheel={(e) => {
          let { deltaY } = e;
          switch (true) {
            case deltaY > 0:
              incrementXRange([1, 0]);
              break;
            case deltaY < 0:
              decrementXRange([0, 1]);
              break;
            default:
              break;
          }
        }}
      >
        {/* <h1>testing state rendering {`${xRange[0]}, ${xRange[1]}`}</h1> */}
        {/* <button onClick={() => tsContainerDispatch(increment(2))}>
          counter test app
        </button> */}
        <HomeComponent />
      </div>
    );
  }
}

export default HomeContainer;
