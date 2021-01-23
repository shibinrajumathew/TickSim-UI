import constants from "./constants";

const {
  ORDER_TYPE: {
    BUY_AT_LIMIT_PRICE,
    SELL_AT_LIMIT_PRICE,
    BUY_AT_MARKET_PRICE,
    SELL_AT_MARKET_PRICE,
  },
} = constants;
const initialOrderObj = (
  orderObj,
  orderTrigger,
  instrumentId,
  orderType,
  quantity,
  currentPrice,
  targetPoint,
  stopLossPoint,
  limitPrice
) => {
  console.log(
    "inside initOrderObj:::",
    orderObj,
    orderTrigger,
    instrumentId,
    orderType,
    quantity,
    currentPrice,
    targetPoint,
    stopLossPoint,
    limitPrice
  );
  let targetPrice = 0;
  let stopLossPrice = 0;
  let orderId = Date.now().toString();
  let status = "ORDER_PLACED";
  let updatedLimitPrice = currentPrice;
  switch (orderType) {
    case BUY_AT_MARKET_PRICE:
      status = "ORDER_EXECUTED";
      targetPrice = updatedLimitPrice + targetPoint;
      stopLossPrice = updatedLimitPrice - stopLossPoint;
      break;
    case SELL_AT_MARKET_PRICE:
      status = "ORDER_EXECUTED";
      targetPrice = updatedLimitPrice - targetPoint;
      stopLossPrice = updatedLimitPrice + stopLossPoint;
      break;

    case BUY_AT_LIMIT_PRICE:
    case SELL_AT_LIMIT_PRICE:
      updatedLimitPrice = limitPrice;
      break;
    default:
      break;
  }

  const newOrderObj = {
    quantity,
    orderType,
    limitPrice: updatedLimitPrice,
    targetPoint,
    stopLossPoint,
    targetPrice,
    stopLossPrice,
    profitOrLossValue: 0,
    orderPlacedDateTime: "",
    lastUpdatedPrice: "",
    status,
  };
  let updatedOrderObj = { ...orderObj };
  if (orderObj[instrumentId]) {
    //To Do instead of adding new order,
    //add qty to already placed order and set limit price to avg
    //if opposite trade then (2 conditions) do sufficient step
    let tempOrderObj = { [orderId]: newOrderObj };
    updatedOrderObj[instrumentId] = {
      ...tempOrderObj,
      ...orderObj[instrumentId],
    };
  } else {
    updatedOrderObj = {
      [instrumentId]: {
        [orderId]: newOrderObj,
      },
    };
  }

  return {
    updatedOrderObj,
    orderId,
    targetPrice,
    stopLossPrice,
  };
};
const orderTriggerQueueInsertion = (
  orderTrigger,
  triggerPricesArray,
  orderId
) => {
  let updatedTriggerObj = { ...orderTrigger };
  triggerPricesArray.map((price) => {
    if (updatedTriggerObj[price]) {
      updatedTriggerObj[price] = [...orderTrigger[price], orderId];
    } else {
      updatedTriggerObj = {
        ...{ [price]: [orderId] },
        ...updatedTriggerObj,
      };
    }
    return orderTrigger;
  });
  return updatedTriggerObj;
};
const orderSearch = (
  orderObj,
  orderTrigger,
  instrumentId,
  prevPrice,
  currentPrice
) => {
  const priceKey = Object.keys(orderTrigger).map(Number);
  let updatedOrderTrigger = { ...orderTrigger };
  let updatedOrderObj = { ...orderObj };
  priceKey.forEach((triggerPrice) => {
    let isTriggerTypeBuy =
      prevPrice <= triggerPrice && triggerPrice <= currentPrice;
    let isTriggerTypeSell =
      prevPrice >= triggerPrice && triggerPrice >= currentPrice;
    if (isTriggerTypeBuy || isTriggerTypeSell) {
      orderTrigger[triggerPrice].forEach((orderId) => {
        let {
          status,
          stopLossPrice,
          targetPrice,
          limitPrice,
          orderType,
          quantity,
          targetPoint,
          stopLossPoint,
        } = updatedOrderObj[instrumentId][orderId];

        let isBuyOrder =
          orderType === BUY_AT_LIMIT_PRICE || orderType === BUY_AT_MARKET_PRICE;
        let isSellOrder =
          orderType === SELL_AT_LIMIT_PRICE ||
          orderType === SELL_AT_MARKET_PRICE;
        let isTriggerTypeMatchingWithOrderType =
          (isTriggerTypeBuy && isBuyOrder) ||
          (isTriggerTypeSell && isSellOrder);

        if (isTriggerTypeMatchingWithOrderType) {
          // console.log(
          //   "orderType",
          //   orderType,
          //   "isBuyOrder",
          //   isBuyOrder,
          //   "isSellOrder",
          //   isSellOrder,
          //   "isTriggerTypeBuy",
          //   isTriggerTypeBuy,
          //   "isTriggerTypeSell",
          //   isTriggerTypeSell,
          //   "isTriggerTypeMatchingWithOrderType",
          //   isTriggerTypeMatchingWithOrderType
          // );
          switch (status) {
            case "ORDER_PLACED":
              ({ updatedOrderTrigger, updatedOrderObj } = buySellAtLimitPrice(
                updatedOrderObj,
                orderId,
                instrumentId,
                targetPrice,
                triggerPrice,
                stopLossPrice,
                orderType,
                stopLossPoint,
                targetPoint,
                orderTrigger
              ));
              break;
            //final order execution
            case "ORDER_EXECUTED":
              updatedOrderObj = processExecutedOrder(
                stopLossPrice,
                triggerPrice,
                targetPrice,
                updatedOrderObj,
                instrumentId,
                orderId,
                orderType,
                limitPrice,
                quantity
              );
              break;
            default:
              break;
          }
        }
      });
    }
  });
  console.log(
    "updatedOrderTrigger, updatedOrderObj",
    updatedOrderTrigger,
    updatedOrderObj
  );
  return { updatedOrderTrigger, updatedOrderObj };
};
const processExecutedOrder = (
  stopLossPrice,
  triggerPrice,
  targetPrice,
  updatedOrderObj,
  instrumentId,
  orderId,
  orderType,
  limitPrice,
  quantity
) => {
  console.log("inside processExecutedOrder");
  if (stopLossPrice === triggerPrice || targetPrice === triggerPrice) {
    updatedOrderObj[instrumentId][orderId].status = "ORDER_COMPLETED";
    updatedOrderObj[instrumentId][orderId].finalTriggerPrice = triggerPrice;

    if (orderType === BUY_AT_LIMIT_PRICE || orderType === BUY_AT_MARKET_PRICE) {
      updatedOrderObj[instrumentId][orderId].profitOrLossValue =
        (triggerPrice - limitPrice) * quantity;
    }

    if (
      orderType === SELL_AT_LIMIT_PRICE ||
      orderType === SELL_AT_MARKET_PRICE
    ) {
      updatedOrderObj[instrumentId][orderId].profitOrLossValue =
        (limitPrice - triggerPrice) * quantity;
    }
  }
  return updatedOrderObj;
};
const buySellAtLimitPrice = (
  updatedOrderObj,
  orderId,
  instrumentId,
  targetPrice,
  triggerPrice,
  stopLossPrice,
  orderType,
  stopLossPoint,
  targetPoint,
  orderTrigger
) => {
  //limit order
  updatedOrderObj[instrumentId][orderId].status = "ORDER_EXECUTED";
  updatedOrderObj[instrumentId][orderId].limitPrice = triggerPrice;
  targetPrice = triggerPrice + targetPoint;
  stopLossPrice = triggerPrice - stopLossPoint;

  if (orderType === SELL_AT_LIMIT_PRICE) {
    targetPrice = triggerPrice - targetPoint;
    stopLossPrice = triggerPrice + stopLossPoint;
  }

  updatedOrderObj[instrumentId][orderId].targetPrice = targetPrice;
  updatedOrderObj[instrumentId][orderId].stopLossPrice = stopLossPrice;

  const updatedOrderTrigger = orderTriggerQueueInsertion(
    orderTrigger,
    [stopLossPrice, targetPrice],
    orderId
  );
  // console.log(
  //   "inside switch  position queue response",
  //   "updatedOrderTrigger",
  //   updatedOrderTrigger
  // );
  return {
    updatedOrderObj,
    updatedOrderTrigger,
  };
};

const orderManager = (
  orderObj,
  orderTrigger,
  currentInstrument,
  orderType,
  quantity,
  currentPrice,
  target,
  stopLoss,
  limitPrice
) => {
  const returnedOrderQueueInitialObj = initialOrderObj(
    orderObj,
    orderTrigger,
    currentInstrument,
    orderType,
    quantity,
    currentPrice,
    target,
    stopLoss,
    limitPrice
  );
  const {
    targetPrice,
    stopLossPrice,
    orderId,
    updatedOrderObj,
  } = returnedOrderQueueInitialObj;

  let updatedTriggerObj = {};

  switch (orderType) {
    case BUY_AT_LIMIT_PRICE:
    case SELL_AT_LIMIT_PRICE:
      updatedTriggerObj = orderTriggerQueueInsertion(
        orderTrigger,
        [limitPrice],
        orderId
      );
      break;
    case BUY_AT_MARKET_PRICE:
    case SELL_AT_MARKET_PRICE:
      updatedTriggerObj = orderTriggerQueueInsertion(
        orderTrigger,
        [targetPrice, stopLossPrice],
        orderId
      );
      break;

    default:
      break;
  }

  return {
    updatedOrderObj,
    updatedTriggerObj,
  };
};

export { orderManager, orderSearch };
