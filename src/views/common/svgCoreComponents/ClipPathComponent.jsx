import React from "react";
/*
 * Created on: Wed Oct 07 2020 9:57:00 PM
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
import Rectangle from "./Rectangle";

const ClipPathComponent = (props) => {
  const { id, width, height, x } = props;
  return (
    <defs>
      <clipPath id={id}>
        <Rectangle {...{ width, height, x }} />
      </clipPath>
    </defs>
  );
};

export default ClipPathComponent;
