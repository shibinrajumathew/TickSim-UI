import React from "react";
import { Button } from "../cssFrameworkComponents/CoreComponents";

const TradeNextDayComponent = (props) => {
  const { updatedChartOnButtonClick, didCandleEnd } = props;
  return (
    <React.Fragment>
      <Button
        color="primary"
        className="rounded-0 col-12  border-0 mb-2"
        onClick={updatedChartOnButtonClick}
        disabled={!didCandleEnd}
      >
        Trade Next Day
      </Button>
    </React.Fragment>
  );
};

export default TradeNextDayComponent;
