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
import increment from "../common/stateManagers/actions/increment";
import { tsDispatch, tsState } from "../../utils/storeManager";
import HomeComponent from "./HomeComponent";
class HomeContainer extends Component {
  render() {
    const { counter } = tsState;
    console.log("states inside container", counter);
    return (
      <div>
        <button onClick={() => tsDispatch(increment(2))}>
          counter test app
        </button>
        <HomeComponent />
      </div>
    );
  }
}

export default HomeContainer;
