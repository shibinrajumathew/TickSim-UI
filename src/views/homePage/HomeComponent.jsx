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

import { useSelector, useDispatch } from "react-redux";
import increment from "../common/stateManagers/actions/increment";

const HomeComponent = (props) => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  console.log("counter", counter);
  return (
    <div>
      <h1>Default title</h1>
      <button onClick={() => dispatch(increment(10))}>counter test app</button>
    </div>
  );
};

export default HomeComponent;
