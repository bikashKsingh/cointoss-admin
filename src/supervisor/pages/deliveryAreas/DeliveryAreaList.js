import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import Config from "../../../config/Config";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Pagination from "../../components/Pagination";
import DataTable from "../../components/DataTable";

// Component Function
const DeliveryAreaList = (props) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const [dataLoaded, setDataLoaded] = useState(false);
  const [allDeliveryAreas, setAllDeliveryAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");

  // Get Data From Database
  useEffect(() => {
    setDataLoaded(false);
    let url = `${Config.SERVER_URL}/supervisorAreas?page=${pagination.page}&limit=${pagination.limit}`;
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
          setDataLoaded(true);
          if (result.status === 200) {
            setAllDeliveryAreas(result?.body || []);
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
          setDataLoaded(true);
        }
      );
  }, [pagination.skip, pagination.limit, searchQuery, status]);

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
        Header: "PINCODE",
        accessor: "pincode",
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return allDeliveryAreas.map((data, index) => {
      return {
        sn: ++index,
        name: data.name,
        pincode: data?.pincode?.pincode,
      };
    });
  }, [allDeliveryAreas]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters, useSortBy, usePagination);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"DELIVERY AREAS"} pageTitle={"Delivery Area List"} />

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
                        placeholder="Area Name"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data */}
            {dataLoaded ? (
              <div className="card border-0 rounded m-0 py-1">
                {allDeliveryAreas.length ? (
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
                        tableName="table-to-xls"
                        csvFileName="delivery-areas"
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

export default DeliveryAreaList;
