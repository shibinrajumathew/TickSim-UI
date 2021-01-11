import React from "react";
import constants from "../../utils/constants";
import {
  Container,
  Col,
  Row,
  Input,
  Button,
  Table,
  Form,
} from "../common/cssFrameworkComponents/CoreComponents";
const {
  ORDER_TYPE: {
    BUY_AT_LIMIT_PRICE,
    SELL_AT_LIMIT_PRICE,
    BUY_AT_MARKET_PRICE,
    SELL_AT_MARKET_PRICE,
  },
} = constants;

const OrderPlacingForm = React.forwardRef((props, ref) => {
  let { currentPrice } = props;
  return (
    <Row>
      <form id="orderForm" ref={ref}>
        <Input
          type="number"
          className="rounded-0 mt-3 mb-2 bg-dark border-0 text-light"
          placeholder="Quantity"
          name="quantity"
          step="75"
          min="75"
          required
        />
        <Input
          type="number"
          className="rounded-0 mb-2  bg-dark  border-0 text-light"
          placeholder="Limit Price"
          name="limitPrice"
          min={"1"} // TO DO need to change this logic
          step="0.5"
        />
        <Input
          type="text"
          className="rounded-0 mb-2  bg-dark  border-0 text-light"
          placeholder="Target"
          name="target"
          step="0.5"
          min="0"
          pattern="^[^0*][0-9]{0,}"
          title="Must be larger than zero"
          required
        />
        <Input
          type="number"
          className="rounded-0 mb-2  bg-dark  border-0 text-light"
          placeholder="StopLoss"
          name="stopLoss"
          step="0.5"
          min="0"
          required
        />
        <Input
          type="number"
          className="rounded-0 mb-2  bg-dark  border-0 text-light"
          placeholder="Risk : Reward"
          name="riskReward"
          readOnly
          disabled
        />

        <Button
          color="success"
          className="rounded-0 col-6  mb-2  border-0"
          data-order-type={BUY_AT_LIMIT_PRICE}
        >
          Buy
        </Button>
        <Button
          color="danger"
          className="rounded-0 col-6 mb-2  border-0"
          data-order-type={SELL_AT_LIMIT_PRICE}
        >
          Sell
        </Button>
        <Button
          color="success"
          className="rounded-0 col-6  border-0"
          data-order-type={BUY_AT_MARKET_PRICE}
        >
          Buy @ Market Price
        </Button>
        <Button
          color="danger"
          className="rounded-0 col-6  border-0"
          data-order-type={SELL_AT_MARKET_PRICE}
        >
          Sell @ Market Price
        </Button>
      </form>
    </Row>
  );
});

export default OrderPlacingForm;
