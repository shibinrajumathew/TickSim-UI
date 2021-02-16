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
    MAPPED_ORDER_TYPE: {
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
    STOP_LOSS_MUST_BE_LESS_THAN_LTP: "ERROR_012",
    STOP_LOSS_MUST_BE_GREATER_THAN_LTP: "ERROR_013",
  },
  ERROR_MESSAGES: {
    ERROR_001: "Invalid Username format",
    ERROR_002: "Invalid Password format",
    ERROR_011:
      "Order must be a number greater than or equal to Last traded price and can't be empty for limit order.",
    ERROR_012: "Stop Loss must be less than last traded price for buy order.",
    ERROR_013:
      "Stop Loss must be greater than last traded price for sell order.",
  },
  TIME_SCALE: {
    minute: "1 minute",
    "2minute": "2 minute",
    "3minute": "3 minute",
    "4minute": "4 minute",
    "5minute": "5 minute",
    "10minute": "10 minute",
    "15minute": "15 minute",
    "30minute": "30 minute",
    "60minute": "1 hour",
    "2hour": "2 hour",
    "3hour": "3 hour",
    day: "day",
  },
  CANDLE_COUNT: {
    minute: {
      dayCandleCount: 375,
      minCandleCount: 30,
    },
    "2minute": {
      dayCandleCount: 188,
      minCandleCount: 15,
    },
    "3minute": {
      dayCandleCount: 125,
      minCandleCount: 10,
    },
    "4minute": {
      dayCandleCount: 94,
      minCandleCount: 7,
    },
    "5minute": {
      dayCandleCount: 75,
      minCandleCount: 6,
    },
    "10minute": {
      dayCandleCount: 38,
      minCandleCount: 3,
    },
    "15minute": {
      dayCandleCount: 25,
      minCandleCount: 2,
    },
    "30minute": {
      dayCandleCount: 13,
      minCandleCount: 0,
    },
    "60minute": {
      dayCandleCount: 7,
      minCandleCount: 0,
    },
    "2hour": {
      dayCandleCount: 4,
      minCandleCount: 0,
    },
    "3hour": {
      dayCandleCount: 3,
      minCandleCount: 0,
    },
    day: {
      dayCandleCount: 1,
      minCandleCount: 0,
    },
  },
  TICK_SIM_CONSTANTS: {
    BUY: "Buy",
    SELL: "Sell",
    STOP_LOSS: "StopLoss",
    TARGET: "Target",
  },
  ORDER_STATUS: {
    ORDER_PLACED: "ORDER_PLACED",
    ORDER_COMPLETED: "ORDER_COMPLETED",
    ORDER_EXECUTED: "ORDER_EXECUTED",
  },
  ORDER_ATTRIBUTES: {
    LAST_UPDATED_PRICE: "lastUpdatedPrice",
    LIMIT_PRICE: "limitPrice",
    ORDER_PLACED_DATE_TIME: "orderPlacedDateTime",
    ORDER_TYPE: "orderType",
    PROFIT_OR_LOSS_VALUE: "profitOrLossValue",
    QUANTITY: "quantity",
    STATUS: "status",
    STOP_LOSS_POINT: "stopLossPoint",
    STOP_LOSS_PRICE: "stopLossPrice",
    TARGET_POINT: "targetPoint",
    TARGET_PRICE: "targetPrice",
  },
};

export default constants;
