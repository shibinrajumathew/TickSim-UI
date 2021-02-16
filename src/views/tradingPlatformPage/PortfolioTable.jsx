import React from "react";
import constants from "../../utils/constants";
import {
  Button,
  Input,
  Table,
} from "../common/cssFrameworkComponents/CoreComponents";
const {
  CONSTANT_STRING_MAPPING: { MAPPED_ORDER_TYPE },
  ORDER_STATUS: { ORDER_COMPLETED, ORDER_PLACED, ORDER_EXECUTED },
  ORDER_ATTRIBUTES: { STOP_LOSS_PRICE, TARGET_PRICE, LIMIT_PRICE },
  TICK_SIM_CONSTANTS: { BUY, SELL },
} = constants;
const getFormattedDigit = (numberToFormat) => {
  return numberToFormat.toFixed(2).replace(/[.,]00$/, "");
};
const portfolioTable = (props) => {
  const {
    currentPrice,
    updatePL,
    doesOrderEditFormDisabled,
    toggleOrderEditForm,
    modifyOrder,
    alertFlagObj,
    keyElement,
    modifiedOrderObj,
    orderObj,
  } = props;

  const instruments = Object.keys(modifiedOrderObj);
  let totalProfitOrLoss = 0;
  return (
    <React.Fragment>
      {instruments.length > 0 && (
        <Table dark striped>
          <thead>
            <tr className="d-flex">
              <th className="col-1">Order Type</th>
              <th className="col-1">Quantity</th>
              <th className="col-1">Limit Price</th>
              <th className="col-2">Stop Loss Price</th>
              <th className="col-2">Target Price</th>
              <th className="col-1">Risk : Reward</th>
              <th className="col-1">Last Traded Price</th>
              <th className="col-1">{"P&L"}</th>
              <th className="col-2">Actions</th>
            </tr>
          </thead>

          <tbody className="text-light">
            {instruments.map((instrumentId, index) => {
              const orderIds = Object.keys(modifiedOrderObj[instrumentId]);
              return orderIds.map((orderId, orderIndex) => {
                const {
                  limitPrice,
                  targetPrice,
                  stopLossPrice,
                  targetPoint,
                  stopLossPoint,
                } = modifiedOrderObj[instrumentId][orderId];
                const {
                  orderType,
                  quantity,
                  status,
                  profitOrLossValue,
                  finalTriggerPrice,
                } = orderObj[instrumentId][orderId];
                let processedPOrL = profitOrLossValue;
                let isPlacedOrder = status === ORDER_PLACED;
                let isExecutedOrder = status === ORDER_EXECUTED;
                let didOrderCompleted = status === ORDER_COMPLETED;

                let mappedOrderType = MAPPED_ORDER_TYPE[orderType];

                let lastTickValue = didOrderCompleted
                  ? parseFloat(finalTriggerPrice)
                  : currentPrice;
                if (
                  !isPlacedOrder &&
                  (isExecutedOrder || profitOrLossValue === 0)
                ) {
                  if (mappedOrderType === BUY) {
                    if (currentPrice >= targetPrice)
                      lastTickValue = targetPrice;
                    if (currentPrice <= stopLossPrice)
                      lastTickValue = stopLossPrice;
                  }

                  processedPOrL = (lastTickValue - limitPrice) * quantity;
                  if (mappedOrderType === SELL) {
                    if (currentPrice <= targetPrice) {
                      lastTickValue = targetPrice;
                    }
                    if (currentPrice >= stopLossPrice) {
                      lastTickValue = stopLossPrice;
                    }
                    processedPOrL = (limitPrice - lastTickValue) * quantity;
                  }
                }

                if (!isExecutedOrder) {
                  totalProfitOrLoss =
                    parseFloat(totalProfitOrLoss) + parseFloat(processedPOrL);
                }

                if (index === orderIds.length - 1)
                  updatePL(totalProfitOrLoss.toFixed(2));
                let disabledFlag = true;
                if (
                  doesOrderEditFormDisabled &&
                  doesOrderEditFormDisabled[orderIndex] !== undefined
                ) {
                  disabledFlag = doesOrderEditFormDisabled[orderIndex];
                }
                return (
                  <tr className="d-flex" key={`${keyElement}${orderId}`}>
                    <td className="col-1">{`${mappedOrderType}`}</td>
                    <td className="col-1"> {quantity}</td>
                    <td className="col-1">
                      <Input
                        type="number"
                        className="rounded-0 bg-dark  border-0 text-light"
                        name={LIMIT_PRICE}
                        value={limitPrice.toFixed(2)}
                        step="0.05"
                        autoComplete="off"
                        pattern="^[^0*][0-9]{0,}"
                        required
                        onChange={(e) =>
                          modifyOrder(
                            e,
                            instrumentId,
                            orderId,
                            orderType,
                            limitPrice,
                            orderIndex
                          )
                        }
                        disabled={
                          disabledFlag || isExecutedOrder || didOrderCompleted
                        }
                      />
                    </td>
                    <td className="col-2">
                      {" "}
                      <Input
                        type="number"
                        className="rounded-0 bg-dark  border-0 text-light"
                        name={STOP_LOSS_PRICE}
                        value={stopLossPrice.toFixed(2)}
                        step="0.05"
                        autoComplete="off"
                        pattern="^[^0*][0-9]{0,}"
                        required
                        onChange={(e) =>
                          modifyOrder(
                            e,
                            instrumentId,
                            orderId,
                            orderType,
                            limitPrice,
                            orderIndex
                          )
                        }
                        disabled={
                          disabledFlag || isPlacedOrder || didOrderCompleted
                        }
                      />
                      {alertFlagObj &&
                        alertFlagObj[orderIndex] &&
                        alertFlagObj[orderIndex].isAlertEnabled &&
                        alertFlagObj[orderIndex].modifiedPriceType ===
                          STOP_LOSS_PRICE && (
                          <p>{`${alertFlagObj[orderIndex].alertInfo}`}</p>
                        )}
                    </td>
                    <td className="col-2">
                      {" "}
                      <Input
                        type="number"
                        className="rounded-0 bg-dark  border-0 text-light"
                        name={TARGET_PRICE}
                        value={targetPrice.toFixed(2)}
                        step="0.05"
                        autoComplete="off"
                        pattern="^[^0*][0-9]{0,}"
                        required
                        onChange={(e) =>
                          modifyOrder(
                            e,
                            instrumentId,
                            orderId,
                            orderType,
                            limitPrice,
                            orderIndex
                          )
                        }
                        disabled={
                          disabledFlag || isPlacedOrder || didOrderCompleted
                        }
                      />
                      {alertFlagObj &&
                        alertFlagObj[orderIndex] &&
                        alertFlagObj[orderIndex].isAlertEnabled &&
                        alertFlagObj[orderIndex].modifiedPriceType ===
                          TARGET_PRICE && (
                          <p>{`${alertFlagObj[orderIndex].alertInfo}`}</p>
                        )}
                    </td>
                    <td>
                      {`${getFormattedDigit(
                        parseFloat(stopLossPoint)
                      )}: ${getFormattedDigit(parseFloat(targetPoint))}
                     `}
                      {stopLossPoint > 0
                        ? `(1:${getFormattedDigit(
                            targetPoint / stopLossPoint
                          )})`
                        : ""}
                    </td>
                    <td className="col-1">{lastTickValue.toFixed(2)}</td>
                    <td className="col-1">{processedPOrL.toFixed(2)}</td>
                    <td className="col-2">
                      {" "}
                      {didOrderCompleted ? (
                        "Order Completed"
                      ) : disabledFlag ? (
                        <Button
                          className="rounded-0 col-6 mb-2  border-0 btn btn-success"
                          onClick={() =>
                            toggleOrderEditForm(
                              "editButton",
                              orderIndex,
                              instrumentId,
                              orderId
                            )
                          }
                        >
                          Edit
                        </Button>
                      ) : (
                        <React.Fragment>
                          <Button
                            className="rounded-0 col-6 mb-2  border-0 btn btn-success"
                            onClick={() =>
                              toggleOrderEditForm(
                                "saveButton",
                                orderIndex,
                                instrumentId,
                                orderId
                              )
                            }
                          >
                            Save
                          </Button>
                          <Button
                            className="rounded-0 col-6 mb-2  border-0 btn btn-danger"
                            onClick={() =>
                              toggleOrderEditForm(
                                "cancelButton",
                                orderIndex,
                                instrumentId,
                                orderId
                              )
                            }
                          >
                            Cancel
                          </Button>
                        </React.Fragment>
                      )}
                    </td>
                  </tr>
                );
                return null;
              });
            })}
          </tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

export default portfolioTable;
