/*
 * Created on: Wed Oct 07 2020 10:01:51 PM
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
const config = {
  devTool:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
  tempData: {
    token: "8d8bcda9-295a-41eb-962e-bf632e33125a",
  },
  ms: {
    httpProtocol: process.env.HTTP_PROTOCOL || "http://",
    baseUrl: process.env.MS_BASE_URL || "localhost:3001",
  },
};
export default config;
