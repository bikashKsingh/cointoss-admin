import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const CustomerDetails = () => {
  const history = useHistory();
  const { id } = useParams();
  const [userLoaded, setUserLoaded] = useState(false);
  const query = new URLSearchParams(history.location.search);

  const tab = query.get("tab");
  const [activeTab, setActiveTab] = useState(tab || "profile");

  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const [subscriptionHistories, setSubscriptionHistories] = useState([]);
  const [subscriptionHistoryLoading, setSubscriptionHistoryLoading] =
    useState(true);

  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);

  const [orderHistories, setOrderHistories] = useState([]);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(true);

  const [user, setUser] = useState({
    shippingAddresses: [],
    wallet: {
      history: [],
      totalAmount: 0,
    },
  });

  // get Customer Details
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/customers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setUser(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setUserLoaded(true);
        },
        (error) => {
          setUserLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Subscription Details
  useEffect(() => {
    setUserLoaded(false);
    fetch(
      `${Config.SERVER_URL}/adminSubscriptions?customer=${id}&limit=10&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setSubscriptions(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setSubscriptionLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setSubscriptionLoading(false);
        }
      );
  }, []);

  // get Subscription History Details
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/adminSubscriptionHistories?customer=${id}&limit=10&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setSubscriptionHistories(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setSubscriptionHistoryLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setSubscriptionHistoryLoading(false);
        }
      );
  }, []);

  const tabClickHandler = (tabName) => {
    setActiveTab(tabName);
    const url = history.location.pathname;
    history.push(`${url}?tab=${tabName}`);
  };

  // get Order Details
  useEffect(() => {
    setUserLoaded(false);
    fetch(`${Config.SERVER_URL}/adminOrders?customer=${id}&limit=10&page=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setOrders(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setOrderLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setOrderLoading(false);
        }
      );
  }, []);

  // get Order History Details
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/adminOrderHistories?customer=${id}&limit=10&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setOrderHistories(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setOrderHistoryLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setOrderHistoryLoading(false);
        }
      );
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"CUSTOMER"} pageTitle={"Customer Details"} />
        {/* Details */}

        {userLoaded ? (
          <div className={"row"}>
            <div className="col-md-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  {/* Tabs */}
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {/* Profile */}
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => {
                          tabClickHandler("profile");
                        }}
                        className={`nav-link ${
                          activeTab == "profile" ? "active" : null
                        }`}
                        id="profile-tab"
                        data-toggle="tab"
                        data-target="#profile"
                        type="button"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="true"
                      >
                        Profile
                      </button>
                    </li>

                    {/* Wallet */}
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => {
                          tabClickHandler("wallet");
                        }}
                        className={`nav-link ${
                          activeTab == "wallet" ? "active" : null
                        }`}
                        id="wallet-tab"
                        data-toggle="tab"
                        data-target="#wallet"
                        type="button"
                        role="tab"
                        aria-controls="wallet"
                        aria-selected="false"
                      >
                        Wallet
                      </button>
                    </li>

                    {/* Subscriptions History */}
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => {
                          tabClickHandler("subscriptions-history");
                        }}
                        className={`nav-link ${
                          activeTab == "subscriptions-history" ? "active" : null
                        }`}
                        id="subscriptions-history-tab"
                        data-toggle="tab"
                        data-target="#subscriptions-history"
                        type="button"
                        role="tab"
                        aria-controls="subscriptions-history"
                        aria-selected="false"
                      >
                        Subscriptions History
                      </button>
                    </li>

                    {/* Orders */}
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => {
                          tabClickHandler("orders");
                        }}
                        className={`nav-link ${
                          activeTab == "orders" ? "active" : null
                        }`}
                        id="orders-tab"
                        data-toggle="tab"
                        data-target="#orders"
                        type="button"
                        role="tab"
                        aria-controls="orders"
                        aria-selected="false"
                      >
                        Orders
                      </button>
                    </li>

                    {/* Order History */}
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => {
                          tabClickHandler("order-history");
                        }}
                        className={`nav-link ${
                          activeTab == "order-history" ? "active" : null
                        }`}
                        id="order-history-tab"
                        data-toggle="tab"
                        data-target="#order-history"
                        type="button"
                        role="tab"
                        aria-controls="order-history"
                        aria-selected="false"
                      >
                        Order History
                      </button>
                    </li>
                  </ul>

                  {/* Details */}
                  <div className="tab-content" id="myTabContent">
                    {/* Profile */}
                    <div
                      className={`tab-pane fade show ${
                        activeTab == "profile" ? "active" : null
                      }`}
                      id="profile"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                    >
                      <div className="row">
                        <div className="col-md-12">
                          {/* Personal Details */}
                          <div className="card shadow-none border-0">
                            <div className="card-body">
                              <div className="d-flex">
                                <div className="py-3">
                                  <img
                                    style={{
                                      height: "100px",
                                      width: "100px",
                                      borderRadius: "50px",
                                    }}
                                    src="/assets/images/user-placeholder.png"
                                    alt=""
                                  />
                                </div>

                                <div className="p-2 ml-3 ">
                                  <h4 className="p-0 m-0">
                                    {user.firstName} {user.lastName}
                                  </h4>
                                  <p className="p-0 m-0 text-sm">
                                    <span className="badge badge-info">
                                      {user._id}
                                    </span>
                                  </p>
                                  <h5>{user.email} </h5>
                                  <h5>{user.mobile} </h5>
                                  <h5>
                                    Account Verified:
                                    {user.isVerified ? (
                                      <span className="text-info mdi mdi-checkbox-marked-circle"></span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        Not Verified
                                      </span>
                                    )}
                                  </h5>
                                  <h5>
                                    Account Status:
                                    {user.status ? (
                                      <span className="badge badge-info">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        Disabled
                                      </span>
                                    )}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          {/* Address */}
                          <div className="card shadow-none border-0">
                            <div className="card-body">
                              <h5 className="">Address</h5>
                              <div className="ml-2">
                                <p>Address : {user.address}</p>
                                <p>Country : {user.country}</p>
                                <p>State : {user.state}</p>
                                <p>City : {user.city}</p>
                                <p>Pincode : {user.pincode}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wallet */}
                    <div
                      className={`tab-pane fade show ${
                        activeTab == "wallet" ? "active" : null
                      }`}
                      id="wallet"
                      role="tabpanel"
                      aria-labelledby="wallet-tab"
                    >
                      <div className="row">
                        <div className="col-md-12 table-responsive">
                          {/* Wallet Details */}
                          <div className="card shadow-none border-0 mt-3">
                            <h5>
                              Amount : <i className="fa fa-inr"></i>
                              {user.wallet}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscriptions History */}
                    <div
                      className={`tab-pane fade show ${
                        activeTab == "subscriptions-history" ? "active" : null
                      }`}
                      id="subscriptions-history"
                      role="tabpanel"
                      aria-labelledby="subscriptions-history-tab"
                    >
                      <div className="row">
                        <div className="col-md-12 table-responsive">
                          {/* Subscription Details */}
                          <div className="card shadow-sm border-0 mt-3">
                            {subscriptionHistoryLoading ? (
                              <div className={"bg-white p-3 text-center"}>
                                <Spinner />
                              </div>
                            ) : (
                              <div class="card-body">
                                {subscriptionHistories.length ? (
                                  <div class="table-responsive">
                                    <table class="table bg-white">
                                      <thead>
                                        <tr>
                                          <th>#ID</th>
                                          <th>Bucket</th>
                                          {/* <th>Start Date</th>
                                          <th>Expiry Date</th> */}
                                          <th>Status</th>
                                          <th>Message</th>
                                          <th>Created At</th>
                                          <th>Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {subscriptionHistories.map(
                                          (data, index) => {
                                            return (
                                              <tr key={index}>
                                                <td> # {++index} </td>
                                                <td>
                                                  <Link
                                                    to={`/admin/bucket/details/${data?.subscription?.bucketDetails?.bucket}`}
                                                  >
                                                    {
                                                      data?.subscription
                                                        ?.bucketDetails
                                                        ?.bucketName
                                                    }
                                                  </Link>
                                                </td>

                                                <td>
                                                  <span class="text-info">
                                                    {data.subscriptionStatus}
                                                  </span>
                                                </td>
                                                <td>{data?.message}</td>
                                                <td>
                                                  {date.format(
                                                    new Date(data.createdAt),
                                                    "DD-MM-YYYY"
                                                  )}
                                                </td>
                                                <td>
                                                  <Link
                                                    class="btn btn-info"
                                                    to={`/admin/subscriptionHistory/details/${data._id}`}
                                                  >
                                                    View
                                                  </Link>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="alert alert-danger h6">
                                    Subscription History Not Available.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Orders */}
                    <div
                      className={`tab-pane fade show ${
                        activeTab == "orders" ? "active" : null
                      }`}
                      id="orders"
                      role="tabpanel"
                      aria-labelledby="orders-tab"
                    >
                      <div className="row">
                        <div className="col-md-12 table-responsive">
                          {/* Order Details */}
                          <div className="card shadow-sm border-0 mt-3">
                            {orderLoading ? (
                              <div className={"bg-white p-3 text-center"}>
                                <Spinner />
                              </div>
                            ) : (
                              <div class="card-body">
                                {orders.length ? (
                                  <div class="table-responsive">
                                    <table class="table bg-white">
                                      <thead>
                                        <tr>
                                          <th>#ID</th>
                                          <th>Order Date</th>
                                          <th>Delivery Date</th>
                                          <th>Status</th>
                                          <th>Amount</th>
                                          <th>Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {orders.map((data, index) => {
                                          return (
                                            <tr key={index}>
                                              <td> # {++index} </td>
                                              <td>
                                                {date.format(
                                                  new Date(data.createdAt),
                                                  "DD-MM-YYYY"
                                                )}
                                              </td>
                                              <td>
                                                {date.format(
                                                  new Date(
                                                    data.orderDeliveryDate
                                                  ),
                                                  "DD-MM-YYYY"
                                                )}
                                              </td>

                                              <td>
                                                <span class="text-info">
                                                  {data.orderStatus}
                                                </span>
                                              </td>
                                              <td>
                                                <i class="fa fa-inr"></i>
                                                {data?.totalAmount}
                                              </td>
                                              <td>
                                                <Link
                                                  class="btn btn-info"
                                                  to={`/admin/order/details/${data._id}`}
                                                >
                                                  View
                                                </Link>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="alert alert-danger h6">
                                    Order Not Available.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order History */}
                    <div
                      className={`tab-pane fade show ${
                        activeTab == "order-history" ? "active" : null
                      }`}
                      id="order-history"
                      role="tabpanel"
                      aria-labelledby="order-history-tab"
                    >
                      <div className="row">
                        <div className="col-md-12 table-responsive">
                          {/* Subscription Details */}
                          <div className="card shadow-sm border-0 mt-3">
                            {orderHistoryLoading ? (
                              <div className={"bg-white p-3 text-center"}>
                                <Spinner />
                              </div>
                            ) : (
                              <div class="card-body">
                                {orderHistories.length ? (
                                  <div class="table-responsive">
                                    <table class="table bg-white">
                                      <thead>
                                        <tr>
                                          <th>#ID</th>
                                          <td>Order</td>
                                          <th>Status</th>
                                          <th>Message</th>
                                          <th>Created At</th>
                                          <th>Created By</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {orderHistories.map((data, index) => {
                                          return (
                                            <tr key={index}>
                                              <td> # {++index} </td>
                                              <td>
                                                <Link to={`#`}>
                                                  {data?.order?._id}
                                                </Link>
                                              </td>

                                              <td>{data?.orderStatus}</td>
                                              <td>{data?.message}</td>
                                              <td>
                                                {date.format(
                                                  new Date(data.createdAt),
                                                  "DD-MM-YYYY"
                                                )}
                                              </td>
                                              <td>{data?.createdBy}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="alert alert-danger h6">
                                    Order History Not Available.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-12 m-auto">
            <div className={"bg-white p-3 text-center"}>
              <span
                className="spinner-border spinner-border-sm mr-1"
                role="status"
                aria-hidden="true"
              ></span>
              Loading..
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
