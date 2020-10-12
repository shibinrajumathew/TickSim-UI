/*
 * Created on: Wed Oct 07 2020 10:01:44 PM
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
import { createStore } from "redux";
import config from "../config";
import reducers from "../views/common/stateManagers/reducers";

const { devTool } = config;

const store = createStore(reducers, devTool);

const tsState = store.getState();

const tsDispatch = (action) => store.dispatch(action);

export { store, tsState, tsDispatch };
