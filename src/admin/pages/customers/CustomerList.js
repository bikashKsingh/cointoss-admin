import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link } from "react-router-dom";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Pagination from "../../components/Pagination";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import DataTable from "../../components/DataTable";
//  Component Function
const CustomerList = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const [isDeleteLaoded, setIsDeleteLaoded] = useState(true);
  const [isAllCustomersLoding, setIsAllCustomersLoding] = useState(true);
  const [allCustomers, setAllCustomers] = useState([]);

  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [isVerified, setIsVerified] = useState("All");

  // Delete Submit Handler
  const deleteSubmitHandler = () => {
    setIsDeleted(false);
    setIsDeleteLaoded(false);

    fetch(`${Config.SERVER_URL}/customers/${deleteId}`, {
      method: "DELETE",
      // body: JSON.stringify({deleteId}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsDeleteLaoded(true);
          if (result.status == 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            setIsDeleted(true);
            setDeleteId("");
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          $("#closeDeleteModalButton").click();
        },
        (error) => {
          setIsDeleteLaoded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // Get Data From Database
  useEffect(() => {
    let url = `${Config.SERVER_URL}/customers?page=${pagination.page}&limit=${pagination.limit}&status=${status}`;
    if (searchQuery) url += `&searchQuery=${searchQuery}`;
    if (isVerified) url += `&isVerified=${isVerified}`;
    fetch(url, {
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
            setAllCustomers(result.body || []);
            setPagination({
              ...pagination,
              page: result.page,
              totalPages: result.totalPages,
              totalRecords: result.totalRecords,
            });
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsAllCustomersLoding(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllCustomersLoding(false);
        }
      );
  }, [
    pagination.page,
    pagination.limit,
    isDeleted,
    searchQuery,
    status,
    isVerified,
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "SN",
        accessor: "sn",
      },
      {
        Header: "FIRST NAME",
        accessor: "firstName",
      },
      {
        Header: "LAST NAME",
        accessor: "lastName",
      },
      {
        Header: "EMAIL",
        accessor: "email",
      },
      {
        Header: "MOBILE",
        accessor: "mobile",
      },
      {
        Header: "VERIFIED",
        accessor: "isVerified",
        Cell: ({ value }) => {
          return value == true ? "Verified" : "Not Verified";
        },
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }) => {
          return value == true ? "Active" : "Disabled";
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
                  pathname: `/admin/customer/edit/${value}`,
                }}
              >
                <span className="fas fa-pencil-alt" aria-hidden="true"></span>
              </Link>

              <Link
                className="ml-2 btn btn-warning footable-edit rounded"
                to={{
                  pathname: `/admin/customer/details/${value}`,
                }}
                title="details"
              >
                <span className="fas fa-eye" aria-hidden="true"></span>
              </Link>

              <button
                type="button"
                className="ml-2 btn btn-danger footable-delete rounded"
                data-toggle="modal"
                data-target="#deleteModal"
                onClick={(e) => {
                  setDeleteId(value);
                }}
              >
                <span className="fas fa-trash-alt" aria-hidden="true"></span>
              </button>
            </>
          );
        },
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return allCustomers.map((data, index) => {
      return {
        sn: ++index,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        isVerified: data.isVerified,
        pincode: data?.pincode?.pincode,
        createdAt: data.createdAt,
        status: data.status,
        action: data._id,
      };
    });
  }, [allCustomers]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters, useSortBy, usePagination);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"USER LIST"} pageTitle={"User List"} />
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
                  <div className="d-flex">
                    <h4 className="mt-2 mr-2">Search: </h4>
                    <div className="border px-2">
                      <input
                        type="search"
                        onChange={(evt) => {
                          setSearchQuery(evt.target.value);
                        }}
                        placeholder="By Name/Email/Mobile"
                        className="form-control"
                      />
                    </div>
                    <div className="border px-2 ml-2">
                      <select
                        name=""
                        id=""
                        className="form-control"
                        value={status}
                        onChange={(evt) => {
                          setStatus(evt.target.value);
                        }}
                      >
                        <option value={``} selected disabled>
                          USER STATUS
                        </option>
                        <option value={true}>ACTIVE</option>
                        <option value={false}>DISABLED</option>
                        <option value={`All`}>ALL</option>
                      </select>
                    </div>

                    <div className="border px-2 ml-2">
                      <select
                        name=""
                        id=""
                        className="form-control"
                        value={isVerified}
                        onChange={(evt) => {
                          setIsVerified(evt.target.value);
                        }}
                      >
                        <option selected disabled value={``}>
                          VERIFICATION STATUS
                        </option>
                        <option value={true}>VERIFIED</option>
                        <option value={false}>NOT VERIFIED</option>
                        <option value={"All"}>ALL</option>
                      </select>
                    </div>
                  </div>

                  <div className=""></div>
                </div>
              </div>
            </div>

            {/* Data */}
            {!isAllCustomersLoding ? (
              <div className="card border-0 rounded m-0 py-1">
                {allCustomers.length ? (
                  <div className="card-body py-0">
                    <div className="table-responsive">
                      {/* Data Table */}
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
                        csvFileName={"customers"}
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

          {/* -- Delete Modal -- */}
          <div
            className="modal fade rounded"
            id="deleteModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="updateModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content rounded">
                <div className="modal-body text-center">
                  <img
                    style={{ width: "150px" }}
                    className={"img img-fluid"}
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ5R1g82DqzH4itsxpVCofNGWbAzKN_PJDBew&usqp=CAU"
                    }
                  />
                  <h4 className={"text-center mt-2"}>Do You Want to Delete?</h4>

                  <div className={"form-group"}>
                    <button
                      className="btn btn-danger rounded px-3"
                      type={"submit"}
                      onClick={deleteSubmitHandler}
                    >
                      {isDeleteLaoded ? (
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
                      )}
                    </button>
                    <button
                      className="btn btn-secondary rounded ml-2 px-3"
                      data-dismiss="modal"
                      id={"closeDeleteModalButton"}
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
    </div>
  );
};

export default CustomerList;
