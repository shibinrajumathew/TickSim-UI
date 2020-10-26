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
const counter = (counter = 0, action) => {
  const { type, payload } = action;
  if (type === INCREMENT) {
    counter = counter + payload;
    return counter;
  }
  if (type === DECREMENT) {
    counter -= payload;
    return counter;
  }
  return counter;
};
export default counter;
