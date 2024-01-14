import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";

import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

function BucketProducts() {
  const history = useHistory();

  const { id } = useParams();
  const query = new URLSearchParams(history.location.search);
  const day = query.get("day");

  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [activeTab, setActiveTab] = useState(day || "monday");

  const [formData, setFormData] = useState([]);

  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updated, setUpdated] = useState(true);

  // get Category
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/categories?skip=0&limit=0`, {
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
            let f = result.body.map((v) => {
              return { label: v.name, value: v._id };
            });

            setCategories(f);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Occasion
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/occasions?limit=0&skip=0`, {
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
            let modifyForSelect = result.body.map((value) => {
              return { label: value.name, value: value._id };
            });
            setOccasions(modifyForSelect);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // Get Bucket Details
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/buckets/${id}`, {
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
            setBucket(result.body);

            // set activeTab days data to formData
            const dataArray = result?.body[activeTab]?.map((data) => {
              return {
                product: data?.product?._id,
                quantity: data?.quantity,
              };
            });

            setFormData(dataArray);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, [day, updated]);

  const selectProductHandler = (productId) => {
    console.log("P", productId);
    console.log(formData);
    if (formData.length) {
      const isExist = formData?.some((value) => {
        return value.product == productId;
      });

      if (isExist) {
        const filteredArr = formData?.filter((value) => {
          return value.product != productId;
        });
        setFormData([...filteredArr]);
      } else {
        setFormData([
          ...formData,
          {
            product: productId,
            quantity: 1,
          },
        ]);
      }
    } else {
      setFormData([
        ...formData,
        {
          product: productId,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantityHandler = (productId) => {
    const filteredArr = formData.map((value) => {
      if (value.product == productId) {
        return {
          product: productId,
          quantity: value.quantity + 1,
        };
      } else {
        return value;
      }
    });
    setFormData([...filteredArr]);
  };

  const decreaseQuantityHandler = (productId) => {
    const filteredArr = formData.map((value) => {
      if (value.product == productId && value.quantity > 1) {
        return {
          product: productId,
          quantity: value.quantity - 1,
        };
      } else {
        return value;
      }
    });
    setFormData([...filteredArr]);
  };

  const tabClickHandler = (day) => {
    setActiveTab(day);
    const url = history.location.pathname;
    history.push(`${url}?day=${day}`);

    // set data to formData
    const dataArray = bucket[day]?.map((data) => {
      return {
        product: data?.product?._id,
        quantity: data?.quantity,
      };
    });

    console.log(dataArray);

    setFormData(dataArray);
  };

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();

    setUpdateLoading(true);

    fetch(`${Config.SERVER_URL}/buckets/${id}`, {
      method: "PUT",
      body: JSON.stringify({ [activeTab]: formData }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            setUpdated(!updated);
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              M.toast({ html: result.errors[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setUpdateLoading(false);
        },
        (error) => {
          setUpdateLoading(false);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"BUCKET"} pageTitle={"Add Bucket"} />

        {/* End Bread crumb and right sidebar toggle */}

        {/* BUCKET DASHBOARD */}
        <div className={"row"}>
          <div className="col-md-6">
            <div className="shadow-sm bg-white py-3">
              <div className="col-md-12">
                <h3 className={"text-info"}>BUCKET DETAILS</h3>
                <div className="table-responsive">
                  <img
                    src={bucket.image}
                    alt=""
                    className="img img-fluid"
                    style={{ width: "100%", maxHeight: 200 }}
                  />
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <th scope="col">NAME</th>
                        <th scope="row">{bucket?.name}</th>
                      </tr>
                      <tr>
                        <th scope="col">PRICE</th>
                        <th scope="row">
                          <span className="mrp">
                            <i className="fas fa-inr"></i>
                            {bucket?.mrp}
                          </span>

                          <span className="pl-2">
                            <i className="fas fa-inr"></i>
                            {bucket?.sellingPrice}
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th scope="col">VALIDITY</th>
                        <th scope="row">{bucket?.validity} Days</th>
                      </tr>

                      <tr>
                        <th scope="col">CATEGORY</th>
                        <th scope="row">{bucket?.category?.name}</th>
                      </tr>
                      <tr>
                        <th scope="col">OCCASION</th>
                        <th scope="row">{bucket?.occasion?.name}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="shadow-sm bg-white py-3">
              <div className="col-md-12">
                <h3 className={"text-info"}>NUMBER OF PRODUCTS</h3>

                <div className="row">
                  <div className="col-md-6 col-xl-6">
                    <div className="day-number-card bg-c-blue order-card">
                      <div className="card-block">
                        <h6 className="m-b-20 text-light">Monday</h6>
                        <h2 className="text-right text-light">
                          <i className="fa fa-sun-o f-left"></i>
                          <span>{bucket?.monday?.length}</span>
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-6">
                    <div className="day-number-card bg-c-green order-card">
                      <div className="card-block">
                        <h6 className="m-b-20 text-light">Tuesday</h6>
                        <h2 className="text-right text-light">
                          <i className="fa fa-sun-o f-left"></i>
                          <span>{bucket?.tuesday?.length}</span>
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-xl-6">
                    <div className="day-number-card bg-c-yellow order-card">
                      <div className="card-block">
                        <h6 className="m-b-20 text-light">Wednesday</h6>
                        <h2 className="text-right text-light">
                          <i className="fa fa-sun-o f-left"></i>
                          <span>{bucket?.wednesday?.length}</span>
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-xl-6">
                    <div className="day-number-card bg-c-pink order-card">
                      <div className="card-block">
                        <h6 className="m-b-20 text-light">Thrusday</h6>
                        <h2 className="text-right text-light">
                          <i className="fa fa-sun-o f-left"></i>
                          <span>{bucket?.thursday?.length}</span>
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Friday */}
                  <div className="col-md-6 col-xl-6">
                    <div className="day-number-card bg-c-blue order-card">
                      <div className="card-block">
                        <h6 className="m-b-20 text-light">Friday</h6>
                        <h2 className="text-right text-light">
                          <i className="fa fa-sun-o f-left"></i>
                          <span>{bucket?.friday?.length}</span>
                        </h2>
                      </div>
                    </div>
                  </div>
                  {/* Saturday */}
                  <div className="col-md-6 col-xl-6">
                    <div className="day-number-card bg-c-green order-card">
                      <div className="card-block">
                        <h6 className="m-b-20 text-light">Saturday</h6>
                        <h2 className="text-right text-light">
                          <i className="fa fa-sun-o f-left"></i>
                          <span>{bucket?.saturday?.length}</span>
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Sunday */}
                  <div className="col-md-6 col-xl-6">
                    <div className="day-number-card bg-c-yellow order-card">
                      <div className="card-block">
                        <h6 className="m-b-20 text-light">Sunday</h6>
                        <h2 className="text-right text-light">
                          <i className="fa fa-sun-o f-left"></i>
                          <span>{bucket?.sunday?.length}</span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buckrt Products */}
        <div className="row mt-2">
          <div className={"col-md-12"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* BUCKET PRODUCTS */}
              <div className={"row"}>
                <div className="col-md-12">
                  <div className="shadow-sm bg-white py-3">
                    <div className="col-md-12">
                      <h3 className={"my-3 text-info"}>BUCKET PRODUCTS</h3>
                    </div>

                    <div className="col-md-12">
                      {/* Tabs */}
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        {/* Monday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("monday");
                            }}
                            className={`nav-link ${
                              activeTab == "monday" ? "active" : null
                            }`}
                            id="monday-tab"
                            data-toggle="tab"
                            data-target="#monday"
                            type="button"
                            role="tab"
                            aria-controls="monday"
                            aria-selected="true"
                          >
                            Monday
                          </button>
                        </li>

                        {/* Tuesday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("tuesday");
                            }}
                            className={`nav-link ${
                              activeTab == "tuesday" ? "active" : null
                            }`}
                            id="tuesday-tab"
                            data-toggle="tab"
                            data-target="#tuesday"
                            type="button"
                            role="tab"
                            aria-controls="tuesday"
                            aria-selected="false"
                          >
                            Tuesday
                          </button>
                        </li>

                        {/* Wednesday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("wednesday");
                            }}
                            className={`nav-link ${
                              activeTab == "wednesday" ? "active" : null
                            }`}
                            id="wednesday-tab"
                            data-toggle="tab"
                            data-target="#wednesday"
                            type="button"
                            role="tab"
                            aria-controls="wednesday"
                            aria-selected="false"
                          >
                            Wednesday
                          </button>
                        </li>

                        {/* Thursday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("thursday");
                            }}
                            className={`nav-link ${
                              activeTab == "thursday" ? "active" : null
                            }`}
                            id="thursday-tab"
                            data-toggle="tab"
                            data-target="#thursday"
                            type="button"
                            role="tab"
                            aria-controls="thursday"
                            aria-selected="false"
                          >
                            Thursday
                          </button>
                        </li>

                        {/* Friday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("friday");
                            }}
                            className={`nav-link ${
                              activeTab == "friday" ? "active" : null
                            }`}
                            id="friday-tab"
                            data-toggle="tab"
                            data-target="#friday"
                            type="button"
                            role="tab"
                            aria-controls="friday"
                            aria-selected="false"
                          >
                            Friday
                          </button>
                        </li>

                        {/* Saturday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("saturday");
                            }}
                            className={`nav-link ${
                              activeTab == "saturday" ? "active" : null
                            }`}
                            id="saturday-tab"
                            data-toggle="tab"
                            data-target="#saturday"
                            type="button"
                            role="tab"
                            aria-controls="saturday"
                            aria-selected="false"
                          >
                            Saturday
                          </button>
                        </li>

                        {/* Sunday */}
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => {
                              tabClickHandler("sunday");
                            }}
                            className={`nav-link ${
                              activeTab == "sunday" ? "active" : null
                            }`}
                            id="sunday-tab"
                            data-toggle="tab"
                            data-target="#sunday"
                            type="button"
                            role="tab"
                            aria-controls="sunday"
                            aria-selected="false"
                          >
                            Sunday
                          </button>
                        </li>
                      </ul>

                      {/* Details */}
                      <div className="tab-content" id="myTabContent">
                        {/* Monday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "monday" ? "active" : null
                          }`}
                          id="monday"
                          role="tabpanel"
                          aria-labelledby="monday-tab"
                        >
                          {bucket?.monday?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                      <th className="text-center">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket?.monday?.map(
                                      ({ product }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>
                                              {formData?.some((value) => {
                                                return (
                                                  value.product == product?._id
                                                );
                                              }) ? (
                                                <div className="d-flex bucket-product">
                                                  <button
                                                    onClick={() => {
                                                      decreaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    -
                                                  </button>
                                                  <input
                                                    className="qty"
                                                    type="text"
                                                    value={
                                                      formData.filter(
                                                        (value) => {
                                                          return (
                                                            value.product ==
                                                            product?._id
                                                          );
                                                        }
                                                      )[0].quantity
                                                    }
                                                  />
                                                  <button
                                                    onClick={() => {
                                                      increaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              ) : null}
                                            </td>

                                            <td className="text-center">
                                              <div className="form-check form-check-inline">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={formData?.some(
                                                    (value) => {
                                                      return (
                                                        value.product ==
                                                        product?._id
                                                      );
                                                    }
                                                  )}
                                                  id={product._id}
                                                  onChange={(evt) =>
                                                    selectProductHandler(
                                                      product?._id
                                                    )
                                                  }
                                                />

                                                <label
                                                  className="form-check-label"
                                                  htmlFor={product._id}
                                                ></label>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link
                              to={`/admin/bucket/addProduct/${id}/monday`}
                              type="button"
                              className="btn btn-info"
                            >
                              Add Product
                            </Link>

                            {bucket[activeTab]?.length ? (
                              <button
                                disabled={updateLoading}
                                type="submit"
                                className="btn btn-danger ml-2"
                              >
                                {updateLoading ? <Spinner /> : "Update Product"}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Tuesday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "tuesday" ? "active" : null
                          }`}
                          id="tuesday"
                          role="tabpanel"
                          aria-labelledby="tuesday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                      <th className="text-center">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                              {product?.name} {product._id}
                                            </td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>
                                              {formData?.some((value) => {
                                                return (
                                                  value.product == product?._id
                                                );
                                              }) ? (
                                                <div className="d-flex bucket-product">
                                                  <button
                                                    onClick={() => {
                                                      decreaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    -
                                                  </button>
                                                  <input
                                                    className="qty"
                                                    type="text"
                                                    value={
                                                      formData.filter(
                                                        (value) => {
                                                          return (
                                                            value.product ==
                                                            product?._id
                                                          );
                                                        }
                                                      )[0].quantity
                                                    }
                                                  />
                                                  <button
                                                    onClick={() => {
                                                      increaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              ) : null}
                                            </td>

                                            <td>
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={formData?.some(
                                                  (value) => {
                                                    return (
                                                      value.product ==
                                                      product?._id
                                                    );
                                                  }
                                                )}
                                                id={product._id}
                                                onChange={(evt) =>
                                                  selectProductHandler(
                                                    product?._id
                                                  )
                                                }
                                              />

                                              <label
                                                className="form-check-label"
                                                htmlFor={product._id}
                                              ></label>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link
                              to={`/admin/bucket/addProduct/${id}/${activeTab}`}
                              type="button"
                              className="btn btn-info"
                            >
                              Add Product
                            </Link>

                            {bucket[activeTab]?.length ? (
                              <button
                                disabled={updateLoading}
                                type="submit"
                                className="btn btn-danger ml-2"
                              >
                                {updateLoading ? <Spinner /> : "Update Product"}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Wednesday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "wednesday" ? "active" : null
                          }`}
                          id="wednesday"
                          role="tabpanel"
                          aria-labelledby="wednesday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                      <th className="text-center">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>
                                              {formData?.some((value) => {
                                                return (
                                                  value.product == product?._id
                                                );
                                              }) ? (
                                                <div className="d-flex bucket-product">
                                                  <button
                                                    onClick={() => {
                                                      decreaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    -
                                                  </button>
                                                  <input
                                                    className="qty"
                                                    type="text"
                                                    value={
                                                      formData.filter(
                                                        (value) => {
                                                          return (
                                                            value.product ==
                                                            product?._id
                                                          );
                                                        }
                                                      )[0].quantity
                                                    }
                                                  />
                                                  <button
                                                    onClick={() => {
                                                      increaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              ) : null}
                                            </td>

                                            <td className="text-center">
                                              <div className="form-check form-check-inline">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={formData?.some(
                                                    (value) => {
                                                      return (
                                                        value.product ==
                                                        product?._id
                                                      );
                                                    }
                                                  )}
                                                  id={product._id}
                                                  onChange={(evt) =>
                                                    selectProductHandler(
                                                      product?._id
                                                    )
                                                  }
                                                />

                                                <label
                                                  className="form-check-label"
                                                  htmlFor={product._id}
                                                ></label>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link
                              to={`/admin/bucket/addProduct/${id}/${activeTab}`}
                              type="button"
                              className="btn btn-info"
                            >
                              Add Product
                            </Link>

                            {bucket[activeTab]?.length ? (
                              <button
                                disabled={updateLoading}
                                type="submit"
                                className="btn btn-danger ml-2"
                              >
                                {updateLoading ? <Spinner /> : "Update Product"}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Thursday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "thursday" ? "active" : null
                          }`}
                          id="thursday"
                          role="tabpanel"
                          aria-labelledby="thursday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                      <th className="text-center">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>
                                              {formData?.some((value) => {
                                                return (
                                                  value.product == product?._id
                                                );
                                              }) ? (
                                                <div className="d-flex bucket-product">
                                                  <button
                                                    onClick={() => {
                                                      decreaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    -
                                                  </button>
                                                  <input
                                                    className="qty"
                                                    type="text"
                                                    value={
                                                      formData.filter(
                                                        (value) => {
                                                          return (
                                                            value.product ==
                                                            product?._id
                                                          );
                                                        }
                                                      )[0].quantity
                                                    }
                                                  />
                                                  <button
                                                    onClick={() => {
                                                      increaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              ) : null}
                                            </td>

                                            <td className="text-center">
                                              <div className="form-check form-check-inline">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={formData?.some(
                                                    (value) => {
                                                      return (
                                                        value.product ==
                                                        product?._id
                                                      );
                                                    }
                                                  )}
                                                  id={product._id}
                                                  onChange={(evt) =>
                                                    selectProductHandler(
                                                      product?._id
                                                    )
                                                  }
                                                />

                                                <label
                                                  className="form-check-label"
                                                  htmlFor={product._id}
                                                ></label>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link
                              to={`/admin/bucket/addProduct/${id}/${activeTab}`}
                              type="button"
                              className="btn btn-info"
                            >
                              Add Product
                            </Link>

                            {bucket[activeTab]?.length ? (
                              <button
                                disabled={updateLoading}
                                type="submit"
                                className="btn btn-danger ml-2"
                              >
                                {updateLoading ? <Spinner /> : "Update Product"}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Friday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "friday" ? "active" : null
                          }`}
                          id="friday"
                          role="tabpanel"
                          aria-labelledby="friday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                      <th className="text-center">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>
                                              {formData?.some((value) => {
                                                return (
                                                  value.product == product?._id
                                                );
                                              }) ? (
                                                <div className="d-flex bucket-product">
                                                  <button
                                                    onClick={() => {
                                                      decreaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    -
                                                  </button>
                                                  <input
                                                    className="qty"
                                                    type="text"
                                                    value={
                                                      formData.filter(
                                                        (value) => {
                                                          return (
                                                            value.product ==
                                                            product?._id
                                                          );
                                                        }
                                                      )[0].quantity
                                                    }
                                                  />
                                                  <button
                                                    onClick={() => {
                                                      increaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              ) : null}
                                            </td>

                                            <td className="text-center">
                                              <div className="form-check form-check-inline">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={formData?.some(
                                                    (value) => {
                                                      return (
                                                        value.product ==
                                                        product?._id
                                                      );
                                                    }
                                                  )}
                                                  id={product._id}
                                                  onChange={(evt) =>
                                                    selectProductHandler(
                                                      product?._id
                                                    )
                                                  }
                                                />

                                                <label
                                                  className="form-check-label"
                                                  htmlFor={product._id}
                                                ></label>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link
                              to={`/admin/bucket/addProduct/${id}/${activeTab}`}
                              type="button"
                              className="btn btn-info"
                            >
                              Add Product
                            </Link>

                            {bucket[activeTab]?.length ? (
                              <button
                                disabled={updateLoading}
                                type="submit"
                                className="btn btn-danger ml-2"
                              >
                                {updateLoading ? <Spinner /> : "Update Product"}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Saturday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "saturday" ? "active" : null
                          }`}
                          id="saturday"
                          role="tabpanel"
                          aria-labelledby="saturday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                      <th className="text-center">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>
                                              {formData?.some((value) => {
                                                return (
                                                  value.product == product?._id
                                                );
                                              }) ? (
                                                <div className="d-flex bucket-product">
                                                  <button
                                                    onClick={() => {
                                                      decreaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    -
                                                  </button>
                                                  <input
                                                    className="qty"
                                                    type="text"
                                                    value={
                                                      formData.filter(
                                                        (value) => {
                                                          return (
                                                            value.product ==
                                                            product?._id
                                                          );
                                                        }
                                                      )[0].quantity
                                                    }
                                                  />
                                                  <button
                                                    onClick={() => {
                                                      increaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              ) : null}
                                            </td>

                                            <td className="text-center">
                                              <div className="form-check form-check-inline">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={formData?.some(
                                                    (value) => {
                                                      return (
                                                        value.product ==
                                                        product?._id
                                                      );
                                                    }
                                                  )}
                                                  id={product._id}
                                                  onChange={(evt) =>
                                                    selectProductHandler(
                                                      product?._id
                                                    )
                                                  }
                                                />

                                                <label
                                                  className="form-check-label"
                                                  htmlFor={product._id}
                                                ></label>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link
                              to={`/admin/bucket/addProduct/${id}/${activeTab}`}
                              type="button"
                              className="btn btn-info"
                            >
                              Add Product
                            </Link>

                            {bucket[activeTab]?.length ? (
                              <button
                                disabled={updateLoading}
                                type="submit"
                                className="btn btn-danger ml-2"
                              >
                                {updateLoading ? <Spinner /> : "Update Product"}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Sunday */}
                        <div
                          className={`tab-pane fade show ${
                            activeTab == "sunday" ? "active" : null
                          }`}
                          id="sunday"
                          role="tabpanel"
                          aria-labelledby="sunday-tab"
                        >
                          {bucket[activeTab]?.length ? (
                            <div className="row">
                              <div className="col-md-12 table-responsive">
                                <table
                                  className={
                                    "table table-bordered table-striped my-0"
                                  }
                                >
                                  <thead>
                                    <tr>
                                      <th>SN</th>
                                      <th>NAME</th>
                                      <th>IMAGE</th>
                                      <th>QUANTITY</th>
                                      <th className="text-center">ACTION</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bucket[activeTab]?.map(
                                      ({ product }, index) => {
                                        return (
                                          <tr key={product?._id}>
                                            <td>{index + 1}</td>
                                            <td>{product?.name}</td>
                                            <td>
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  borderRadius: "50px",
                                                }}
                                                src={product?.defaultImage}
                                              />
                                            </td>
                                            <td>
                                              {formData?.some((value) => {
                                                return (
                                                  value.product == product?._id
                                                );
                                              }) ? (
                                                <div className="d-flex bucket-product">
                                                  <button
                                                    onClick={() => {
                                                      decreaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    -
                                                  </button>
                                                  <input
                                                    className="qty"
                                                    type="text"
                                                    value={
                                                      formData.filter(
                                                        (value) => {
                                                          return (
                                                            value.product ==
                                                            product?._id
                                                          );
                                                        }
                                                      )[0].quantity
                                                    }
                                                  />
                                                  <button
                                                    onClick={() => {
                                                      increaseQuantityHandler(
                                                        product?._id
                                                      );
                                                    }}
                                                    className="qty-btn"
                                                    type="button"
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              ) : null}
                                            </td>

                                            <td className="text-center">
                                              <div className="form-check form-check-inline">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={formData?.some(
                                                    (value) => {
                                                      return (
                                                        value.product ==
                                                        product?._id
                                                      );
                                                    }
                                                  )}
                                                  id={product._id}
                                                  onChange={(evt) =>
                                                    selectProductHandler(
                                                      product?._id
                                                    )
                                                  }
                                                />

                                                <label
                                                  className="form-check-label"
                                                  htmlFor={product._id}
                                                ></label>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-12 my-4">
                                <div className="text-center">
                                  <p className="badge badge-danger">
                                    Product Not Available
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-2">
                            <Link
                              to={`/admin/bucket/addProduct/${id}/${activeTab}`}
                              type="button"
                              className="btn btn-info"
                            >
                              Add Product
                            </Link>

                            {bucket[activeTab]?.length ? (
                              <button
                                disabled={updateLoading}
                                type="submit"
                                className="btn btn-danger ml-2"
                              >
                                {updateLoading ? <Spinner /> : "Update Product"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BucketProducts;
