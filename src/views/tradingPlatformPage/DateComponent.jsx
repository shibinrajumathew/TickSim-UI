import React from "react";
import { Row } from "../common/cssFrameworkComponents/CoreComponents";
import CustomDatePicker from "../common/ui/CustomDatePicker";

const DateComponent = (props) => {
  const { tradingDate, onDateChange } = props;
  return (
    <div className="bg-light col-12">
      <Row>
        <p className="= col-3 px-2 my-2 ">Date:</p>
        <div className="col-9">
          <CustomDatePicker
            id="endDate"
            format={"y-MM-dd"}
            maxDate={new Date("30/06/2015")}
            minDate={new Date("09/01/2015")}
            value={tradingDate}
            onChange={onDateChange}
            calendarIcon={null}
            className="my-1"
            // disabled
          />
        </div>
      </Row>
    </div>
  );
};

export default DateComponent;
