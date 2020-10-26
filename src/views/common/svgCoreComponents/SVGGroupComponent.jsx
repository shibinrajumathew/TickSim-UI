/*
 * Created on: Wed Oct 07 2020 9:57:55 PM
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

const SVGGroupComponent = React.forwardRef((props, ref) => {
  return <g ref={ref} {...props} />;
});

export default SVGGroupComponent;
