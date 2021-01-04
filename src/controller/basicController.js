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
import {
  Controller,
  PublicComponent,
  PrivateComponent,
  UnAuthenticatedComponent,
} from "../utils/route";
import MultipleChartContainer from "../views/features/chart/MultipleChartContainer";
import HomeContainer from "../views/homePage/HomeContainer";
import LoginContainer from "../views/loginPage/LoginContainer";
import TradingPlatformContainer from "../views/tradingPlatformPage/TradingPlatformContainer";

function basicController() {
  let PublicComponentsAttributes = [
    {
      component: HomeContainer,
      path: "/",
      exact: true,
    },
  ];
  // only for user not logged in or public
  let UnAuthenticatedComponentsAttributes = [
    {
      component: LoginContainer,
      path: "/login",
      redirectPath: "/tradingPlatform",
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
    {
      component: TradingPlatformContainer,
      path: "/tradeOnline",
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
      {UnAuthenticatedComponentsAttributes.map((attribute, index) => (
        <UnAuthenticatedComponent
          key={`unAuthenticatedComponent${index}`}
          {...attribute}
        />
      ))}
      {PrivateComponentAttributes.map((attribute, index) => (
        <PrivateComponent key={`privateComponent_${index}`} {...attribute} />
      ))}
    </Controller>
  );
}

export default basicController;
