import React, { useContext, useState, useEffect } from "react";
import { Link, BrowserRouter, useHistory } from "react-router-dom";
import { DeliveryBoyContext } from "./DeliveryBoyRouter";
import $ from "jquery";

function LeftNavigation() {
  const history = useHistory();
  const { state, dispatch } = useContext(DeliveryBoyContext);

  // Fetching the data
  useEffect(() => {}, []);

  // Login Function
  const logout = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("admin");
    localStorage.removeItem("jwt_deliveryBoy_token");
    dispatch({ type: "CLEAR" });
    history.push("/deliveryBoy/login");
  };

  // Remove Left Navigation When Click On The Link
  const removeLeftNavigation = (evt) => {
    $("body").removeClass("show-sidebar");
  };

  // Return Function
  return (
    <div>
      {state && (
        <aside className="left-sidebar">
          {/* <!-- Sidebar scroll--> */}
          <div className="scroll-sidebar">
            {/* <!-- User profile --> */}
            <div
              className="user-profile"
              style={{
                background:
                  "url(../assets/images/background/user-info.jpg) no-repeat",
              }}
            >
              {/* <!-- User profile image --> */}
              <div className="profile-img text-center">
                {state.profile_picture ? (
                  <img src={state.profile_picture} alt="user" />
                ) : (
                  <span
                    className={"fas fa-user-circle text-white"}
                    style={{ fontSize: "51px" }}
                  />
                )}
              </div>
              {/* <!-- User profile text--> */}
              <div className="profile-text">
                <Link
                  to="/deliveryBoy"
                  className="dropdown-toggle u-dropdown"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {state.name}
                </Link>

                <div className="dropdown-menu animated flipInY">
                  <Link
                    to="/deliveryBoy/profile"
                    className="dropdown-item"
                    onClick={removeLeftNavigation}
                  >
                    <i className="ti-user"></i> My Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/deliveryBoy/profile"
                    className="dropdown-item"
                    onClick={removeLeftNavigation}
                  >
                    <i className="ti-settings"></i> Account Setting
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link className="dropdown-item" to={"#"} onClick={logout}>
                    <i className="fa fa-power-off"></i> Logout
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- End User profile text--> */}

            {/* <!-- Sidebar navigation--> */}
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="nav-small-cap">PERSONAL</li>
                {/* Dashboard */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/deliveryBoy"
                    onClick={removeLeftNavigation}
                  >
                    <i className="mdi mdi-gauge"></i>
                    <span className="hide-menu">Dashboard </span>
                  </Link>
                </li>

                {/* Users Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-plus"></i>
                    <span className="hide-menu">USERS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/deliveryBoy/customers"
                        onClick={removeLeftNavigation}
                      >
                        User Lists
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* DELIVERY Area Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-plus"></i>
                    <span className="hide-menu">DELIVERY AREAS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/deliveryBoy/deliveryAreas"
                        onClick={removeLeftNavigation}
                      >
                        Delivery Area
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* DELIVERY */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-checkbox-multiple-marked-circle"></i>
                    <span className="hide-menu">DELIVERY</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/deliveryBoy/subscriptionsForDelivery"
                        onClick={removeLeftNavigation}
                      >
                        Subscriptions Delivery
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Order Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-checkbox-multiple-marked-circle"></i>
                    <span className="hide-menu">ORDERS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/deliveryBoy/newOrders"
                        onClick={removeLeftNavigation}
                      >
                        Today Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/deliveryBoy/orders"
                        onClick={removeLeftNavigation}
                      >
                        Order List
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Report Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-chart-bar"></i>
                    <span className="hide-menu">REPORTS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/deliveryBoy/subscriptionReports"
                        onClick={removeLeftNavigation}
                      >
                        Subscription Reports
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/deliveryBoy/deliveryReports"
                        onClick={removeLeftNavigation}
                      >
                        Delivery Reports
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            {/* <!-- End Sidebar navigation --> */}
          </div>
          {/* <!-- End Sidebar scroll--> */}
          {/* <!-- Bottom points--> */}
          <div className="sidebar-footer">
            {/* <!-- item--> */}
            <Link
              to="/deliveryBoy/setting"
              className="link"
              data-toggle="tooltip"
              title="Settings"
              onClick={removeLeftNavigation}
            >
              <i className="ti-settings"></i>
            </Link>
            {/* <!-- item--> */}
            <Link
              to="#"
              className="link"
              data-toggle="tooltip"
              title="Email"
              onClick={removeLeftNavigation}
            >
              <i className="mdi mdi-gmail"></i>
            </Link>
            {/* <!-- item--> */}

            <Link
              to="#"
              onClick={(evt) => logout(evt)}
              className="link"
              data-toggle="tooltip"
              title="Logout"
            >
              <i className="mdi mdi-power"></i>
            </Link>
          </div>
          {/* <!-- End Bottom points--> */}
        </aside>
      )}
    </div>
  );
}

export default LeftNavigation;
