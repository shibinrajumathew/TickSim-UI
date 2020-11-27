/*
 * Created on: Fri Nov 20 2020 1:54:27 PM
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
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { tsWrapper } from "./tsWrapper";
import userAuthServices from "../services/authServices";

const isAuthenticated = () => !!userAuthServices.getToken();
console.log("isAuthenticated", isAuthenticated());

const getPrivateComponent = (props, Component, pathname) =>
  isAuthenticated() ? (
    <Component {...props} />
  ) : (
    <Redirect to={{ pathname, state: { from: props.location } }} />
  );
const getPublicComponent = (
  props,
  Component,
  pathname,
  { path: currentPath }
) =>
  isAuthenticated() ? <Redirect to={{ pathname }} /> : <Component {...props} />;

const PrivateComponent = ({ component, redirectPath, ...rest }) => (
  <Route
    {...rest}
    render={tsWrapper((props) =>
      getPrivateComponent(props, component, redirectPath)
    )}
  />
);
const PublicComponent = ({ component, redirectPath, ...rest }) => (
  <Route
    {...rest}
    render={tsWrapper((props) =>
      getPublicComponent(props, component, redirectPath, rest)
    )}
  />
);

PrivateComponent.defaultProps = {
  location: null,
};

PrivateComponent.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.func,
};
PublicComponent.defaultProps = {
  location: null,
};

PublicComponent.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.func,
};
class Controller extends BrowserRouter {}
export { PrivateComponent, PublicComponent, Controller };
