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
import {
  useSelector as tsComponentState,
  useDispatch as tsComponentDispatch,
} from "react-redux";

const { devTool } = config;
//react redux only store (not react-redux) starts
const store = createStore(reducers, devTool);

const tsContainerGetState = store.getState();

const tsContainerState = store.subscribe(() => tsContainerGetState);

const tsContainerDispatch = (action) => store.dispatch(action);

export {
  store,
  tsContainerState,
  tsContainerDispatch,
  tsComponentDispatch,
  tsComponentState,
  tsContainerGetState,
};
