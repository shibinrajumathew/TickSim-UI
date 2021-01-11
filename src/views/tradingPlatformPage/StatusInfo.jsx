import React from "react";
import {
  Container,
  Col,
  Row,
  Input,
  Button,
  Table,
} from "../common/cssFrameworkComponents/CoreComponents";

const StatusInfo = (props) => {
  const { currentPrice, currentPL, fundBalance } = props;
  return (
    <React.Fragment>
      <Row className="mt-5">
        <h5>{`Current Price:${currentPrice.toFixed(2) || 0} `}</h5>
      </Row>
      <Row className="mt-2">
        <h5>{"P&L: "}</h5>
        <h5 className={currentPL > 0 ? "text-success" : "text-danger"}>
          {" "}
          &nbsp;{currentPL}
        </h5>
      </Row>
      <Row className="">
        <h5>{"A/c Balance: "}</h5>
        <h5 className={fundBalance > 0 ? "text-success" : "text-danger"}>
          {" "}
          &nbsp;{fundBalance}
        </h5>
      </Row>
    </React.Fragment>
  );
};

export default StatusInfo;
