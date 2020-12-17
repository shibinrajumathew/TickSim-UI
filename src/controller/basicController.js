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
import { Controller, PublicComponent, PrivateComponent } from "../utils/route";
import MultipleChartContainer from "../views/features/chart/MultipleChartContainer";
import HomeContainer from "../views/homePage/HomeContainer";
import LoginContainer from "../views/loginPage/LoginContainer";
import MultiTradingPlatformContainer from "../views/tradingPlatformPage/MultiTradingPlatformContainer";
import SingleChart from "../views/tradingPlatformPage/SingleChart";
import TradingPlatformContainer from "../views/tradingPlatformPage/TradingPlatformContainer";

function basicController() {
  let PublicComponentsAttributes = [
    {
      component: HomeContainer,
      path: "/",
      exact: true,
    },
    {
      component: LoginContainer,
      path: "/login",
      redirectPath: "/tradingPlatform",
      exact: true,
    },
    {
      component: MultiTradingPlatformContainer,
      path: "/multiTradingPlatform",
      exact: true,
    },
    {
      component: SingleChart,
      path: "/singleChart",
      exact: true,
    },
  ];
  // NOTE: PRIVATE components Attributes eg: demo trading
  let PrivateComponentAttributes = [
    {
      component: MultipleChartContainer,
      path: "/tradingPlatform",
      exact: true,
      redirectPath: "/login",
    },
  ];
  //Controller Begins
  return (
    <Controller>
      {PublicComponentsAttributes.map((attribute, index) => (
        <PublicComponent key={`publicComponent_${index}`} {...attribute} />
      ))}
      {PrivateComponentAttributes.map((attribute, index) => (
        <PrivateComponent key={`privateComponent_${index}`} {...attribute} />
      ))}
    </Controller>
  );
}

export default basicController;
