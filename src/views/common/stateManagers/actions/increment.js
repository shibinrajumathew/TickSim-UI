/*
 * Created on: Wed Oct 07 2020 10:02:11 PM
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

const { INCREMENT } = actionType;
//ACTION
const increment = (data) => {
  return {
    type: INCREMENT,
    payload: data,
  };
};
export default increment;
