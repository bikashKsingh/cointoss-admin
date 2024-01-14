import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import { Link, useHistory } from "react-router-dom";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import { convertDeliveryDay } from "../../helpers";
import Pagination from "../../components/Pagination";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import DataTable from "../../components/DataTable";

// Component Function
const SubscriptionsList = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const history = useHistory();
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [allData, setAllData] = useState([]);

  const query = new URLSearchParams(history.location.search);
  const status = query.get("status");
  const startDate = query.get("startDate");

  const [filterFormData, setFilterFormData] = useState({
    subscriptionStatus: "All",
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
    setAllDataLoaded(false);
    let url = `${Config.SERVER_URL}/supervisorSubscriptions?page=${pagination.page}&limit=${pagination.limit}`;
    if (filterFormData.subscriptionStatus !== "ALL") {
      url = url + `&subscriptionStatus=${filterFormData.subscriptionStatus}`;
    }
    if (filterFormData.startDate)
      url = url + `&startDate=${filterFormData.startDate}`;
    if (filterFormData.endDate)
      url = url + `&endDate=${filterFormData.endDate}`;

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
  }, [pagination.page, pagination.limit, useFilter]);

  const columns = useMemo(
    () => [
      {
        Header: "SN",
        accessor: "sn",
      },
      {
        Header: "CUSTOMER DETAILS",
        accessor: "customer",
        Cell: ({ value: customer }) => {
          return (
            <>
              <p>{customer?.firstName}</p>
              <p>
                <a href={`mailto:${customer?.email}`}>{customer?.email}</a>
              </p>
              <p>
                <a href={`tel:${customer?.mobile}`}>{customer?.mobile}</a>
              </p>
            </>
          );
        },
      },
      {
        Header: "BUCKET NAME",
        accessor: "bucket",
      },
      {
        Header: "SUBSCRIPTION START",
        accessor: "subscriptionStartDate",
      },
      {
        Header: "SUBSCRIPTION END",
        accessor: "subscriptionExpiryDate",
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }) => {
          return (
            <>
              {value === "ORDERPLACED" ? (
                <span className="badge badge-primary">{value}</span>
              ) : value === "RUNNING" ? (
                <span className="badge badge-info">{value}</span>
              ) : value === "DELIVERED" ? (
                <span className="badge badge-success">{value}</span>
              ) : value === "CANCELLED" ? (
                <span className="badge badge-danger">{value}</span>
              ) : value === "EXPIRED" ? (
                <span className="badge badge-danger">{value}</span>
              ) : (
                ""
              )}
            </>
          );
        },
      },
      {
        Header: "CREATED AT",
        accessor: "createdAt",
        Cell: ({ value }) => {
          return date.format(new Date(value), "DD-MM-YYYY");
        },
      },

      {
        Header: "ACTION",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <>
              <Link
                className="ml-2 btn btn-info footable-edit rounded"
                to={{
                  pathname: `/supervisor/subscription/details/${value}`,
                }}
              >
                <span className="fas fa-eye" aria-hidden="true"></span>
              </Link>
            </>
          );
        },
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return allData.map((data, index) => {
      return {
        sn: ++index,
        customer: data.customer,
        bucket: data?.bucketDetails?.bucketName,
        subscriptionStartDate: convertDeliveryDay(data?.subscriptionStartDate),
        subscriptionExpiryDate: convertDeliveryDay(
          data?.subscriptionExpiryDate
        ),
        createdAt: data.createdAt,
        status: data.subscriptionStatus,
        action: data._id,
      };
    });
  }, [allData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters, useSortBy, usePagination);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"SUBSCRIPTION"} pageTitle={"Subscription Lists"} />

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
                          subscriptionStatus: evt.target.value,
                        });
                        history.push(
                          "/supervisor/subscriptions?status=" + evt.target.value
                        );
                      }}
                      value={filterFormData.subscriptionStatus}
                    >
                      .subscriptionStatus.sub.subscriptionStatus
                      <option value="ALL">ALL</option>
                      <option value="ORDERPLACED">ORDERPLACED</option>
                      <option value="RENEWAL">RENEWAL</option>
                      <option value="RUNNING">RUNNING</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="CANCELLED">CANCELLED</option>
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
            {allDataLoaded ? (
              <div className="card border-0 rounded m-0 py-1">
                {allData.length ? (
                  <div className="card-body py-0">
                    <div className="table-responsive">
                      {/* Data Tables */}
                      <DataTable
                        getTableBodyProps={getTableProps}
                        getTableProps={getTableProps}
                        headerGroups={headerGroups}
                        rows={rows}
                        prepareRow={prepareRow}
                      />
                      {/* Pagination */}
                      <Pagination
                        pagination={pagination}
                        setPagination={setPagination}
                        tableName={"table-to-xls"}
                        csvFileName={"subscriptions"}
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

export default SubscriptionsList;
