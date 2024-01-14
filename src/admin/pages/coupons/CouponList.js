import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link } from "react-router-dom";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import DataTable from "../../components/DataTable";

//  Component Function
const CouponList = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const [isDeleteLaoded, setIsDeleteLaoded] = useState(true);
  const [isAllCouponLoding, setIsAllCouponLoding] = useState(true);
  const [allCoupons, setAllCoupons] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [searchQuery, setSearchQuery] = useState(undefined);
  const [status, setStatus] = useState("All");

  // Delete Submit Handler
  const deleteSubmitHandler = () => {
    setIsDeleted(false);
    setIsDeleteLaoded(false);

    fetch(`${Config.SERVER_URL}/coupons/${deleteId}`, {
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
    let url = `${Config.SERVER_URL}/coupons?page=${pagination.page}&limit=${pagination.limit}&status=${status}`;
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
            setAllCoupons(result.body || []);
            setPagination({
              ...pagination,
              page: result.page,
              totalPages: result.totalPages,
              totalRecords: result.totalRecords,
            });
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsAllCouponLoding(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllCouponLoding(false);
        }
      );
  }, [pagination.page, pagination.limit, isDeleted, searchQuery, status]);

  const columns = useMemo(
    () => [
      {
        Header: "SN",
        accessor: "sn",
      },
      {
        Header: "CODE",
        accessor: "couponCode",
      },
      {
        Header: "CATEGORY",
        accessor: "category",
      },
      {
        Header: "SUB CATEGORY",
        accessor: "subCategory",
      },
      {
        Header: "VALIDITY",
        accessor: "validity",
        Cell: ({ value: { startDate, expiryDate } }) => {
          return `${date.format(
            new Date(startDate),
            "DD-MM-YYYY"
          )} to ${date.format(new Date(expiryDate), "DD-MM-YYYY")}`;
        },
      },
      {
        Header: "USES TIMES",
        accessor: "numberOfUsesTimes",
      },
      {
        Header: "USER TYPE",
        accessor: "applyFor",
      },
      {
        Header: "CREATED AT",
        accessor: "createdAt",
        Cell: ({ value }) => {
          return date.format(new Date(value), "DD-MM-YYYY");
        },
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
        Header: "ACTION",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <>
              <Link
                className="ml-2 btn btn-info footable-edit rounded"
                to={{
                  pathname: `/admin/coupon/edit/${value}`,
                }}
              >
                <span className="fas fa-pencil-alt" aria-hidden="true"></span>
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
    return allCoupons.map((data, index) => {
      let category = "N/A";
      if (data.categories.length) {
        category = `${data?.categories[0]["name"]}`;
        if (data.categories.length > 1) {
          category = `${category} and ${data.categories.length - 1} more`;
        }
      }

      let subCategory = "N/A";
      if (data.subCategories.length) {
        subCategory = `${data?.subCategories[0]["name"]}`;
        if (data.subCategories.length > 1) {
          subCategory = `${subCategory} and ${
            data.subCategories.length - 1
          } more`;
        }
      }

      return {
        sn: ++index,
        couponCode: data.couponCode,
        validity: { startDate: data.startDate, expiryDate: data.expiryDate },
        numberOfUsesTimes: data.numberOfUsesTimes,
        applyFor: data.applyFor,
        createdAt: data.createdAt,
        status: data.status,
        action: data._id,
        category: category,
        subCategory: subCategory,
      };
    });
  }, [allCoupons]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters, useSortBy, usePagination);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb
          title={"COUPON LISTS"}
          pageTitle={"Coupon List"}
          pageLink={"/admin/coupons"}
        />

        {/* End Bread crumb and right sidebar toggle */}
        <div
          className={"row page-titles px-1 my-0 shadow-none px-0 pt-0"}
          style={{ background: "none" }}
        >
          <div className={"col-md-12 px-0"}>
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
                        placeholder="By Code/User Type"
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
                        <option value={true}>STATUS</option>
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
                        pathname: "/admin/coupon/addByCSV",
                      }}
                    >
                      <span className={"fas fa-file"}></span> Add By CSV
                    </Link>

                    <Link
                      className="btn btn-info rounded mr-2"
                      to={{
                        pathname: "/admin/coupon/editByCSV",
                      }}
                    >
                      <span className={"fas fa-edit"}></span> Update By CSV
                    </Link>

                    <Link
                      className="btn btn-info rounded mr-2"
                      to={{
                        pathname: "/admin/coupon/add",
                      }}
                    >
                      <span className={"fas fa-plus"}></span> Coupon
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Data */}
            {!isAllCouponLoding ? (
              <div className="card border-0 rounded m-0 py-1">
                {allCoupons.length ? (
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
                        csvFileName={"coupons"}
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
                <Spinner />
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

export default CouponList;
