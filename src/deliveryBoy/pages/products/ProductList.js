import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link } from "react-router-dom";
import Config from "../../../config/Config";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";

// import { storage } from "../../../firebase/FirebaseConfig";

//  Component Function
const ProductList = (props) => {
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
  });

  const [isAllProductLoaded, setIsAllProductLoaded] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");

  const limitHandler = (e) => {
    const limit = e.target.value;
    const totalPage = Math.ceil(pagination.totalRecord / limit);
    setPagination({
      ...pagination,
      limit,
      totalPage,
    });
  };

  const pageHandler = (e, page) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      skip: page == 1 ? 0 : (page - 1) * pagination.limit,
      currentPage: page,
    });
  };

  const previousPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage: pagination.currentPage == 1 ? 1 : pagination.currentPage - 1,
      skip:
        pagination.currentPage == 1
          ? 0
          : (pagination.currentPage - 2) * pagination.limit,
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage:
        pagination.currentPage == pagination.totalPage
          ? pagination.totalPage
          : pagination.currentPage + 1,
      skip:
        pagination.currentPage == pagination.totalPage
          ? 0
          : pagination.currentPage * pagination.limit,
    });
  };

  // Get Data From Database
  useEffect(() => {
    setIsAllProductLoaded(false);
    let url = `${Config.SERVER_URL}/products?skip=${pagination.skip}&limit=${pagination.limit}&status=${status}`;
    if (searchQuery) url += `&searchQuery=${searchQuery}`;
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsAllProductLoaded(true);
          if (result.status === 200) {
            setAllProduct(result.body || []);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllProductLoaded(true);
        }
      );
  }, [pagination.skip, pagination.limit, isDeleted, searchQuery, status]);

  // Count Records
  useEffect(() => {
    let url = `${Config.SERVER_URL}/products?skip=0&limit=0&status=${status}`;
    if (searchQuery) url += `&searchQuery=${searchQuery}`;
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          setPagination({
            ...pagination,
            totalRecord: result.body.length,
            totalPage: Math.ceil(result.body.length / pagination.limit),
          });
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllProductLoaded(true);
        }
      );
  }, [isDeleted, searchQuery, status]);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"PRODUCTS"} pageTitle={"Product List"} />

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
            {isAllProductLoaded ? (
              <div className="card border-0 rounded m-0 py-1">
                {allProduct.length ? (
                  <div className="card-body py-0">
                    <div className="table-responsive">
                      <table
                        id={"table-to-xls"}
                        className={"table table-bordered table-striped my-0"}
                      >
                        <thead>
                          <tr>
                            <th>SN</th>
                            <th>NAME</th>
                            <th>CATEGORY</th>
                            <th>OCCASION</th>
                            <th>PRICE</th>
                            <th>IMAGE</th>
                            <th>CREATED AT</th>
                            <th className="text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allProduct.map((product, index) => {
                            return (
                              <tr key={index}>
                                <td>{++index}</td>
                                <td>{product.name}</td>
                                <td>{product?.category?.name}</td>
                                <td>{product?.occasion?.name}</td>
                                <td>
                                  <p className="mrp">Rs {product.mrp}</p>

                                  <span className="text-success">
                                    Rs {product.sellingPrice}
                                  </span>
                                </td>

                                <td>
                                  <img
                                    src={product.defaultImage}
                                    style={{
                                      height: "70px",
                                      width: "70px",
                                      borderRadius: "35px",
                                    }}
                                  />
                                </td>
                                <td>
                                  {date.format(
                                    new Date(product.createdAt),
                                    "DD-MM-YYYY"
                                  )}
                                </td>

                                <td className="text-center">
                                  <Link
                                    className="btn btn-info"
                                    to={`/supervisor/product/details/${product._id}`}
                                  >
                                    <i className="fa fa-eye"></i>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {/* Pagination */}
                      <div className="mt-2 d-flex justify-content-between">
                        <div className="d-flex">
                          <div className="limit form-group shadow-sm px-3 border">
                            <select
                              name=""
                              id=""
                              value={pagination.limit}
                              className="form-control"
                              onChange={limitHandler}
                            >
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="30">30</option>
                              <option value={pagination.totalRecord}>
                                All
                              </option>
                            </select>
                          </div>
                          <div className="">
                            <ReactHTMLTableToExcel
                              id="test-table-xls-button"
                              className="download-table-xls-button shadow-sm px-3 border"
                              table="table-to-xls"
                              filename="products"
                              sheet="data"
                              buttonText="Download as XLS"
                            />
                          </div>
                        </div>
                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <li
                              className={`page-item ${
                                pagination.currentPage == 1 ? "disabled" : ""
                              }`}
                            >
                              <a
                                className="page-link"
                                href="#"
                                tabindex="-1"
                                onClick={previousPageHandler}
                              >
                                Previous
                              </a>
                            </li>
                            {[...Array(pagination.totalPage)].map((_, i) => {
                              return (
                                <li className="page-item">
                                  <a
                                    className="page-link"
                                    href="#"
                                    onClick={(e) => pageHandler(e, i + 1)}
                                  >
                                    {i + 1}
                                  </a>
                                </li>
                              );
                            })}

                            <li
                              className={`page-item ${
                                pagination.currentPage == pagination.totalPage
                                  ? "disabled"
                                  : ""
                              }`}
                            >
                              <a
                                className="page-link"
                                href="#"
                                onClick={nextPageHandler}
                              >
                                Next
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
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

export default ProductList;
