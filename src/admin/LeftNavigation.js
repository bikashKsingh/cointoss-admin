import React, { useContext, useState, useEffect } from "react";
import { Link, BrowserRouter, useHistory } from "react-router-dom";
import { AdminContext } from "./AdminRouter";
import $ from "jquery";

function LeftNavigation() {
  const history = useHistory();
  const { state, dispatch } = useContext(AdminContext);

  // Fetching the data
  useEffect(() => {}, []);

  // Login Function
  const logout = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("admin");
    localStorage.removeItem("jwt_admin_token");
    dispatch({ type: "CLEAR" });
    history.push("/admin/login");
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
                  to="/admin"
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
                    to="/admin/profile"
                    className="dropdown-item"
                    onClick={removeLeftNavigation}
                  >
                    <i className="ti-user"></i> My Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/admin/profile"
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
                    to="/admin"
                    onClick={removeLeftNavigation}
                  >
                    <i className="mdi mdi-gauge"></i>
                    <span className="hide-menu">Dashboard </span>
                  </Link>
                </li>

                {/* Setup Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-settings"></i>
                    <span className="hide-menu">SETTING</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/admin/mainMenus"
                        onClick={removeLeftNavigation}
                      >
                        Main Menu
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/setting" onClick={removeLeftNavigation}>
                        Setting
                      </Link>
                    </li>

                    <li>
                      <Link to="/admin/coupons" onClick={removeLeftNavigation}>
                        Coupons
                      </Link>
                    </li>
                  </ul>
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
                        to="/admin/customers"
                        onClick={removeLeftNavigation}
                      >
                        User Lists
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/newsletters"
                        onClick={removeLeftNavigation}
                      >
                        Newsletter Emails
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/inquires" onClick={removeLeftNavigation}>
                        Inquires
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/testimonials"
                        onClick={removeLeftNavigation}
                      >
                        Testimonial User
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* DELIVERY BOYS Section */}
                {/* <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-plus"></i>
                    <span className="hide-menu">DELIVERY BOYS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/admin/deliveryBoys"
                        onClick={removeLeftNavigation}
                      >
                        Delivery Boys List
                      </Link>
                    </li>
                  </ul>
                </li> */}

                {/* SUPERVISOR Section */}
                {/* <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-plus"></i>
                    <span className="hide-menu">SUPERVISOR</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link
                        to="/admin/supervisors"
                        onClick={removeLeftNavigation}
                      >
                        Supervisor Lists
                      </Link>
                    </li>
                  </ul>
                </li> */}

                {/* Banners Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-image-area"></i>
                    <span className="hide-menu">BANNERS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/admin/slider" onClick={removeLeftNavigation}>
                        Main Slider
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/nextToSlider"
                        onClick={removeLeftNavigation}
                      >
                        Next to Slider
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/bestSaleBanner"
                        onClick={removeLeftNavigation}
                      >
                        Best Sale Banner
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categoryPageBanner"
                        onClick={removeLeftNavigation}
                      >
                        Category Page Banner
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/admin/offerBanner"
                        onClick={removeLeftNavigation}
                      >
                        Offer Banner
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Content Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-note-text"></i>
                    <span className="hide-menu">WEB CONTENTS</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/admin/aboutUs" onClick={removeLeftNavigation}>
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/contactUs"
                        onClick={removeLeftNavigation}
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/termsConditions"
                        onClick={removeLeftNavigation}
                      >
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/privacyPolicy"
                        onClick={removeLeftNavigation}
                      >
                        Privacy & Policy
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
              to="/admin/setting"
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
