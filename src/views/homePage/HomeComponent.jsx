/*
 * Created on: Wed Oct 07 2020 10:02:50 PM
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
  tsComponentDispatch,
  tsComponentState,
} from "../../utils/storeManager";

import { incrementX1Only } from "../common/stateManagers/actions/xRangeActions";

const HomeComponent = (props) => {
  const xRange = tsComponentState((state) => state.xRange);
  const dispatch = tsComponentDispatch();
  console.log("counter", xRange);

  console.log("inside home component");
  return (
    <div>
      <h1>Default title {xRange[0]}</h1>
      <button onClick={() => dispatch(incrementX1Only([1, 0]))}>
        {" "}
        counter test app
      </button>
    </div>
  );
};

export default HomeComponent;
