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
  orderQueueObj,
  orderTrigger,
  instrumentId,
  orderType,
  quantity,
  currentPrice,
  targetPoint,
  stopLossPoint
) => {
  let targetPrice = 0;
  let stopLossPrice = 0;
  let orderId = Date.now().toString();
  let limitPrice = 0;
  let updatedOrderQueue = [];
  let status = "ORDER_PLACED";
  switch (orderType) {
    case BUY_AT_MARKET_PRICE:
      limitPrice = currentPrice;
      status = "ORDER_EXECUTED";
      targetPrice = limitPrice + targetPoint;
      stopLossPrice = limitPrice - stopLossPoint;
      break;
    case SELL_AT_MARKET_PRICE:
      limitPrice = currentPrice;
      status = "ORDER_EXECUTED";
      targetPrice = limitPrice - targetPoint;
      stopLossPrice = limitPrice + stopLossPoint;
      break;
    default:
      break;
  }

  const orderObj = {
    quantity,
    orderType,
    limitPrice,
    targetPoint,
    stopLossPoint,
    targetPrice,
    stopLossPrice,
    profitOrLossValue: 0,
    orderPlacedDateTime: "",
    lastUpdatedPrice: "",
    status,
  };

  if (orderQueueObj[instrumentId]) {
    //To Do instead of adding new order,
    //add qty to already placed order and set limit price to avg
    //if opposite trade then (2 conditions) do sufficient step
    updatedOrderQueue = { [orderId]: orderObj };
    orderQueueObj[instrumentId] = {
      ...updatedOrderQueue,
      ...orderQueueObj[instrumentId],
    };
  } else {
    orderQueueObj = {
      [instrumentId]: {
        [orderId]: orderObj,
      },
    };
  }

  return {
    orderQueueObj,
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
  let returnedTriggerObj = { ...orderTrigger };
  triggerPricesArray.map((price) => {
    if (returnedTriggerObj[price]) {
      returnedTriggerObj[price] = [...orderTrigger[price], orderId];
    } else {
      returnedTriggerObj = {
        ...{ [price]: [orderId] },
        ...returnedTriggerObj,
      };
    }
    return orderTrigger;
  });
  return returnedTriggerObj;
};
const positionQueueInsertion = (positionQueue, orderId) => {
  positionQueue = [orderId, ...positionQueue];
  return positionQueue;
};
const orderSearch = (
  orderQueueObj,
  orderTrigger,
  positionQueue,
  instrumentId,
  prevPrice,
  currentPrice
) => {
  const priceKey = Object.keys(orderTrigger).map(Number);
  let responsePositionQueue = [...positionQueue];
  let responseOrderTrigger = { ...orderTrigger };
  let responseOrderQueueObj = { ...orderQueueObj };
  priceKey.forEach((triggerPrice) => {
    let isTriggerTypeBuy =
      prevPrice <= triggerPrice && triggerPrice <= currentPrice;
    let isTriggerTypeSell =
      prevPrice >= triggerPrice && triggerPrice >= currentPrice;

    // console.log(
    //   "isTriggerTypeBuy, isTriggerTypeSell",
    //   isTriggerTypeBuy,
    //   isTriggerTypeSell,
    //   "prevPrice",
    //   prevPrice,
    //   "triggerPrice",
    //   triggerPrice,
    //   "currentPrice",
    //   currentPrice
    // );

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
        } = responseOrderQueueObj[instrumentId][orderId];

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
              ({
                responseOrderTrigger,
                responseOrderQueueObj,
              } = buySellAtLimitPrice(
                responseOrderQueueObj,
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
              responseOrderQueueObj = processExecutedOrder(
                stopLossPrice,
                triggerPrice,
                targetPrice,
                responseOrderQueueObj,
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
  return { responsePositionQueue, responseOrderTrigger, responseOrderQueueObj };
};
const processExecutedOrder = (
  stopLossPrice,
  triggerPrice,
  targetPrice,
  responseOrderQueueObj,
  instrumentId,
  orderId,
  orderType,
  limitPrice,
  quantity
) => {
  if (stopLossPrice === triggerPrice || targetPrice === triggerPrice) {
    responseOrderQueueObj[instrumentId][orderId].status = "ORDER_COMPLETED";
    responseOrderQueueObj[instrumentId][
      orderId
    ].finalTriggerPrice = triggerPrice;

    if (orderType === BUY_AT_LIMIT_PRICE || orderType === BUY_AT_MARKET_PRICE) {
      responseOrderQueueObj[instrumentId][orderId].profitOrLossValue =
        (triggerPrice - limitPrice) * quantity;
    }

    if (
      orderType === SELL_AT_LIMIT_PRICE ||
      orderType === SELL_AT_MARKET_PRICE
    ) {
      responseOrderQueueObj[instrumentId][orderId].profitOrLossValue =
        (limitPrice - triggerPrice) * quantity;
    }
  }
  return responseOrderQueueObj;
};
const buySellAtLimitPrice = (
  responseOrderQueueObj,
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
  responseOrderQueueObj[instrumentId][orderId].status = "ORDER_EXECUTED";
  responseOrderQueueObj[instrumentId][orderId].limitPrice = triggerPrice;
  targetPrice = triggerPrice + targetPoint;
  stopLossPrice = triggerPrice - stopLossPoint;

  if (orderType === SELL_AT_LIMIT_PRICE) {
    targetPrice = triggerPrice - targetPoint;
    stopLossPrice = triggerPrice + stopLossPoint;
  }

  responseOrderQueueObj[instrumentId][orderId].targetPrice = targetPrice;
  responseOrderQueueObj[instrumentId][orderId].stopLossPrice = stopLossPrice;

  const responseOrderTrigger = orderTriggerQueueInsertion(
    orderTrigger,
    [stopLossPrice, targetPrice],
    orderId
  );
  // console.log(
  //   "inside switch  position queue response",
  //   responsePositionQueue,
  //   "responseOrderTrigger",
  //   responseOrderTrigger
  // );
  return {
    responseOrderQueueObj,
    responseOrderTrigger,
  };
};

const buyOrSellAtMarketPrice = (
  orderQueueObj,
  orderTrigger,
  orderPosition,
  currentInstrument,
  orderType,
  quantity,
  currentValue,
  target,
  stopLoss,
  limitPrice
) => {
  const returnedOrderQueueInitialObj = initialOrderObj(
    orderQueueObj,
    orderTrigger,
    currentInstrument,
    orderType,
    quantity,
    currentValue,
    target,
    stopLoss
  );
  const {
    targetPrice,
    stopLossPrice,
    orderId,
    orderQueueObj: returnedOrderQueueObj,
  } = returnedOrderQueueInitialObj;

  let returnedTriggerObj = {};
  let returnedPositionQueue = [];

  switch (orderType) {
    case BUY_AT_LIMIT_PRICE:
    case SELL_AT_LIMIT_PRICE:
      returnedTriggerObj = orderTriggerQueueInsertion(
        orderTrigger,
        [limitPrice],
        orderId
      );
      break;
    case BUY_AT_MARKET_PRICE:
    case SELL_AT_MARKET_PRICE:
      returnedTriggerObj = orderTriggerQueueInsertion(
        orderTrigger,
        [targetPrice, stopLossPrice],
        orderId
      );
      returnedPositionQueue = positionQueueInsertion(
        orderPosition,
        returnedOrderQueueInitialObj.orderId
      );
      break;

    default:
      break;
  }

  return {
    returnedOrderQueueObj,
    returnedTriggerObj,
    returnedPositionQueue,
  };
};

export { buyOrSellAtMarketPrice, orderSearch };
