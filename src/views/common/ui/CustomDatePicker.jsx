import React, { Component } from "react";
import DatePicker from "react-date-picker";

class CustomDatePicker extends Component {
  render() {
    return <DatePicker {...this.props} />;
  }
}

export default CustomDatePicker;
