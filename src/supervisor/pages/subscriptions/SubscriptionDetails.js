import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";
import { printElement } from "../../helpers";

function SubscriptionDetails() {
  const history = useHistory();

  const { id } = useParams();
  const query = new URLSearchParams(history.location.search);
  const day = query.get("day");

  const [activeTab, setActiveTab] = useState(day || "monday");

  const [subscription, setSubscription] = useState([]);
  const [bucket, setBucket] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updated, setUpdated] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const [subscriptionStatus, setSubscriptionStatus] = useState({
    status: "",
    cancelMessage: "",
  });
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [subscriptionHistories, setSubscriptionHistoies] = useState([]);

  // Get Subscription Details
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/supervisorSubscriptions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_supervisor_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setSubscription(result.body);
            setBucket(result?.body?.bucketDetails);
            setSubscriptionStatus({
              status: result?.body?.subscriptionStatus,
              cancelMessage: result?.body?.cancelMessage,
            });
            setPaymentStatus(result?.body?.paymentStatus);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, [day, updated]);

  // Get Subscription Histories
  useEffect(() => {
    fetch(
      `${Config.SERVER_URL}/supervisorSubscriptionHistories?subscription=${id}&limit=0`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            "jwt_supervisor_token"
          )}`,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setSubscriptionHistoies(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  const tabClickHandler = (day) => {
    setActiveTab(day);
    const url = history.location.pathname;
    history.push(`${url}?day=${day}`);
  };

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();

    setUpdateLoading(true);

    const data = {
      subscriptionStatus: subscriptionStatus.status,
      paymentStatus: paymentStatus == true ? true : undefined,
    };
    if (subscriptionStatus.status == "CANCELLED") {
      data.cancelledBy = "SUPERVISOR";
      data.cancelMessage = subscriptionStatus.cancelMessage;
    }

    fetch(`${Config.SERVER_URL}/supervisorSubscriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_supervisor_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            setUpdated(!updated);
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              M.toast({ html: result.errors[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setUpdateLoading(false);
        },
        (error) => {
          setUpdateLoading(false);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"SUBSCRIPTION"} pageTitle={"Subscription Details"} />

        {/* End Bread crumb and right sidebar toggle */}

        {/* CUSTOMER DETAILS */}
        <div className={"row"}>
          <div className="col-md-12 d-flex justify-content-between my-3 align-items-center">
            <div className="">
              <h5>
                Subscription Id:
                <span className={""}>{subscription._id}</span>
              </h5>
            </div>
          </div>

          <div className="col-md-12">
            <div className="shadow-sm bg-white py-3">
              <div className="col-md-12">
                <h3 className={"text-info"}>BASIC DETAILS</h3>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  {/* Update Staus */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link active`}
                      id="update-status-tab"
                      data-toggle="tab"
                      data-target="#update-status"
                      type="button"
                      role="tab"
                      aria-controls="update-status"
                      aria-selected="true"
                    >
                      Update Staus
                    </button>
                  </li>

                  {/* Customer Details */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="customer-tab"
                      data-toggle="tab"
                      data-target="#customer"
                      type="button"
                      role="tab"
                      aria-controls="customer"
                      aria-selected="true"
                    >
                      Customer Details
                    </button>
                  </li>

                  {/* Shipping Details */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="shipping-details-tab"
                      data-toggle="tab"
                      data-target="#shipping-details"
                      type="button"
                      role="tab"
                      aria-controls="shipping-details"
                      aria-selected="true"
                    >
                      Shipping Details
                    </button>
                  </li>

                  {/* Subscription Details */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="subscription-details-tab"
                      data-toggle="tab"
                      data-target="#subscription-details"
                      type="button"
                      role="tab"
                      aria-controls="subscription-details"
                      aria-selected="true"
                    >
                      Subscription Details
                    </button>
                  </li>

                  {/* Number of Products */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="number-of-products-tab"
                      data-toggle="tab"
                      data-target="#number-of-products"
                      type="button"
                      role="tab"
                      aria-controls="number-of-products"
                      aria-selected="true"
                    >
                      Number of Products
                    </button>
                  </li>

                  {/* Invoice */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="invoice-tab"
                      data-toggle="tab"
                      data-target="#invoice"
                      type="button"
                      role="tab"
                      aria-controls="invoice"
                      aria-selected="true"
                    >
                      Invoice
                    </button>
                  </li>

                  {/* Subscription History */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="subscription-history-tab"
                      data-toggle="tab"
                      data-target="#subscription-history"
                      type="button"
                      role="tab"
                      aria-controls="subscription-history"
                      aria-selected="true"
                    >
                      Subscription History
                    </button>
                  </li>
                </ul>

                <div className="tab-content" id="myTabContent">
                  {/* Update Status */}
                  <div
                    className={`tab-pane fade show active`}
                    id="update-status"
                    role="tabpanel"
                    aria-labelledby="update-status-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0 col-md-3">
                          <div className="card-body">
                            <form>
                              <div className="form-group">
                                <input
                                  disabled={paymentStatus}
                                  type="checkbox"
                                  className=""
                                  id="payment"
                                  checked={paymentStatus == true ? true : false}
                                  onChange={(evt) => {
                                    setPaymentStatus(evt.target.checked);
                                  }}
                                />
                                <label className="" for="payment">
                                  Subscription Payment
                                </label>
                              </div>
                              <div className="form-group">
                                <label htmlFor="">Select Status</label>
                                <select
                                  disabled={
                                    subscriptionStatus.status == "CANCELLED"
                                      ? true
                                      : false
                                  }
                                  className="form-control bg-light"
                                  onChange={(evt) => {
                                    setSubscriptionStatus({
                                      ...subscriptionStatus,
                                      status: evt.target.value,
                                    });
                                  }}
                                  onClick={(evt) => {
                                    evt.preventDefault();
                                    if (
                                      subscriptionStatus.status == "CANCELLED"
                                    ) {
                                      setShowCancelInput(true);
                                    } else {
                                      setShowCancelInput(false);
                                    }
                                  }}
                                  value={subscriptionStatus.status}
                                >
                                  <option value="ORDERPLACED">
                                    ORDER PLACED
                                  </option>
                                  <option value="RUNNING">RUNNING</option>

                                  <option value="CANCELLED">CANCELLED</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <button
                                  disabled={
                                    updateLoading ||
                                    subscriptionStatus.status == "CANCELLED"
                                  }
                                  className="btn btn-info"
                                  onClick={submitHandler}
                                >
                                  {updateLoading ? (
                                    <Spinner />
                                  ) : (
                                    "Update Status"
                                  )}
                                </button>
                              </div>
                              {/* {showCancelInput ? (
                                <div className="ml-2">
                                  <input
                                    type="text"
                                    value={subscriptionStatus.cancelMessage}
                                    onChange={(evt) =>
                                      setSubscriptionStatus({
                                        ...subscriptionStatus,
                                        cancelMessage: evt.target.value,
                                      })
                                    }
                                    className="form-control shadow-sm ml-4"
                                    placeholder="Reason For Cancel"
                                  />
                                </div>
                              ) : (
                                ""
                              )} */}
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div
                    className={`tab-pane fade show`}
                    id="customer"
                    role="tabpanel"
                    aria-labelledby="customer-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-striped">
                                <tbody>
                                  <tr>
                                    <td scope="col">NAME</td>
                                    <td scope="row">
                                      {`${subscription?.customer?.firstName} ${subscription?.customer?.lastName}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">EMAIL</td>
                                    <td scope="row">
                                      {subscription?.customer?.email}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">MOBILE</td>
                                    <td scope="row">
                                      {subscription?.customer?.mobile}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div
                    className={`tab-pane fade show`}
                    id="shipping-details"
                    role="tabpanel"
                    aria-labelledby="shipping-details-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-striped">
                                <tbody>
                                  <tr>
                                    <td scope="col">NAME</td>
                                    <td scope="row">
                                      {`${subscription?.shippingAddress?.name}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">MOBILE</td>
                                    <td scope="row">
                                      {subscription?.shippingAddress?.mobile}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">EMAIL</td>
                                    <td scope="row">
                                      {subscription?.shippingAddress?.email}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">ADDRESS</td>
                                    <td scope="row">
                                      {subscription?.shippingAddress?.address}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">CITY</td>
                                    <td scope="row">
                                      {subscription?.shippingAddress?.city}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">PINCODE</td>
                                    <td scope="row">
                                      {subscription?.shippingAddress?.pincode}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">AREA</td>
                                    <td scope="row">
                                      {subscription?.shippingAddress?.area}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Details */}
                  <div
                    className={`tab-pane fade show`}
                    id="subscription-details"
                    role="tabpanel"
                    aria-labelledby="subscription-details-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            <div className="table-responsive">
                              <img
                                src={subscription?.bucketDetails?.bucketImage}
                                alt=""
                                className="img img-fluid"
                                style={{ width: "100%", maxHeight: 400 }}
                              />
                              <table className="table table-striped">
                                <tbody>
                                  <tr>
                                    <td scope="col">NAME</td>
                                    <td scope="row">
                                      {subscription?.bucketDetails?.bucketName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">PRICE</td>
                                    <td scope="row">
                                      {/* <span className="mrp">
                            <i className="fas fa-inr"></i>
                            {subscription?.totalAmount}
                          </span> */}

                                      <span className="pl-2">
                                        <i className="fas fa-inr text-sm"></i>
                                        {subscription?.totalAmount}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">START DATE</td>
                                    <td scope="row">
                                      {date.format(
                                        new Date(
                                          subscription?.subscriptionStartDate
                                        ),
                                        "ddd, DD-MMM-YYYY"
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">EXPIRY DATE</td>
                                    <td scope="row">
                                      {date.format(
                                        new Date(
                                          subscription?.subscriptionExpiryDate
                                        ),
                                        "ddd, DD-MMM-YYYY"
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">PAYMENT METHOD</td>
                                    <td scope="row">
                                      <span className="label label-success">
                                        {subscription.paymentMethod}
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">PAYMENT STATUS</td>

                                    <td scope="row">
                                      {subscription.paymentStatus ? (
                                        <span className="label label-success">
                                          PAID
                                        </span>
                                      ) : (
                                        <span className="label label-danger">
                                          UNPAID
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">SUBSCRIPTION STATUS</td>

                                    <td scope="row">
                                      {subscription.subscriptionStatus ==
                                      "CANCELLED" ? (
                                        <span className="label label-danger">
                                          {subscription.subscriptionStatus}
                                        </span>
                                      ) : (
                                        <span className="label label-success">
                                          {subscription.subscriptionStatus}
                                        </span>
                                      )}
                                    </td>
                                  </tr>

                                  {subscription.subscriptionStatus ==
                                  "CANCELLED" ? (
                                    <tr>
                                      <td scope="col">CANCELLED BY</td>

                                      <td scope="row">
                                        <p>{subscription.cancelledBy}</p>
                                        <p>{subscription.cancelMessage}</p>
                                      </td>
                                    </tr>
                                  ) : null}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*No Of Products */}
                  <div
                    className={`tab-pane fade show`}
                    id="number-of-products"
                    role="tabpanel"
                    aria-labelledby="number-of-products-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4 col-xl-4">
                                <div className="day-number-card bg-c-blue order-card">
                                  <div className="card-block">
                                    <h6 className="m-b-20 text-light">
                                      Monday
                                    </h6>
                                    <h2 className="text-right text-light">
                                      <i className="fa fa-sun-o f-left"></i>
                                      <span>{bucket?.monday?.length}</span>
                                    </h2>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 col-xl-4">
                                <div className="day-number-card bg-c-green order-card">
                                  <div className="card-block">
                                    <h6 className="m-b-20 text-light">
                                      Tuesday
                                    </h6>
                                    <h2 className="text-right text-light">
                                      <i className="fa fa-sun-o f-left"></i>
                                      <span>{bucket?.tuesday?.length}</span>
                                    </h2>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-4 col-xl-4">
                                <div className="day-number-card bg-c-yellow order-card">
                                  <div className="card-block">
                                    <h6 className="m-b-20 text-light">
                                      Wednesday
                                    </h6>
                                    <h2 className="text-right text-light">
                                      <i className="fa fa-sun-o f-left"></i>
                                      <span>{bucket?.wednesday?.length}</span>
                                    </h2>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-4 col-xl-4">
                                <div className="day-number-card bg-c-pink order-card">
                                  <div className="card-block">
                                    <h6 className="m-b-20 text-light">
                                      Thrusday
                                    </h6>
                                    <h2 className="text-right text-light">
                                      <i className="fa fa-sun-o f-left"></i>
                                      <span>{bucket?.thursday?.length}</span>
                                    </h2>
                                  </div>
                                </div>
                              </div>

                              {/* Friday */}
                              <div className="col-md-4 col-xl-4">
                                <div className="day-number-card bg-c-blue order-card">
                                  <div className="card-block">
                                    <h6 className="m-b-20 text-light">
                                      Friday
                                    </h6>
                                    <h2 className="text-right text-light">
                                      <i className="fa fa-sun-o f-left"></i>
                                      <span>{bucket?.friday?.length}</span>
                                    </h2>
                                  </div>
                                </div>
                              </div>
                              {/* Saturday */}
                              <div className="col-md-4 col-xl-4">
                                <div className="day-number-card bg-c-green order-card">
                                  <div className="card-block">
                                    <h6 className="m-b-20 text-light">
                                      Saturday
                                    </h6>
                                    <h2 className="text-right text-light">
                                      <i className="fa fa-sun-o f-left"></i>
                                      <span>{bucket?.saturday?.length}</span>
                                    </h2>
                                  </div>
                                </div>
                              </div>

                              {/* Sunday */}
                              <div className="col-md-4 col-xl-4">
                                <div className="day-number-card bg-c-yellow order-card">
                                  <div className="card-block">
                                    <h6 className="m-b-20 text-light">
                                      Sunday
                                    </h6>
                                    <h2 className="text-right text-light">
                                      <i className="fa fa-sun-o f-left"></i>
                                      <span>{bucket?.sunday?.length}</span>
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*Invoice */}
                  <div
                    className={`tab-pane fade show`}
                    id="invoice"
                    role="tabpanel"
                    aria-labelledby="invoice-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            <div
                              className="row invoice row-printable"
                              id="printElement"
                            >
                              <div className="col-md-12">
                                {/* col-lg-12 start here */}
                                <div
                                  className="panel panel-default plain"
                                  id="dash_0"
                                >
                                  {/* Start .panel */}
                                  <div className="panel-body p30 bg-white mt-2 p-3">
                                    <div className="row">
                                      {/* Start .row */}
                                      <div className="col-lg-6">
                                        {/* col-lg-6 start here */}
                                        <div className="invoice-logo">
                                          <img
                                            width="100"
                                            src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                            alt="Invoice logo"
                                          />
                                        </div>
                                      </div>
                                      {/* col-lg-6 end here */}
                                      <div className="col-lg-6">
                                        {/* col-lg-6 start here */}
                                        <div className="invoice-from">
                                          <ul className="list-unstyled text-right">
                                            <li>The Flower</li>
                                            <li>
                                              AD - 130, AD Block, Sector 1,
                                              Bidhannagar, Kolkata,
                                            </li>
                                            <li>West Bengal 700064</li>
                                            <li>VAT Number EU826113958</li>
                                          </ul>
                                        </div>
                                      </div>
                                      {/* col-lg-6 end here */}
                                      <div className="col-lg-12">
                                        {/* col-lg-12 start here */}
                                        <div className="invoice-details mt25">
                                          <div className="border-bottom">
                                            <ul className="list-unstyled mb0">
                                              <li>
                                                <strong>Invoice</strong> #
                                                {subscription._id}
                                              </li>
                                              <li>
                                                <strong>Invoice Date:</strong> #
                                                {date.format(
                                                  new Date(
                                                    subscription.createdAt
                                                  ),
                                                  "ddd, DD-MMM-YYYY"
                                                )}
                                              </li>
                                              <li>
                                                <strong>
                                                  Subscription Start Date:
                                                </strong>
                                                #
                                                {date.format(
                                                  new Date(
                                                    subscription.subscriptionStartDate
                                                  ),
                                                  "ddd, DD-MMM-YYYY"
                                                )}
                                              </li>
                                              <li>
                                                <strong>
                                                  Subscription End Date:
                                                </strong>
                                                #
                                                {date.format(
                                                  new Date(
                                                    subscription.subscriptionExpiryDate
                                                  ),
                                                  "ddd, DD-MMM-YYYY"
                                                )}
                                              </li>
                                              <li>
                                                <strong>Payment Mode:</strong>
                                                <span className="label label-info">
                                                  {subscription.paymentMethod}
                                                </span>
                                              </li>
                                              <li>
                                                <strong>Payment Status:</strong>
                                                {subscription.paymentStatus ? (
                                                  <span className="label label-success">
                                                    PAID
                                                  </span>
                                                ) : (
                                                  <span className="label label-danger">
                                                    UNPAID
                                                  </span>
                                                )}
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="invoice-to mt25">
                                          <ul className="list-unstyled">
                                            <li>
                                              <strong>Invoiced To</strong>
                                            </li>
                                            <li>
                                              {
                                                subscription?.shippingAddress
                                                  ?.name
                                              }
                                            </li>
                                            <li>{`${subscription?.shippingAddress?.mobile}`}</li>
                                            <li>{`${subscription?.shippingAddress?.address}, ${subscription?.shippingAddress?.city}`}</li>
                                            <li>
                                              {
                                                subscription?.shippingAddress
                                                  ?.pincode
                                              }
                                            </li>
                                          </ul>
                                        </div>
                                        <div className="invoice-items">
                                          <div
                                            className="table-responsive"
                                            style={{
                                              overflow: "hidden",
                                              outline: "none",
                                            }}
                                            tabindex="0"
                                          >
                                            <table className="table table-bordered">
                                              <thead>
                                                <tr>
                                                  <th className="per70 text-center">
                                                    Description
                                                  </th>
                                                  <th className="per5 text-center">
                                                    Qty
                                                  </th>
                                                  <th className="per25 text-center">
                                                    Total
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr>
                                                  <td>{bucket.bucketName}</td>
                                                  <td className="text-center">
                                                    1
                                                  </td>
                                                  <td className="text-center">
                                                    <i className="fa fa-inr"></i>
                                                    {
                                                      subscription.subtotalAmount
                                                    }
                                                  </td>
                                                </tr>
                                              </tbody>
                                              <tfoot>
                                                <tr>
                                                  <th
                                                    colspan="2"
                                                    className="text-right"
                                                  >
                                                    Sub Total:
                                                  </th>
                                                  <th className="text-center">
                                                    <i className="fa fa-inr"></i>
                                                    {subscription.totalAmount}
                                                  </th>
                                                </tr>
                                                {/* <tr>
                              <th colspan="2" className="text-right">
                                20% VAT:
                              </th>
                              <th className="text-center">$47.40 USD</th>
                            </tr> */}
                                                {/* <tr>
                              <th colspan="2" className="text-right">
                                Credit:
                              </th>
                              <th className="text-center">$00.00 USD</th>
                            </tr> */}
                                                <tr>
                                                  <th
                                                    colspan="2"
                                                    className="text-right"
                                                  >
                                                    Total:
                                                  </th>
                                                  <th className="text-center">
                                                    <i className="fa fa-inr"></i>
                                                    {subscription.totalAmount}
                                                  </th>
                                                </tr>
                                              </tfoot>
                                            </table>
                                          </div>
                                        </div>
                                        <div className="invoice-footer mt25">
                                          <p className="text-center">
                                            Generated on{" "}
                                            {date.format(
                                              new Date(subscription?.createdAt),
                                              "ddd, DD-MMM-YYYY"
                                            )}{" "}
                                            <button
                                              className="btn btn-default ml15"
                                              onClick={() =>
                                                printElement("printElement")
                                              }
                                            >
                                              <i className="fa fa-print mr5"></i>{" "}
                                              Print
                                            </button>
                                          </p>
                                        </div>
                                      </div>
                                      {/* col-lg-12 end here */}
                                    </div>
                                    {/* End .row */}
                                  </div>
                                </div>
                                {/* End .panel */}
                              </div>
                              {/* col-lg-12 end here */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription History */}
                  <div
                    className={`tab-pane fade show`}
                    id="subscription-history"
                    role="tabpanel"
                    aria-labelledby="subscription-history-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            {subscriptionHistories.length ? (
                              <div className="table-responsive">
                                <table className="table table-striped">
                                  <thead>
                                    <tr>
                                      <th>#ID</th>
                                      <th>Bucket</th>
                                      <th>Status</th>
                                      <th>Message</th>
                                      <th>Payment</th>
                                      <th>Created By</th>
                                      <th>Created At</th>
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
                                                to={`/supervisor/bucket/details/${data?.subscription?.bucketDetails?.bucket}`}
                                              >
                                                {
                                                  data?.subscription
                                                    ?.bucketDetails?.bucketName
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
                                              {data?.paymentStatus
                                                ? "Paid"
                                                : "N/A"}
                                            </td>
                                            <td>{data?.createdBy}</td>
                                            <td>
                                              {date.format(
                                                new Date(data.createdAt),
                                                "DD-MM-YYYY"
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center">
                                <p className="badge badge-danger">
                                  History Not Available
                                </p>
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
        </div>

        {/* Bucket Products */}
        <div className="row mt-2">
          <div className={"col-md-12"}>
            <form
              // onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* SUBSCRIPTION PRODUCTS */}
              <div className={"row"}>
                <div className="col-md-12">
                  <div className="shadow-sm bg-white py-3">
                    <div className="col-md-12">
                      <h3 className={"my-3 text-info"}>
                        SUBSCRIPTION PRODUCTS
                      </h3>
                    </div>

                    <div className="col-md-12">
                      {/* Tabs */}
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        {/* Monday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("monday");
                            }}
                            className={`nav-link ${
                              activeTab == "monday" ? "active" : null
                            }`}
                            id="monday-tab"
                            data-toggle="tab"
                            data-target="#monday"
                            type="button"
                            role="tab"
                            aria-controls="monday"
                            aria-selected="true"
                          >
                            Monday
                          </button>
                        </li>

                        {/* Tuesday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("tuesday");
                            }}
                            className={`nav-link ${
                              activeTab == "tuesday" ? "active" : null
                            }`}
                            id="tuesday-tab"
                            data-toggle="tab"
                            data-target="#tuesday"
                            type="button"
                            role="tab"
                            aria-controls="tuesday"
                            aria-selected="false"
                          >
                            Tuesday
                          </button>
                        </li>

                        {/* Wednesday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("wednesday");
                            }}
                            className={`nav-link ${
                              activeTab == "wednesday" ? "active" : null
                            }`}
                            id="wednesday-tab"
                            data-toggle="tab"
                            data-target="#wednesday"
                            type="button"
                            role="tab"
                            aria-controls="wednesday"
                            aria-selected="false"
                          >
                            Wednesday
                          </button>
                        </li>

                        {/* Thursday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("thursday");
                            }}
                            className={`nav-link ${
                              activeTab == "thursday" ? "active" : null
                            }`}
                            id="thursday-tab"
                            data-toggle="tab"
                            data-target="#thursday"
                            type="button"
                            role="tab"
                            aria-controls="thursday"
                            aria-selected="false"
                          >
                            Thursday
                          </button>
                        </li>

                        {/* Friday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("friday");
                            }}
                            className={`nav-link ${
                              activeTab == "friday" ? "active" : null
                            }`}
                            id="friday-tab"
                            data-toggle="tab"
                            data-target="#friday"
                            type="button"
                            role="tab"
                            aria-controls="friday"
                            aria-selected="false"
                          >
                            Friday
                          </button>
                        </li>

                        {/* Saturday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("saturday");
                            }}
                            className={`nav-link ${
                              activeTab == "saturday" ? "active" : null
                            }`}
                            id="saturday-tab"
                            data-toggle="tab"
                            data-target="#saturday"
                            type="button"
                            role="tab"
                            aria-controls="saturday"
                            aria-selected="false"
                          >
                            Saturday
                          </button>
                        </li>

                        {/* Sunday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("sunday");
                            }}
                            className={`nav-link ${
                              activeTab == "sunday" ? "active" : null
                            }`}
                            id="sunday-tab"
                            data-toggle="tab"
                            data-target="#sunday"
                            type="button"
                            role="tab"
                            aria-controls="sunday"
                            aria-selected="false"
                          >
                            Sunday
                          </button>
                        </li>
                      </ul>

                      {/* Details */}
                      <div className="tab-content" id="myTabContent">
                        {/* Monday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "monday" ? "active" : null
                          }`}
                          id="monday"
                          role="tabpanel"
                          aria-labelledby="monday-tab"
                        >
                          {bucket?.monday?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket?.monday?.map(
                                      ({ product, quantity }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>{quantity}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tuesday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "tuesday" ? "active" : null
                          }`}
                          id="tuesday"
                          role="tabpanel"
                          aria-labelledby="tuesday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product, quantity }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>{quantity}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Wednesday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "wednesday" ? "active" : null
                          }`}
                          id="wednesday"
                          role="tabpanel"
                          aria-labelledby="wednesday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product, quantity }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>

                                            <td>{quantity}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Thursday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "thursday" ? "active" : null
                          }`}
                          id="thursday"
                          role="tabpanel"
                          aria-labelledby="thursday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product, quantity }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>{quantity}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Friday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "friday" ? "active" : null
                          }`}
                          id="friday"
                          role="tabpanel"
                          aria-labelledby="friday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product, quantity }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>{quantity}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Saturday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "saturday" ? "active" : null
                          }`}
                          id="saturday"
                          role="tabpanel"
                          aria-labelledby="saturday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product, quantity }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>{quantity}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Sunday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "sunday" ? "active" : null
                          }`}
                          id="sunday"
                          role="tabpanel"
                          aria-labelledby="sunday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product, quantity }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>

                                            <td>{quantity}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Invoice */}
        {/* <div className="container-fluid bootdey">
          
        </div> */}
      </div>
    </div>
  );
}

export default SubscriptionDetails;
