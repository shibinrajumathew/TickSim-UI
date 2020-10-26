/*
 * Created on: Thu Oct 15 2020 11:44:47 AM
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
    INCREMENT_X1_AND_X2,
    DECREMENT_X1_AND_X2,
  },
} = actionType;
//ACTION
const getAction = (type, data) => {
  return {
    type,
    payload: data,
  };
};
const incrementX1Only = (data) => getAction(INCREMENT_X1_ONLY, data);
const incrementX2Only = (data) => getAction(INCREMENT_X2_ONLY, data);
const incrementX1AndX2 = (data) => getAction(INCREMENT_X1_AND_X2, data);
const decrementX1Only = (data) => getAction(DECREMENT_X1_ONLY, data);
const decrementX2Only = (data) => getAction(DECREMENT_X2_ONLY, data);
const decrementX1AndX2 = (data) => getAction(DECREMENT_X1_AND_X2, data);
export {
  incrementX1Only,
  incrementX2Only,
  decrementX1Only,
  decrementX2Only,
  incrementX1AndX2,
  decrementX1AndX2,
};
