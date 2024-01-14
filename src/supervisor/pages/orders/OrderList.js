import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link, useHistory } from "react-router-dom";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Pagination from "../../components/Pagination";
// Component Function
const OrderList = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const history = useHistory();
  const [isAllOrdersLoaded, setIsAllOrdersLoaded] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  const query = new URLSearchParams(history.location.search);
  const status = query.get("status");
  const startDate = query.get("startDate");
  const [filterFormData, setFilterFormData] = useState({
    orderStatus: "All",
  });
  const [useFilter, setUseFilter] = useState(false);
  useEffect(() => {
    if (startDate == "new") {
      const today = date.format(new Date(), "YYYY-MM-DD");
      setFilterFormData({ ...filterFormData, startDate: today });
      setUseFilter(!useFilter);
    } else {
      setFilterFormData({ ...filterFormData, startDate: "" });
      setUseFilter(!useFilter);
    }
  }, [startDate]);

  // Get Data From Database
  useEffect(() => {
    setIsAllOrdersLoaded(false);
    let url = `${Config.SERVER_URL}/supervisorOrders?page=${pagination.page}&limit=${pagination.limit}`;
    if (filterFormData.orderStatus !== "ALL") {
      url = url + `&orderStatus=${filterFormData.orderStatus}`;
    }
    if (filterFormData.startDate) {
      url = url + `&startDate=${filterFormData.startDate}`;
    }
    if (filterFormData.endDate) {
      url = url + `&endDate=${filterFormData.endDate}`;
    }
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
          setIsAllOrdersLoaded(true);
          if (result.status === 200) {
            setAllOrders(result.body || []);
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
          setIsAllOrdersLoaded(true);
        }
      );
  }, [pagination.page, pagination.limit, useFilter]);

  console.log(pagination);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"ORDERS"} pageTitle={"Odrer Lists"} />

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
                    <select
                      className="form-control shadow-sm rounded"
                      onChange={(evt) => {
                        setFilterFormData({
                          ...filterFormData,
                          orderStatus: evt.target.value,
                        });
                        history.push(
                          "/admin/orders?status=" + evt.target.value
                        );
                      }}
                      value={filterFormData.orderStatus}
                    >
                      <option value="ALL">ALL</option>
                      <option value="ORDERPLACED">ORDERPLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>

                    <input
                      type="date"
                      placeholder="Start Date"
                      className="form-control bg-light p-1"
                      onChange={(event) => {
                        setFilterFormData({
                          ...filterFormData,
                          startDate: event.target.value,
                        });
                      }}
                      value={filterFormData.startDate}
                    />
                    <input
                      type="date"
                      className="form-control bg-light p-3"
                      onChange={(event) => {
                        setFilterFormData({
                          ...filterFormData,
                          endDate: event.target.value,
                        });
                      }}
                      value={filterFormData.endDate}
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
            {isAllOrdersLoaded ? (
              <div className="card border-0 rounded m-0 py-1">
                {allOrders.length ? (
                  <div className="card-body py-0">
                    <div className="table-responsive">
                      <table
                        id={"table-to-xls"}
                        className={"table table-bordered table-striped my-0"}
                      >
                        <thead>
                          <tr>
                            <th>SN</th>
                            <th>ORDER ID</th>
                            <th>CUSTOMER DETAILS</th>
                            <th>PRODUCTS</th>
                            <th>ORDER AMOUNT</th>
                            <th>DELIVERY DATE</th>
                            <th>CREATED AT</th>
                            <th>STATUS</th>
                            <th className="text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allOrders.map((order, index) => {
                            return (
                              <tr key={index}>
                                <td>{++index}</td>
                                <td>{order._id}</td>
                                <td>
                                  <p>{order.customer.firstName}</p>
                                  <p>
                                    <a href={`mailto:${order.customer.email}`}>
                                      {order.customer.email}
                                    </a>
                                  </p>
                                  <p>
                                    <a href={`tel:${order.customer.mobile}`}>
                                      {order.customer.mobile}
                                    </a>
                                  </p>
                                </td>
                                <td>
                                  {`${order?.products[0]?.name}  ${
                                    order?.products?.length > 1
                                      ? "+" +
                                        order?.products?.length -
                                        1 +
                                        " Items"
                                      : ""
                                  }`}
                                </td>
                                <td>
                                  <i className="fa fa-inr"></i>
                                  {order?.totalAmount}
                                </td>
                                <td>
                                  {date.format(
                                    new Date(order.orderDeliveryDate),
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>
                                  {date.format(
                                    new Date(order.createdAt),
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>{order.orderStatus}</td>
                                <td>
                                  {/* View Button */}
                                  <Link
                                    className="ml-2 btn btn-info footable-edit rounded"
                                    to={{
                                      pathname: `/supervisor/order/details/${order._id}`,
                                    }}
                                  >
                                    <span
                                      className="fas fa-eye"
                                      aria-hidden="true"
                                    ></span>
                                  </Link>
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
                        csvFileName="orders"
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
    </div>
  );
};

export default OrderList;
