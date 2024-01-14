import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link, useHistory } from "react-router-dom";
import Config from "../../../config/Config";
import date from "date-and-time";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Breadcrumb from "../../components/Breadcrumb";
import { convertDeliveryDay } from "../../helpers";
import Pagination from "../../components/Pagination";

// Component Function
const SubscriptionForDelivery = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const history = useHistory();
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  const query = new URLSearchParams(history.location.search);
  const status = query.get("status");
  const [subscriptionStatus, setSubscriptionStatus] = useState(status || "ALL");
  const [filterFormDtata, setFilterFormDtata] = useState({
    deliveryDate: date.format(new Date(), "YYYY-MM-DD"),
  });
  const [useFilter, setUseFilter] = useState(false);
  const [subscriptionDetailsForDelivery, setSubscriptionDetailsForDelivery] =
    useState(null);

  const submitHandler = async () => {
    fetch(`${Config.SERVER_URL}/supervisorDeliveryDetails`, {
      method: "POST",
      body: JSON.stringify({
        customer: subscriptionDetailsForDelivery?.customer?._id,
        subscription: subscriptionDetailsForDelivery._id,
        deliveryDate: filterFormDtata.deliveryDate,
        deliveryStatus: subscriptionDetailsForDelivery?.deliveryStatus,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_supervisor_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // setIsDeleteLaoded(true);
          if (result.status == 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            setIsUpdated(true);
            // setDeleteId("");
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          $("#closeConfirmModalButton").click();
        },
        (error) => {
          // setIsDeleteLaoded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );

    $("#closeConfirmModalButton").click();
  };

  // Get Data From Database
  useEffect(() => {
    setAllDataLoaded(false);
    let url = `${Config.SERVER_URL}/supervisorSubscriptions/getAllSubscriptionsForDelivery?page=${pagination.page}&limit=${pagination.limit}`;
    if (subscriptionStatus !== "ALL") {
      url = url + `&subscriptionStatus=${subscriptionStatus}`;
    }
    if (filterFormDtata.deliveryDate)
      url = url + `&deliveryDate=${filterFormDtata.deliveryDate}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_supervisor_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setAllDataLoaded(true);
          if (result.status === 200) {
            setAllData(result.body || []);
            setPagination({
              ...pagination,
              page: result.page,
              totalPages: result.totalPages,
              totalRecords: result.totalRecords,
            });
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setAllDataLoaded(true);
        }
      );
  }, [pagination.page, pagination.limit, isUpdated, useFilter]);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb
          title={"SUBSCRIPTION FOR DELIVERY"}
          pageTitle={"Subscription Lists"}
        />

        {/* End Bread crumb and right sidebar toggle */}
        <div
          className={"row page-titles px-1 my-0 shadow-none"}
          style={{ background: "none" }}
        >
          <div className={"col-md-12 px-0"}>
            {/* Heading */}
            <div className={"card mb-0 mt-2 border-0 rounded"}>
              <div className={"card-body pb-0 pt-2"}>
                <div className="d-flex justify-content-between">
                  {/* <h4 className="float-left mt-2 mr-2">Search: </h4> */}

                  <div className="form-inline d-flex" style={{ gap: "10px" }}>
                    {/* <select
                      className="form-control shadow-sm rounded"
                      onChange={(evt) => {
                        setSubscriptionStatus(evt.target.value);
                        history.push(
                          "/supervisor/subscriptions?status=" + evt.target.value
                        );
                      }}
                      value={subscriptionStatus}
                    >
                      <option value="ALL">ALL</option>
                      <option value="ORDERPLACED">ORDERPLACED</option>
                      <option value="RENEWAL">RENEWAL</option>
                      <option value="RUNNING">RUNNING</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select> */}

                    <input
                      type="date"
                      placeholder="Start Date"
                      className="form-control bg-light p-1"
                      value={filterFormDtata.deliveryDate}
                      onChange={(event) => {
                        setFilterFormDtata({
                          ...filterFormDtata,
                          deliveryDate: event.target.value,
                        });
                      }}
                    />

                    <button
                      className="btn btn-info"
                      onClick={() => {
                        setUseFilter(!useFilter);
                      }}
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Data */}
            {allDataLoaded ? (
              <div className="card border-0 rounded m-0 py-1">
                {allData.length ? (
                  <div className="card-body py-0">
                    <div className="table-responsive">
                      <table
                        id={"table-to-xls"}
                        className={"table table-bordered table-striped my-0"}
                      >
                        <thead>
                          <tr>
                            <th>SN</th>
                            <th>SUBSCRIPTION DETAILS</th>
                            <th>BUCKET NAME</th>
                            <th>SUBSCRIPTION DATE</th>
                            <th>DELIVERY STATUS</th>
                            <th className="text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allData.map((subscription, index) => {
                            let isDelivered;
                            let deliveryDetails = {};

                            if (subscription.deliveryDetails) {
                              let filterData =
                                subscription.deliveryDetails.filter((value) => {
                                  return (
                                    date.format(
                                      new Date(value.deliveryDate),
                                      "YYYY-MM-DD"
                                    ) == filterFormDtata.deliveryDate
                                  );
                                });
                              if (filterData.length)
                                deliveryDetails = filterData[0];
                            }

                            return (
                              <tr key={index}>
                                <td>{++index}</td>

                                <td>
                                  <p>ID: {subscription._id}</p>
                                  <p>{subscription?.customer?.firstName}</p>

                                  <p>
                                    <a
                                      href={`tel:${subscription?.customer?.mobile}`}
                                    >
                                      {subscription?.customer?.mobile}
                                    </a>
                                  </p>
                                </td>
                                <td>
                                  {subscription?.bucketDetails?.bucketName}
                                </td>

                                <td>
                                  <p>
                                    Start :{" "}
                                    {convertDeliveryDay(
                                      subscription?.subscriptionStartDate
                                    )}
                                  </p>
                                  <p>
                                    Expire :{" "}
                                    {convertDeliveryDay(
                                      subscription?.subscriptionExpiryDate
                                    )}
                                  </p>
                                </td>
                                <td>
                                  {deliveryDetails.deliveryStatus ==
                                  "DELIVERED" ? (
                                    <span className="badge badge-success">
                                      DELIVERED
                                    </span>
                                  ) : deliveryDetails.deliveryStatus ==
                                    "SKIPPED" ? (
                                    <span className="badge badge-success">
                                      SKIPPED
                                    </span>
                                  ) : deliveryDetails.deliveryStatus ==
                                    "CANCELLED" ? (
                                    <span className="badge badge-success">
                                      CANCELLED
                                    </span>
                                  ) : (
                                    <span className="badge badge-warning">
                                      PENDING
                                    </span>
                                  )}
                                </td>

                                <td className="text-center">
                                  {/* Details Button */}
                                  <Link
                                    title="Subscription Details"
                                    className="ml-2 btn btn-info rounded"
                                    to={{
                                      pathname: `/supervisor/subscription/details/${subscription._id}`,
                                    }}
                                  >
                                    Details
                                  </Link>

                                  {/* Delivered Button */}
                                  {!deliveryDetails.deliveryStatus ? (
                                    <>
                                      {/* Delivery Button */}
                                      <button
                                        title="Delivery"
                                        type="button"
                                        className="ml-2 btn btn-success rounded"
                                        data-toggle="modal"
                                        data-target="#confirmationModal"
                                        onClick={(e) => {
                                          setSubscriptionDetailsForDelivery({
                                            ...subscription,
                                            deliveryStatus: "DELIVERED",
                                          });
                                        }}
                                      >
                                        Deliver
                                      </button>

                                      {/* Skip Button */}
                                      <button
                                        title="Skip Delivery"
                                        type="button"
                                        className="ml-2 btn btn-primary rounded"
                                        data-toggle="modal"
                                        data-target="#confirmationModal"
                                        onClick={(e) => {
                                          setSubscriptionDetailsForDelivery({
                                            ...subscription,
                                            deliveryStatus: "SKIPPED",
                                          });
                                        }}
                                      >
                                        Skip
                                      </button>

                                      {/* Cancel Button */}
                                      <button
                                        title="Skip Delivery"
                                        type="button"
                                        className="ml-2 btn btn-danger rounded"
                                        data-toggle="modal"
                                        data-target="#confirmationModal"
                                        onClick={(e) => {
                                          setSubscriptionDetailsForDelivery({
                                            ...subscription,
                                            deliveryStatus: "CANCELLED",
                                          });
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : null}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {/* Pagination */}
                      <Pagination
                        pagination={pagination}
                        setPagination={setPagination}
                        tableName="table-to-xls"
                        csvFileName="pincodes"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={"alert alert-danger mx-3 rounded border-0 py-2"}
                  >
                    No Data Available
                  </div>
                )}
              </div>
            ) : (
              <div className={"bg-white p-3 text-center"}>
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading..
              </div>
            )}
          </div>
        </div>
      </div>

      {/* -- Modal Designing -- */}
      <div>
        {/* -- Delete Modal -- */}
        <div
          className="modal fade rounded"
          id="confirmationModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="updateModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded">
              <div className="modal-body text-center">
                <i
                  className="fa fa-check-circle"
                  style={{ fontSize: "100px", color: "green" }}
                ></i>
                <h4 className={"text-center mt-2"}>
                  Do You Want to
                  {subscriptionDetailsForDelivery?.deliveryStatus == "DELIVERED"
                    ? " Deliver"
                    : subscriptionDetailsForDelivery?.deliveryStatus ==
                      "SKIPPED"
                    ? " Skip"
                    : " Cancel"}
                  ?
                </h4>

                <div className={"form-group py-4"}>
                  <button
                    className="btn btn-success rounded px-3"
                    type={"submit"}
                    onClick={submitHandler}
                  >
                    <div>
                      <i className="fas fa-check"></i> Yes
                    </div>
                    {/* {isDeleteLaoded ? (
                      <div>
                        <i className="fas fa-trash"></i> Yes
                      </div>
                    ) : (
                      <div>
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading..
                      </div>
                    )} */}
                  </button>
                  <button
                    className="btn btn-secondary rounded ml-2 px-3"
                    data-dismiss="modal"
                    id={"closeConfirmModalButton"}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForDelivery;
