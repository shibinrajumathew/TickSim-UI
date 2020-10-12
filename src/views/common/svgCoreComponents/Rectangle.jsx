/*
 * Created on: Wed Oct 07 2020 9:57:37 PM
 * Author: Shibin Raju Mathew
 * Email: shibinrajumathew@yahoo.com
 * Website: vveeo.com
 *
 * This project is licensed proprietary, not free software, or open source.
 * Strictly prohibited Unauthorized copying or modifications.
 * This project owned and maintained by Shibin Raju Mathew.
 *
 * All rights reserved.
 * Copyright (c) 2020 VVEEO
 */
import React from "react";

const Rectangle = (props) => {
  const { width, height, x } = props;
  return (
    <React.Fragment>
      <rect width={width} height={height} x={x} />
    </React.Fragment>
  );
};

export default Rectangle;
