import React, { Component } from "react";
import "../../styles/homePageStyle.css";
import orderForm from "../../assets/images/orderForm.png";
import portFolioTable from "../../assets/images/portFolioTable.png";

class HomePageContainer extends Component {
  componentDidMount() {}

  render() {
    let currentYear = new Date().getFullYear();
    console.log("ENV variable::UI", process.env.UI_ENV);
    return (
      <div>
        <div class="container-fluid topHeading">
          <h1>Tick Simulator</h1>
        </div>

        {/* <nav class="navbar navbar-inverse" data-spy="affix" data-offset-top="1">
          <div class="container-fluid">
            <div class="navbar-header">
              <button
                type="button"
                class="navbar-toggle"
                data-toggle="collapse"
                data-target="#myNavbar"
              >
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="#">
                TickSim
              </a>
            </div>
            <div>
              <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav">
                  <li>
                    <a href="#home">Graph</a>
                  </li>
                  <li>
                    <a href="#section2">Order Placing Form</a>
                  </li>
                  <li>
                    <a href="#section3">Portfolio Table</a>
                  </li>
                  <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                      Price <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                      <li>
                        <a href="#section41">Free for Vloggers</a>
                      </li>
                      <li>
                        <a href="#section42">Try Demo</a>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <a href="/login">Login</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav> */}

        <div id="home" class="container-fluid">
          <h1>Stimulated stock trading tick with Candle Stick Graph</h1>
          <p>
            We used modern advanced candle stick based graph to visualize the
            market flow, so you can easy find out the high, low, open, close of
            a tick.
          </p>
          <p>
            Each tick will be stimulated with historical chart patterns so every
            movement will be useful to track and learn every pulse of stock
            market.
          </p>
          <p>
            Mouse point tracking cross lines will easily guide to the S & R
            levels as well as time & price.
          </p>
        </div>
        <div id="section2" class="container-fluid">
          <div class="row">
            <div class="col-md-8">
              <h1>Order with Target and Stop loss price</h1>
              <p>
                Ours user friendly order placing form will lead you to the basic
                order placing step of stock market.
              </p>
              <p>
                We introduced order form with mandatory target and stop loss
                price, which is a basic strategy in stock market trading to
                avoid huge loss and exit with profit
              </p>
            </div>
            <div class="col-md-4">
              <img src={orderForm} alt="" />
            </div>
          </div>
        </div>
        <div id="section3" class="container-fluid">
          <div class="row">
            <div class="col-md-6">
              <h1>Portfolio Table</h1>
              <p>
                Every trader need to know current position of a traded order, so
                we simply introduced a single table with editable field to
                adjust target or stop loss.
              </p>
              <p>
                Major strategy on stock trading is 'saving money or profit
                having major role than earning money'. To achieve this, our
                portfolio table will be able to show current profit on each
                order and current risk : reward ratio. So every traders will get
                the clear picture of risk and reward.
              </p>
            </div>
            <div class="col-md-6">
              <img src={portFolioTable} alt="" />
            </div>
          </div>
        </div>
        <div class="footer container-fluid">
          <div class="row pl-2 pr-2">
            <div class="col-md-4">
              <h5>APP</h5>
              <ul type="none">
                <li>
                  <a href="#home">Graph</a>
                </li>
                <li>
                  <a href="#section2">Order Placing Form</a>
                </li>
                <li>
                  <a href="#section3">Portfolio Table</a>
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <h5>PRICE</h5>
              <ul type="none">
                <li>
                  <a href="#section41">Free for Vloggers</a>
                </li>
                <li>
                  <a href="#section42">Try Demo</a>
                </li>
                <li>
                  <a href="#section42">Purchase</a>
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <h5>COMPANY</h5>
              <ul type="none">
                <li>
                  <a href="/login">Login</a>
                </li>
                <li>
                  <a href="/login">About us</a>
                </li>
                <li>
                  <a href="/login">Contact us</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="copyrightBox">
            Copyright &copy; {currentYear} - vveeo.com
          </div>
        </div>
      </div>
    );
  }
}

export default HomePageContainer;
