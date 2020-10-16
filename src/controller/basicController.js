/*
 * Created on: Wed Oct 07 2020 10:01:10 PM
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
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { tsWrapper } from "../utils/tsWrapper";
import HomeContainer from "../views/homePage/HomeContainer";
import TradingPlatformContainer from "../views/tradingPlatformPage/TradingPlatformContainer";

function basicController() {
  return (
    <Router>
      <Route render={tsWrapper(HomeContainer)} exact path={"/home"} />
      <Route
        render={tsWrapper(TradingPlatformContainer)}
        exact
        path={"/tradingPlatform"}
      />
    </Router>
  );
}

export default basicController;
