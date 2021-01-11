import React from "react";
import constants from "../../utils/constants";
import { Table } from "../common/cssFrameworkComponents/CoreComponents";
const {
  ORDER_TYPE: {
    BUY_AT_MARKET_PRICE,
    BUY_AT_LIMIT_PRICE,
    SELL_AT_LIMIT_PRICE,
    SELL_AT_MARKET_PRICE,
  },
  CONSTANT_STRING_MAPPING: { ORDER_TYPE },
} = constants;
const portfolioTable = (props) => {
  const { orderQueueObj, currentPrice, updatePL } = props;
  const instruments = Object.keys(orderQueueObj);
  let totalProfitOrLoss = 0;
  return (
    <React.Fragment>
      <Table dark striped>
        <thead>
          <tr>
            <th scope="col">instrumentId</th>
            <th scope="col">Qty</th>
            <th scope="col">limit price</th>
            <th scope="col">Last traded Price</th>
            <th scope="col">{"P&L"}</th>
          </tr>
        </thead>

        <tbody className="text-light">
          {instruments.map((instrumentId, index) => {
            const orderIds = Object.keys(orderQueueObj[instrumentId]).map(
              Number
            );
            return orderIds.map((orderId) => {
              const {
                orderType,
                limitPrice,
                quantity,
                status,
                profitOrLossValue,
                targetPrice,
                stopLossPrice,
                finalTriggerPrice,
              } = orderQueueObj[instrumentId][orderId];
              let processedPOrL = profitOrLossValue;
              let lastTickValue =
                status === "ORDER_COMPLETED"
                  ? parseFloat(finalTriggerPrice)
                  : currentPrice;
              if (status === "ORDER_EXECUTED" || profitOrLossValue === 0) {
                if (
                  orderType === BUY_AT_LIMIT_PRICE ||
                  orderType === BUY_AT_MARKET_PRICE
                ) {
                  if (currentPrice >= targetPrice) lastTickValue = targetPrice;
                  if (currentPrice <= stopLossPrice)
                    lastTickValue = stopLossPrice;
                }

                processedPOrL = (lastTickValue - limitPrice) * quantity;
                if (
                  orderType === SELL_AT_LIMIT_PRICE ||
                  orderType === SELL_AT_MARKET_PRICE
                ) {
                  if (currentPrice <= targetPrice) {
                    lastTickValue = targetPrice;
                  }
                  if (currentPrice >= stopLossPrice) {
                    lastTickValue = stopLossPrice;
                  }
                  processedPOrL = (limitPrice - lastTickValue) * quantity;
                }
              }
              if (status !== "ORDER_PLACED") {
                if (status !== "ORDER_COMPLETED") {
                  totalProfitOrLoss =
                    parseFloat(totalProfitOrLoss) + parseFloat(processedPOrL);
                  console.log("totalpl", typeof totalProfitOrLoss);
                }

                if (index === orderIds.length - 1)
                  updatePL(totalProfitOrLoss.toFixed(2));
                return (
                  <tr>
                    <td>{`${instrumentId}- ${ORDER_TYPE[orderType]}`}</td>
                    <td>{quantity}</td>
                    <td>{limitPrice.toFixed(2)}</td>
                    <td>{lastTickValue.toFixed(2)}</td>
                    <td>{processedPOrL.toFixed(2)}</td>
                  </tr>
                );
              }
              return null;
            });
          })}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default portfolioTable;
