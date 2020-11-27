/*
 * Created on: Thu Nov 19 2020 11:54:12 AM
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
import {
  Form,
  Input,
  Label,
  Button,
} from "../common/cssFrameworkComponents/CoreComponents";

const LoginComponent = (props) => {
  const { handleLogin, handleInput } = props;
  return (
    <div className="my-2">
      <Label className="text-light">User name</Label>
      <Input onChange={handleInput} name="username" />
      <Label className="text-light">Password</Label>
      <Input
        type="password"
        className=" mb-2"
        name="password"
        onChange={handleInput}
      />
      <Button
        className="rounded-0 mb-2  col-6"
        color="info"
        onClick={handleLogin}
      >
        Login
      </Button>
      <Button className="rounded-0 mb-2 col-6" color="danger">
        Register
      </Button>
      <Button outline className="rounded-0 col-12">
        Forgot Login Details
      </Button>
    </div>
  );
};

export default LoginComponent;
