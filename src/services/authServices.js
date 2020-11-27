import constants from "../utils/constants";

/*
 * Created on: Thu Nov 19 2020 1:10:13 PM
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
const { USER } = constants;
/**
 * Sets a global property. Using html5 local storage
 * @param {String} propertyName
 * @param {Object} propertyValue
 */
const setProperty = (propertyName, propertyValue) => {
  localStorage.setItem(propertyName, propertyValue);
};

/**
 * Retrieve global property by name
 * @param {String} propertyName
 */
const getProperty = (propertyName) => localStorage.getItem(propertyName);

/**
 * Remove global property by name
 * @param {String} propertyName
 */
const clearProperty = (propertyName) => {
  localStorage.removeItem(propertyName);
};

const userAuthServices = {
  setToken: (token) => setProperty(USER.AUTH_TOKEN, token),
  getToken: () => getProperty(USER.AUTH_TOKEN),
  clearToken: () => clearProperty(USER.AUTH_TOKEN),
};

Object.freeze(userAuthServices);
export default userAuthServices;
