import React from "react";
// import { Row } from "../common/cssFrameworkComponents/CoreComponents";

const StatusInfo = (props) => {
  const { currentPrice, prevClose } = props;
  return (
    <React.Fragment>
      <p className="text-white text-center m-2">{`Current Price : ${
        currentPrice.toFixed(2) || 0
      } (${(currentPrice - prevClose).toFixed(2) || 0})`}</p>
      {/* <Row className="mt-2">
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
      </Row> */}
    </React.Fragment>
  );
};

export default StatusInfo;
