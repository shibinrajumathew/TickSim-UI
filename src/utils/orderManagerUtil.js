import constants from "./constants";

const {
  ORDER_TYPE: {
    BUY_AT_LIMIT_PRICE,
    SELL_AT_LIMIT_PRICE,
    BUY_AT_MARKET_PRICE,
    SELL_AT_MARKET_PRICE,
  },
  TICK_SIM_CONSTANTS: { BUY, SELL },
  CONSTANT_STRING_MAPPING: { MAPPED_ORDER_TYPE },
  ORDER_STATUS: { ORDER_PLACED, ORDER_COMPLETED, ORDER_EXECUTED },
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
  let targetPrice = 0;
  let stopLossPrice = 0;
  let orderId = Date.now().toString();
  let status = ORDER_PLACED;
  let updatedLimitPrice = currentPrice;
  switch (orderType) {
    case BUY_AT_MARKET_PRICE:
      status = ORDER_EXECUTED;
      targetPrice = updatedLimitPrice + targetPoint;
      stopLossPrice = updatedLimitPrice - stopLossPoint;
      break;
    case SELL_AT_MARKET_PRICE:
      status = ORDER_EXECUTED;
      targetPrice = updatedLimitPrice - targetPoint;
      stopLossPrice = updatedLimitPrice + stopLossPoint;
      break;
    case BUY_AT_LIMIT_PRICE:
      updatedLimitPrice = limitPrice;
      targetPrice = limitPrice + targetPoint;
      stopLossPrice = limitPrice - stopLossPoint;
      break;
    case SELL_AT_LIMIT_PRICE:
      updatedLimitPrice = limitPrice;
      targetPrice = limitPrice - targetPoint;
      stopLossPrice = limitPrice + stopLossPoint;
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
  let updatedTriggerObj = JSON.parse(JSON.stringify(orderTrigger));
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
const deleteOldPriceFromTrigger = (orderTrigger, oldPrice, orderId) => {
  if (orderTrigger[oldPrice].length > 1) {
    let orderTriggerOrderArray = [...orderTrigger[oldPrice]];
    orderTriggerOrderArray = orderTriggerOrderArray.filter(
      (eachOrderId) => eachOrderId !== orderId
    );
    orderTrigger[oldPrice] = orderTriggerOrderArray;
  } else {
    delete orderTrigger[oldPrice];
  }
  return orderTrigger;
};
const orderSearchAndTrigger = (
  orderObj,
  orderTrigger,
  instrumentId,
  prevPrice,
  currentPrice,
  modifiedOrderObj
) => {
  const priceKey = Object.keys(orderTrigger).map(Number);
  let updatedOrderTrigger = { ...orderTrigger };
  let updatedOrderObj = { ...orderObj };
  let tempModifiedOrderObj = JSON.parse(JSON.stringify(modifiedOrderObj));
  priceKey.forEach((triggerPrice) => {
    let onBullishCandleHit =
      prevPrice <= triggerPrice && triggerPrice <= currentPrice;
    let onBearishCandleHit =
      prevPrice >= triggerPrice && triggerPrice >= currentPrice;

    if (onBullishCandleHit || onBearishCandleHit) {
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

        switch (status) {
          case ORDER_PLACED:
            if (limitPrice === triggerPrice) {
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
            }
            break;
          //final order execution
          case ORDER_EXECUTED:
            if (
              stopLossPrice === triggerPrice ||
              targetPrice === triggerPrice
            ) {
              updatedOrderObj = processExecutedOrder(
                triggerPrice,
                updatedOrderObj,
                instrumentId,
                orderId,
                orderType,
                limitPrice,
                quantity
              );
            }
            break;
          default:
            break;
        }
      });
      tempModifiedOrderObj = JSON.parse(JSON.stringify(updatedOrderObj));
    }
  });
  return {
    orderTrigger: updatedOrderTrigger,
    orderObj: updatedOrderObj,
    modifiedOrderObj: tempModifiedOrderObj,
  };
};
const processExecutedOrder = (
  triggerPrice,
  updatedOrderObj,
  instrumentId,
  orderId,
  orderType,
  limitPrice,
  quantity
) => {
  updatedOrderObj[instrumentId][orderId].status = ORDER_COMPLETED;
  updatedOrderObj[instrumentId][orderId].finalTriggerPrice = triggerPrice;
  let mappedOrderType = MAPPED_ORDER_TYPE[orderType];

  if (mappedOrderType === BUY) {
    updatedOrderObj[instrumentId][orderId].profitOrLossValue =
      (triggerPrice - limitPrice) * quantity;
  }

  if (mappedOrderType === SELL) {
    updatedOrderObj[instrumentId][orderId].profitOrLossValue =
      (limitPrice - triggerPrice) * quantity;
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
  updatedOrderObj[instrumentId][orderId].status = ORDER_EXECUTED;
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
  return {
    updatedOrderObj,
    updatedOrderTrigger,
  };
};
const orderPriceValidator = (currentPrice, limitPrice, mappedOrderType) => {
  let isValidPrice = false;
  //validate input value
  const numberOnlyRegex = /^\d*\.?\d*$/;
  isValidPrice = numberOnlyRegex.test(currentPrice);

  switch (mappedOrderType) {
    case BUY:
      isValidPrice = limitPrice >= currentPrice;
      break;
    case SELL:
      isValidPrice = limitPrice <= currentPrice;
      break;
    default:
      break;
  }
  return isValidPrice;
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

const orderSearchAndModifyQueue = (
  orderTrigger,
  orderId,
  newPriceArray,
  oldPriceArray
) => {
  let tempOrderTriggerObj = { ...orderTrigger };
  oldPriceArray.forEach((oldPrice) => {
    tempOrderTriggerObj = deleteOldPriceFromTrigger(
      tempOrderTriggerObj,
      oldPrice,
      orderId
    );

    let updatedOrderTriggerObj = orderTriggerQueueInsertion(
      tempOrderTriggerObj,
      newPriceArray,
      orderId
    );
    tempOrderTriggerObj = { ...updatedOrderTriggerObj };
  });
  return tempOrderTriggerObj;
};

export {
  orderManager,
  orderSearchAndTrigger,
  orderPriceValidator,
  orderSearchAndModifyQueue,
};
