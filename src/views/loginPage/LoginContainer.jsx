/*
 * Created on: Sat Nov 07 2020 12:24:40 PM
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
import React, { Component } from "react";
import config from "../../config";
import userAuthServices from "../../services/authServices";
import {
  Col,
  Container,
  Row,
} from "../common/cssFrameworkComponents/CoreComponents";
import LoginComponent from "./LoginComponent";
const {
  tempData: { token },
} = config;

class LoginContainer extends Component {
  constructor() {
    super();
    this.state = {
      alertUserName: false,
      alertPassword: false,
      isValidInput: false,
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  handleLogin = () => {
    const { username, password, isValidInput } = this.state;
    if (username && password && isValidInput) {
      //To DO Validate input, replace this logic with real auth services
      if (username === "admin" && password === "password") {
        userAuthServices.setToken(token);
        this.props.history.push("/login");
      }
    } else {
      console.log("something empty", username, password, isValidInput);
    }
  };
  handleInput = (e) => {
    const {
      target: { name, value },
    } = e;
    const userNameRegex = /^[a-z0-9]{5,}$/;
    const passwordRegex = /^[a-z0-9_!@#$%^&*]{8,}$/;
    let { alertUserName, alertPassword, isValidInput } = this.state;
    switch (name) {
      case "username":
        alertUserName = !userNameRegex.test(value);
        break;
      case "password":
        alertPassword = !passwordRegex.test(value);
        break;

      default:
        break;
    }
    isValidInput = !alertUserName && !alertPassword;
    this.setState({ alertUserName, alertPassword, isValidInput });
    this.setState({
      [name]: value,
    });
  };
  render() {
    let { alertUserName, alertPassword } = this.state;
    return (
      <Container>
        <Row>
          <Col xs={6} lg={4} className="mx-auto my-5">
            <LoginComponent
              handleLogin={this.handleLogin}
              handleInput={this.handleInput}
              alertUserName={alertUserName}
              alertPassword={alertPassword}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginContainer;
