/*
 * Created on: Wed Oct 07 2020 10:02:25 PM
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
import constants from "../../../../utils/constants";
const {
  stateManager: { actionType },
} = constants;
const { INCREMENT, DECREMENT } = actionType;
//REDUCER
const counter = (state = 0, action) => {
  const { type, payload } = action;
  if (type === INCREMENT) return payload;
  if (type === DECREMENT) return state - payload;
  return state;
};
export default counter;
