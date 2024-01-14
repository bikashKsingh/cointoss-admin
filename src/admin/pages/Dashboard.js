import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../AdminRouter";
import M from "materialize-css";
import { Link } from "react-router-dom";
import Config from "../../config/Config";
import date from "date-and-time";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const { state, dispatch } = useContext(AdminContext);

  // Top 10 Selling Products
  const [topSellingProducts, setTopSellingProducs] = useState([]);
  const [topSellingProductsLoading, setTopSellingProductsLoading] =
    useState(false);

  // Top 10 Cusomers
  const [topCustomers, setTopCustomers] = useState([]);
  const [topCustomersLoading, setTopCustomersLoading] = useState(true);

  // Total Orders
  const [totalOrdersLoading, setTotalOrdersLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  // Today Orders
  const [todayOrdersLoading, setTodayOrdersLoading] = useState(true);
  const [todayOrders, setTodayOrders] = useState(0);

  // Cancelled Orders
  const [totalCancelledOrderLoading, setTotalCancelledOrderLoading] =
    useState(true);
  const [totalCancelledOrder, setTotalCancelledOrder] = useState(0);

  // Returned Orders
  const [totalReturnedOrderLoading, setTotalReturnedOrderLoading] =
    useState(false);
  const [totalReturnedOrder, setTotalReturnedOrder] = useState(0);

  // Total Return Orders
  const [totalDeliveredOrderLoading, setTotalDeliveredOrderLoading] =
    useState(true);
  const [totalDeliveredOrder, setTotalDeliveredOrder] = useState(0);

  // All Users
  const [totalUsersLoading, setTotalUsersLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  // All Customers
  const [totalCustomersLoading, setTotalCustomersLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [orderReportsLoading, setOrderReportsLoading] = useState(true);

  const [allBatches, setTotalCategory] = useState([]);
  const [isAllBatchLoading, setIsTotalCategoryLoading] = useState(true);

  const [recComment, setRecCommment] = useState([]);

  // State for filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    return previous;
  }

  // // Getting Today Order data
  // useEffect(() => {
  //   fetch(
  //     `${Config.SERVER_URL}/order/report?startDate=${date.format(
  //       new Date(getPreviousDay()),
  //       "YYYY-MM-DD"
  //     )}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setTodayOrdersLoading(true);
  //         if (result.status == 200) {
  //           setTodayOrders(result.body.length || 0);
  //         } else {
  //           M.toast({ html: result.message, classes: "bg-danger" });
  //         }
  //       },
  //       (error) => {
  //         M.toast({ html: error, classes: "bg-danger" });
  //         setTodayOrdersLoading(true);
  //       }
  //     );
  // }, []);

  // // Getting Total Order data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/adminOrders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setTotalOrders(result.totalRecords || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setTotalOrdersLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalOrdersLoading(false);
        }
      );
  }, []);

  // // Getting Total Delivered Order data
  // useEffect(() => {
  //   fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=DELIVERED", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setTotalDeliveredOrderLoading(true);
  //         if (result.status == 200) {
  //           setTotalDeliveredOrder(result.body.length || 0);
  //         } else {
  //           M.toast({ html: result.message, classes: "bg-danger" });
  //         }
  //       },
  //       (error) => {
  //         M.toast({ html: error, classes: "bg-danger" });
  //         setTotalDeliveredOrderLoading(true);
  //       }
  //     );
  // }, []);

  // // Getting Total Cancelled Order data
  // useEffect(() => {
  //   fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=CANCELLED", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setTotalCancelledOrderLoading(true);
  //         if (result.status == 200) {
  //           setTotalCancelledOrder(result.body.length || 0);
  //         } else {
  //           M.toast({ html: result.message, classes: "bg-danger" });
  //         }
  //       },
  //       (error) => {
  //         M.toast({ html: error, classes: "bg-danger" });
  //         setTotalCancelledOrderLoading(true);
  //       }
  //     );
  // }, []);

  // // Getting Total Returned Order data
  // useEffect(() => {
  //   fetch(Config.SERVER_URL + "/order?limit=0&orderStatus=RETURNED", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setTotalReturnedOrderLoading(true);
  //         if (result.status == 200) {
  //           console.log("Returned Order", result.body);
  //           setTotalReturnedOrder(result.body.length || 0);
  //         } else {
  //           M.toast({ html: result.message, classes: "bg-danger" });
  //         }
  //       },
  //       (error) => {
  //         M.toast({ html: error, classes: "bg-danger" });
  //         setTotalReturnedOrderLoading(true);
  //       }
  //     );
  // }, []);

  // // Getting Total Users data
  useEffect(() => {
    fetch(Config.SERVER_URL + "/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 200) {
            setTotalUsers(result.totalRecords || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setTotalUsersLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setTotalUsersLoading(false);
        }
      );
  }, []);

  // // Getting Total Customers data
  // useEffect(() => {
  //   fetch(Config.SERVER_URL + "/customer/report?allCustomers=true", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setTotalCustomersLoading(true);
  //         if (result.status == 200) {
  //           setTotalCustomers(result.body.length || 0);
  //         } else {
  //           M.toast({ html: result.message, classes: "bg-danger" });
  //         }
  //       },
  //       (error) => {
  //         M.toast({ html: error, classes: "bg-danger" });
  //         setTotalCustomersLoading(true);
  //       }
  //     );
  // }, []);

  // // Generate Report For Top 10 Selling Products
  // useEffect(() => {
  //   setTopSellingProductsLoading(false);
  //   fetch(
  //     `${Config.SERVER_URL}/order/report?topProducts=true&startDate=${startDate}&endDate=${endDate}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setTopSellingProductsLoading(true);
  //         if (result.status == 200) {
  //           setTopSellingProducs(result.body);
  //           // topSellingProducts = [...result.body];
  //         } else {
  //           M.toast({ html: result.message, classes: "bg-danger" });
  //         }
  //       },
  //       (error) => {
  //         M.toast({ html: error, classes: "bg-danger" });
  //         setTopSellingProductsLoading(true);
  //       }
  //     );
  // }, [startDate, endDate]);

  // Generate Report For Top 10 Customers
  // useEffect(() => {
  //   setTopCustomersLoading(false);
  //   fetch(
  //     `${Config.SERVER_URL}/order/report?topCustomers=true&startDate=${startDate}&endDate=${endDate}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setTopCustomersLoading(true);
  //         if (result.status == 200) {
  //           setTopCustomers(result.body);
  //           // topSellingProducts = [...result.body];
  //         } else {
  //           M.toast({ html: result.message, classes: "bg-danger" });
  //         }
  //       },
  //       (error) => {
  //         M.toast({ html: error, classes: "bg-danger" });
  //         setTopCustomersLoading(true);
  //       }
  //     );
  // }, [startDate, endDate]);

  return (
    <div>
      <div className="page-wrapper px-0 pt-0">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Container fluid  --> */}
        {/* <!-- ============================================================== --> */}
        <div className="container-fluid">
          {/* <!-- ============================================================== --> */}
          {/* <!-- Bread crumb and right siLine toggle --> */}
          {/* <!-- ============================================================== --> */}
          <div className="row page-titles mb-0">
            <div className="col-md-5 col-8 align-self-center">
              <h3 className="text-themecolor">Dashboard</h3>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
          {/* <!-- End Bread crumb and right sidebar toggle --> */}

          {/* <!-- Card Section --> */}
          <div
            className={"row page-titles px-1 my-0 shadow-none"}
            style={{ background: "none" }}
          >
            <div className="col-md-12">
              <div className="d-flex justify-content-between">
                <h3 className="card-title mb-4">Stats Overview</h3>
              </div>
            </div>

            {/* Card Design */}
            <div className={"col-md-12"}>
              <div className={"row"}>
                {/* Total Users */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/admin/customers"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-account-multiple v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {!totalUsersLoading ? (
                              totalUsers || 0
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>Total Users</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Customers */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/admin/customers"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-account-circle v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalCustomersLoading ? (
                              totalCustomers || 0
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Customers
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Orders */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/admin/orders"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i className={"mdi mdi-truck v-big-icon text-info"} />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {!totalOrdersLoading ? (
                              totalOrders || 0
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>Total Orders</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Today Orders */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/admin/newOrders"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-truck-delivery v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {todayOrdersLoading ? (
                              todayOrders || 0
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>Today Orders</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Card Design */}
            <div className={"col-md-12"}>
              <div className={"row"}>
                {/* Total Cancelled Ordera */}
                <div className={"col-md-4"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/admin/orders?status=CANCELLED"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-car-connected v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalCancelledOrderLoading ? (
                              totalCancelledOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Cancelled Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Delivered Order */}
                <div className={"col-md-4"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/admin/orders?status=DELIVERED"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i className={"mdi mdi-car v-big-icon text-info"} />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalDeliveredOrderLoading ? (
                              totalDeliveredOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Delivered Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Total Returns Orders */}
                <div className={"col-md-4"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={"/admin/orders?status=RETURNED"}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i className={"mdi mdi-bus v-big-icon text-info"} />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {totalReturnedOrderLoading ? (
                              totalReturnedOrder
                            ) : (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            )}
                          </h2>
                          <span className={"text-info h6"}>
                            Total Returned Orders
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={"col-md-12"}>
              <div className={"row"}>
                <div className="col-md-12">
                  <div className="d-flex justify-content-between">
                    <h3 className="card-title mb-4">Graph Overview</h3>
                    <div className="d-flex">
                      <div className="">
                        <input
                          type="date"
                          onChange={(evt) => {
                            setStartDate(evt.target.value);
                          }}
                          className="form-control px-2"
                        />
                      </div>
                      <div className="pl-2">
                        <input
                          type="date"
                          onChange={(evt) => {
                            setEndDate(evt.target.value);
                          }}
                          className="form-control px-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top 10 Selling Products */}
                <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Selling Products</h4>
                        <Link
                          to={"/admin/report/products"}
                          className={"text-info"}
                        >
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topSellingProductsLoading ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart width={400} height={400}>
                          <Pie
                            dataKey="value"
                            isAnimationActive={false}
                            data={topSellingProducts}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#C70039"
                            label
                          />

                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div
                        className={"text-center"}
                        style={{ height: "300px", paddingTop: "150px" }}
                      >
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top 10 Customers */}
                <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Customers</h4>
                        <Link
                          to={"/admin/report/customers"}
                          className={"text-info"}
                        >
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topCustomersLoading ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          width={500}
                          height={300}
                          data={topCustomers}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                          {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div
                        className={"text-center"}
                        style={{ height: "300px", paddingTop: "150px" }}
                      >
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top 10 Parent Category */}
                {/* <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Category</h4>
                        <Link to={""} className={"text-info"}>
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topCustomersLoading ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          width={500}
                          height={300}
                          data={topCustomers}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className={"text-center"}>
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div> */}

                {/* Top 10 Child Category */}
                {/* <div className={"col-md-6"}>
                  <div className={"card border-0"}>
                    <div className={"card-body py-1"}>
                      <div className="d-flex justify-content-between py-2">
                        <h4 className="text-bold">Top 10 Child Category</h4>
                        <Link to={""} className={"text-info"}>
                          View Report
                        </Link>
                      </div>
                    </div>

                    {topCustomersLoading ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                          width={500}
                          height={400}
                          data={topCustomers}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className={"text-center"}>
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* <!-- Row --> */}
          {/* .............. */}
          {/* <!-- ============================================================== --> */}
        </div>
        {/* <!-- ============================================================== --> */}
        {/* <!-- End Container fluid  --> */}
        {/* <!-- footer --> */}
        {/* <!-- ============================================================== --> */}
        <footer className="footer">© 2021 Esta Global</footer>
        {/* <!-- ============================================================== --> */}
        {/* <!-- End footer --> */}
        {/* <!-- ============================================================== --> */}
      </div>
    </div>
  );
}

export default Dashboard;
