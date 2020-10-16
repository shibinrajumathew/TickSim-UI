/*
 * Created on: Wed Oct 07 2020 10:02:30 PM
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
import { combineReducers } from "redux";
import counter from "./counter";
import xRange from "./xRange";

const reducers = combineReducers({ xRange, counter });

export default reducers;
