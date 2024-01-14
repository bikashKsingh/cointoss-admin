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
const BucketList = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const [isDeleteLaoded, setIsDeleteLaoded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [allBuckets, setAllBuckets] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");

  // Get Data From Database
  useEffect(() => {
    let url = `${Config.SERVER_URL}/buckets?page=${pagination.page}&limit=${pagination.limit}&status=${status}`;
    if (searchQuery) url += `&searchQuery=${searchQuery}`;
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
          if (result.status === 200) {
            setAllBuckets(result.body || []);
            setPagination({
              ...pagination,
              page: result.page,
              totalPages: result.totalPages,
              totalRecords: result.totalRecords,
            });
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setLoading(false);
        }
      );
  }, [pagination.page, pagination.limit, searchQuery, status]);

  const columns = useMemo(
    () => [
      {
        Header: "SN",
        accessor: "sn",
      },
      {
        Header: "NAME",
        accessor: "name",
      },
      {
        Header: "CATEGORY",
        accessor: "category",
      },
      {
        Header: "OCCASION",
        accessor: "occasion",
      },
      {
        Header: "PRICE",
        accessor: "price",
        Cell: ({ value: { sellingPrice, mrp } }) => {
          return (
            <>
              <p className="mrp">Rs {mrp}</p>

              <span className="text-success">Rs {sellingPrice}</span>
            </>
          );
        },
      },
      {
        Header: "IMAGE",
        accessor: "image",
        Cell: ({ value }) => {
          return value ? (
            <img
              src={value}
              style={{
                height: "70px",
                width: "70px",
                borderRadius: "35px",
              }}
            />
          ) : (
            "N/A"
          );
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
                  pathname: `/supervisor/bucket/details/${value}`,
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
    return allBuckets.map((data, index) => {
      return {
        sn: ++index,
        name: data.name,
        category: data?.category?.name || "N/A",
        occasion: data?.occasion?.name || "N/A",
        image: data?.image,
        price: { sellingPrice: data?.sellingPrice, mrp: data?.mrp },
        products: data._id,
        status: data.status,
        createdAt: data.createdAt,
        action: data._id,
      };
    });
  }, [allBuckets]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters, useSortBy, usePagination);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"BUCKETS"} pageTitle={"Bucket List"} />

        {/* End Bread crumb and right sidebar toggle */}
        <div
          className={"row page-titles px-1 my-0 shadow-none"}
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
                        placeholder="By Name"
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
                </div>
              </div>
            </div>

            {/* Data */}
            {!loading ? (
              <div className="card border-0 rounded m-0 py-1">
                {allBuckets.length ? (
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
                        csvFileName={"products"}
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
        </div>
      </div>
    </div>
  );
};

export default BucketList;
