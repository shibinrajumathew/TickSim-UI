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
const {
  xRange: {
    INCREMENT_X1_ONLY,
    INCREMENT_X2_ONLY,
    DECREMENT_X1_ONLY,
    DECREMENT_X2_ONLY,
  },
} = actionType;
//REDUCER
const xRange = (xRangeState = [40, 840], action) => {
  const { type } = action;
  //Increment
  if (type === INCREMENT_X1_ONLY) {
    let response = [...xRangeState];
    response[0] += Math.abs(response[0] - response[1]) * 0.5;
    if (Math.abs(response[0] - response[1]) < 600) return xRangeState;
    console.log("inside 1", response[0]);
    return response;
  }
  if (type === INCREMENT_X2_ONLY) {
    let response = [...xRangeState];
    response[1] += 200;
    return response;
  }
  // if (type === INCREMENT_X1_AND_X2) {
  //   let response = [...xRangeState];
  //   response[0] += payload[0];
  //   response[1] += payload[1];
  //   return response;
  // }
  //Decrement
  if (type === DECREMENT_X1_ONLY) {
    let response = [...xRangeState];
    response[0] -= Math.abs(response[0] - response[1]) * 0.5;
    console.log(
      "response[0]",
      response[0],
      Math.abs(response[0] - response[1])
    );
    // if (Math.abs(response[0] - response[1]) < 600) return xRangeState;
    return response;
  }
  if (type === DECREMENT_X2_ONLY) {
    let response = [...xRangeState];
    response[1] -= 200;
    return response;
  }
  // if (type === DECREMENT_X1_AND_X2) {
  //   let response = [...xRangeState];
  //   response[0] -= payload[0];
  //   response[1] -= payload[1];
  //   return response;
  // }
  return xRangeState;
};
export default xRange;
