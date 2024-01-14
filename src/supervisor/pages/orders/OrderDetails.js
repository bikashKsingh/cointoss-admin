import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";
import { printElement } from "../../helpers";

function OrderDetails() {
  const history = useHistory();

  const { id } = useParams();
  const query = new URLSearchParams(history.location.search);
  const day = query.get("day");

  const [activeTab, setActiveTab] = useState(day || "monday");

  const [orderDetails, setOrderDetails] = useState([]);
  const [bucket, setBucket] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updated, setUpdated] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const [orderStatus, setOrderStatus] = useState({
    status: "",
    cancelMessage: "",
  });
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [orderHistories, setOrderHistoies] = useState([]);

  // Get Order Details
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/supervisorOrders/${id}`, {
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
            setOrderDetails(result.body);
            setBucket(result?.body?.bucketDetails);
            setOrderStatus({
              status: result?.body?.orderStatus,
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

  // Get Order Histories
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/supervisorOrderHistories?order=${id}&limit=0`, {
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
            setOrderHistoies(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();

    setUpdateLoading(true);

    const data = {
      orderStatus: orderStatus.status,
      paymentStatus: paymentStatus == true ? true : undefined,
    };
    if (orderStatus.status == "CANCELLED") {
      data.cancelledBy = "SUPERVISOR";
      data.cancelMessage = orderStatus.cancelMessage;
    }

    fetch(`${Config.SERVER_URL}/supervisorOrders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
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
        <Breadcrumb title={"ORDER"} pageTitle={"Order Details"} />

        {/* End Bread crumb and right sidebar toggle */}

        {/* CUSTOMER DETAILS */}
        <div className={"row"}>
          <div className="col-md-12 d-flex justify-content-between my-3 align-items-center">
            <div className="">
              <h5>
                Order Id:
                <span className={""}>{orderDetails._id}</span>
              </h5>
            </div>
          </div>

          <div className="col-md-12">
            <div className="shadow-sm bg-white py-3">
              <div className="col-md-12">
                <h3 className={"text-info"}>ORDER DETAILS</h3>
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

                  {/* Order Details */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="order-details-tab"
                      data-toggle="tab"
                      data-target="#order-details"
                      type="button"
                      role="tab"
                      aria-controls="order-details"
                      aria-selected="true"
                    >
                      Order Details
                    </button>
                  </li>

                  {/* Product Details */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="product-details-tab"
                      data-toggle="tab"
                      data-target="#product-details"
                      type="button"
                      role="tab"
                      aria-controls="product-details"
                      aria-selected="true"
                    >
                      Product Details
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

                  {/* Order History */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link`}
                      id="order-history-tab"
                      data-toggle="tab"
                      data-target="#order-history"
                      type="button"
                      role="tab"
                      aria-controls="order-history"
                      aria-selected="true"
                    >
                      Order History
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
                        <div className="card shadow-none border-0 col-md-6">
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
                                  Order Payment
                                </label>
                              </div>
                              <div className="form-group">
                                <label htmlFor="">Select Status</label>
                                <div className="d-flex" style={{ gap: "10px" }}>
                                  <select
                                    disabled={
                                      orderDetails?.orderStatus == "CANCELLED"
                                        ? true
                                        : false
                                    }
                                    className="form-control bg-light"
                                    onChange={(evt) => {
                                      setOrderStatus({
                                        ...orderStatus,
                                        status: evt.target.value,
                                      });
                                    }}
                                    onClick={(evt) => {
                                      evt.preventDefault();
                                      if (orderStatus.status == "CANCELLED") {
                                        setShowCancelInput(true);
                                      } else {
                                        setShowCancelInput(false);
                                      }
                                    }}
                                    value={orderStatus.status}
                                  >
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                  </select>

                                  {showCancelInput ? (
                                    <input
                                      type="text"
                                      value={orderStatus.cancelMessage}
                                      onChange={(evt) =>
                                        setOrderStatus({
                                          ...orderStatus,
                                          cancelMessage: evt.target.value,
                                        })
                                      }
                                      className="form-control bg-light"
                                      placeholder="Reason For Cancel"
                                    />
                                  ) : (
                                    <div className=""></div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group">
                                <button
                                  disabled={
                                    updateLoading ||
                                    orderDetails?.orderStatus == "CANCELLED" ||
                                    orderDetails?.orderStatus == "DELIVERED"
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
                                      {`${orderDetails?.customer?.firstName} ${orderDetails?.customer?.lastName}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">EMAIL</td>
                                    <td scope="row">
                                      {orderDetails?.customer?.email}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">MOBILE</td>
                                    <td scope="row">
                                      {orderDetails?.customer?.mobile}
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
                                      {`${orderDetails?.shippingAddress?.name}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">MOBILE</td>
                                    <td scope="row">
                                      {orderDetails?.shippingAddress?.mobile}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">EMAIL</td>
                                    <td scope="row">
                                      {orderDetails?.shippingAddress?.email}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">ADDRESS</td>
                                    <td scope="row">
                                      {orderDetails?.shippingAddress?.address}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">CITY</td>
                                    <td scope="row">
                                      {orderDetails?.shippingAddress?.city}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">PINCODE</td>
                                    <td scope="row">
                                      {
                                        orderDetails?.shippingAddress?.pincode
                                          ?.pincode
                                      }
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">AREA</td>
                                    <td scope="row">
                                      {
                                        orderDetails?.shippingAddress?.area
                                          ?.name
                                      }
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

                  {/* Order Details */}
                  <div
                    className={`tab-pane fade show`}
                    id="order-details"
                    role="tabpanel"
                    aria-labelledby="order-details-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            <div className="table-responsive">
                              <img
                                src={orderDetails?.bucketDetails?.bucketImage}
                                alt=""
                                className="img img-fluid"
                                style={{ width: "100%", maxHeight: 400 }}
                              />
                              <table className="table table-striped">
                                <tbody>
                                  <tr>
                                    <td scope="col">PRICE</td>
                                    <td scope="row">
                                      <span className="pl-2">
                                        <i className="fas fa-inr text-sm"></i>
                                        {orderDetails?.totalAmount}
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">DELIVERY DATE</td>
                                    <td scope="row">
                                      {date.format(
                                        new Date(
                                          orderDetails?.orderDeliveryDate
                                        ),
                                        "ddd, DD-MMM-YYYY"
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td scope="col">PAYMENT METHOD</td>
                                    <td scope="row">
                                      <span className="label label-success">
                                        {orderDetails.paymentMethod}
                                      </span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td scope="col">PAYMENT STATUS</td>

                                    <td scope="row">
                                      {orderDetails.paymentStatus ? (
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
                                    <td scope="col">ORDER STATUS</td>

                                    <td scope="row">
                                      {orderDetails.orderStatus ==
                                      "CANCELLED" ? (
                                        <span className="label label-danger">
                                          {orderDetails.orderStatus}
                                        </span>
                                      ) : (
                                        <span className="label label-success">
                                          {orderDetails.orderStatus}
                                        </span>
                                      )}
                                    </td>
                                  </tr>

                                  {orderDetails.orderStatus == "CANCELLED" ? (
                                    <tr>
                                      <td scope="col">CANCELLED BY</td>

                                      <td scope="row">
                                        <p>{orderDetails.cancelledBy}</p>
                                        <p>{orderDetails.cancelMessage}</p>
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

                  {/*Product Details */}
                  <div
                    className={`tab-pane fade show`}
                    id="product-details"
                    role="tabpanel"
                    aria-labelledby="product-details-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            <div className="row">
                              <div className={"col-md-12 table-responsive"}>
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>PRODUCT</th>
                                      <th>IMAGE</th>
                                      <th>QTY</th>
                                      <th>PRICE</th>
                                      <th>TOTAL</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {orderDetails?.products?.map(
                                      (product, index) => {
                                        return (
                                          <tr>
                                            <td> {++index} </td>
                                            <td>
                                              <h6> {product.name} </h6>
                                            </td>
                                            <td>
                                              <img
                                                className="m-auto"
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={`${product.image}`}
                                                alt=""
                                              />
                                            </td>

                                            <td> {product.quantity} </td>
                                            <td>
                                              <span className="fa fa-inr"></span>
                                              {product.price}
                                            </td>
                                            <td>
                                              <span className="fa fa-inr"></span>
                                              {product.quantity * product.price}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td colSpan={4}>
                                        Discount With Coupon
                                        {
                                          <span className="badge badge-success">
                                            {orderDetails?.coupon?.code || ""}
                                          </span>
                                        }
                                      </td>
                                      <td>
                                        <span className="fa fa-inr"></span>
                                        {orderDetails?.discountWithCoupon ||
                                          "0.00"}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td colSpan={4}>Delivery Charge</td>
                                      <td>
                                        {orderDetails?.shippingMethod?.amount ||
                                          "FREE"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={4}>Total Amount</td>
                                      <td>
                                        <span className="fa fa-inr"></span>
                                        {orderDetails?.totalAmount}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
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
                                                {orderDetails._id}
                                              </li>
                                              <li>
                                                <strong>Invoice Date:</strong> #
                                                {date.format(
                                                  new Date(
                                                    orderDetails.createdAt
                                                  ),
                                                  "ddd, DD-MMM-YYYY"
                                                )}
                                              </li>

                                              <li>
                                                <strong>
                                                  Order Delivery Date:
                                                </strong>
                                                #
                                                {date.format(
                                                  new Date(
                                                    orderDetails.orderDeliveryDate
                                                  ),
                                                  "ddd, DD-MMM-YYYY"
                                                )}
                                              </li>
                                              <li>
                                                <strong>Payment Mode:</strong>
                                                <span className="label label-info">
                                                  {orderDetails?.paymentMethod}
                                                </span>
                                              </li>
                                              <li>
                                                <strong>Payment Status:</strong>
                                                {orderDetails?.paymentStatus ? (
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
                                                orderDetails?.shippingAddress
                                                  ?.name
                                              }
                                            </li>
                                            <li>{`${orderDetails?.shippingAddress?.mobile}`}</li>
                                            <li>{`${orderDetails?.shippingAddress?.address}, ${orderDetails?.shippingAddress?.city}`}</li>
                                            <li>
                                              {`${orderDetails?.shippingAddress?.area?.name}, ${orderDetails?.shippingAddress?.pincode?.pincode}`}
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
                                                {orderDetails?.products?.map(
                                                  (product) => {
                                                    return (
                                                      <tr key={product._id}>
                                                        <td>{product?.name}</td>
                                                        <td className="text-center">
                                                          {product?.quantity}
                                                        </td>
                                                        <td className="text-center">
                                                          <i className="fa fa-inr"></i>
                                                          {product?.quantity *
                                                            product?.price}
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )}
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
                                                    {orderDetails.totalAmount}
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
                                                    {orderDetails.totalAmount}
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
                                              new Date(orderDetails?.createdAt),
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

                  {/* Order History */}
                  <div
                    className={`tab-pane fade show`}
                    id="order-history"
                    role="tabpanel"
                    aria-labelledby="order-history-tab"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        {/* Personal Details */}
                        <div className="card shadow-none border-0">
                          <div className="card-body">
                            {orderHistories.length ? (
                              <div className="table-responsive">
                                <table className="table table-striped">
                                  <thead>
                                    <tr>
                                      <th>#ID</th>
                                      <th>Status</th>
                                      <th>Message</th>
                                      <th>Payment</th>
                                      <th>Created By</th>
                                      <th>Created At</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {orderHistories.map((data, index) => {
                                      return (
                                        <tr key={index}>
                                          <td> # {++index} </td>

                                          <td>
                                            <span class="text-info">
                                              {data.orderStatus}
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
                                    })}
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
      </div>
    </div>
  );
}

export default OrderDetails;
