import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link } from "react-router-dom";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import date from "date-and-time";
//  Component Function
const NewsletterList = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const [isDeleteLaoded, setIsDeleteLaoded] = useState(true);
  const [isEmailLoading, setIsEmailLoading] = useState(true);
  const [allEmails, setAllEmails] = useState([]);

  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");

  // Delete Submit Handler
  const deleteSubmitHandler = () => {
    setIsDeleted(false);
    setIsDeleteLaoded(false);

    fetch(`${Config.SERVER_URL}/newsletters/${deleteId}`, {
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
    let url = `${Config.SERVER_URL}/newsletters?page=${pagination.page}&limit=${pagination.limit}&status=${status}`;
    if (searchQuery) url += `&searchQuery=${searchQuery}`;
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
            setAllEmails(result.body || []);
            setPagination({
              ...pagination,
              page: result.page,
              totalPages: result.totalPages,
              totalRecords: result.totalRecords,
            });
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsEmailLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsEmailLoading(false);
        }
      );
  }, [pagination.limit, pagination.page, isDeleted, searchQuery, status]);

  const columns = useMemo(
    () => [
      {
        Header: "SN",
        accessor: "sn",
      },
      {
        Header: "EMAIL",
        accessor: "email",
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }) => {
          return (
            <>
              {value === true ? (
                <span className="badge badge-success">Active</span>
              ) : (
                <span className="badge badge-danger">Disabled</span>
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
                  pathname: `/admin/newsletter/edit/${value}`,
                }}
              >
                <span className="fas fa-pencil-alt" aria-hidden="true"></span>
              </Link>

              {/* <Link
                className="ml-2 btn btn-warning footable-edit rounded"
                to={{
                  pathname: `/admin/newsletter/edit/${value}`,
                }}
                title="Send Email"
              >
                <span className="fas fa-envelope" aria-hidden="true"></span>
              </Link> */}

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
    return allEmails.map((data, index) => {
      return {
        sn: ++index,
        email: data.email,
        status: data.status,
        createdAt: data.createdAt,
        action: data._id,
      };
    });
  }, [allEmails]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters, useSortBy, usePagination);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"NEWSLETTESR"} pageTitle={"Email List"} />
        {/* End Bread crumb and right sidebar toggle */}

        <div
          className={"row page-titles px-1 my-0 shadow-none"}
          style={{ background: "none" }}
        >
          <div className={"col-md-12 px-0 mt-0"}>
            {/* Heading */}
            <div className={"card mb-0 mt-2 border-0 rounded"}>
              <div className={"card-body pb-0 pt-2"}>
                <div className="row">
                  <div className="d-flex col-md-6">
                    <h4 className="mt-2 mr-2">Search: </h4>
                    <div className="border px-2">
                      <input
                        type="search"
                        onChange={(evt) => {
                          setSearchQuery(evt.target.value);
                        }}
                        placeholder="Email"
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
                          SELECT STATUS
                        </option>
                        <option value={true}>ACTIVE</option>
                        <option value={false}>DISABLED</option>
                        <option value={`All`}>ALL</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 text-right">
                    <Link
                      className="btn btn-info rounded mr-2"
                      to={{
                        pathname: "/admin/newsletter/addByCSV",
                      }}
                    >
                      <span className={"fas fa-file"}></span> Add By CSV
                    </Link>

                    <Link
                      className="btn btn-info rounded mr-2"
                      to={{
                        pathname: "/admin/newsletter/editByCSV",
                      }}
                    >
                      <span className={"fas fa-edit"}></span> Update By CSV
                    </Link>

                    <Link
                      to={"/admin/newsletter/add"}
                      className={"btn btn-info "}
                    >
                      <span className={"fas fa-plus"}></span> Email
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Data */}
            {isEmailLoading ? (
              <div className={"bg-white p-3 text-center"}>
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading..
              </div>
            ) : (
              <div className="card border-0 rounded m-0 py-1">
                {allEmails.length ? (
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
                        csvFileName={"newsletter-emails"}
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

export default NewsletterList;
