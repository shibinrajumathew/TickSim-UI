/*
 * Created on: Wed Oct 07 2020 10:01:36 PM
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
const constants = {
  stateManager: {
    actionType: {
      INCREMENT: "increment",
      DECREMENT: "decrement",
      xRange: {
        INCREMENT_X1_ONLY: "increment x1 only",
        INCREMENT_X2_ONLY: "increment x2 only",
        INCREMENT_X1_AND_X2: "increment x1 and x2",
        DECREMENT_X1_ONLY: "decrement x1 only",
        DECREMENT_X2_ONLY: "decrement x2 only",
        DECREMENT_X1_AND_X2: "decrement x1 and x2",
      },
    },
  },
  EVENTS: {
    BLUR: "blur",
    FOCUS: "focus",
    KEYUP: "keyup",
    WHEEL: "wheel",
    MOUSE_DOWN: "mousedown",
    MOUSE_MOVE: "mousemove",
    MOUSE_UP: "mouseup",
    CONTEXT_MENU: "contextmenu",
    SUBMIT: "submit",
    NON_PASSIVE_EVENTS: {
      passive: false,
    },
  },
  USER: {
    ID: "user_id",
    NAME: "user_name",
    AUTH_TOKEN: "access_token",
    AUTH_TYPE: "user_type",
  },
  ORDER_TYPE: {
    BUY_AT_LIMIT_PRICE: "BUY_AT_LIMIT_PRICE",
    SELL_AT_LIMIT_PRICE: "SELL_AT_LIMIT_PRICE",
    BUY_AT_MARKET_PRICE: "BUY_AT_MARKET_PRICE",
    SELL_AT_MARKET_PRICE: "SELL_AT_MARKET_PRICE",
  },
  CONSTANT_STRING_MAPPING: {
    ORDER_TYPE: {
      BUY_AT_LIMIT_PRICE: "Buy",
      SELL_AT_LIMIT_PRICE: "Sell",
      BUY_AT_MARKET_PRICE: "Buy",
      SELL_AT_MARKET_PRICE: "Sell",
    },
  },
  ERRORS: {
    INVALID_USERNAME: "ERROR_001",
    INVALID_PASSWORD: "ERROR_002",
    INVALID_ORDER_INPUT: "ERROR_011",
  },
  ERROR_MESSAGES: {
    ERROR_001: "Invalid Username format",
    ERROR_002: "Invalid Password format",
    ERROR_011:
      "Order must be a number greater than zero and can't be empty for limit order.",
  },
};

export default constants;
