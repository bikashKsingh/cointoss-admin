import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link, useHistory, useParams } from "react-router-dom";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";
const date = require("date-and-time");

// Component Function
const DeliveryBoyAreas = (props) => {
  const history = useHistory();
  const { id } = useParams();

  const [dataLoading, setDataLoading] = useState(false);
  const [allDeliveryBoys, setAllDeliveryBoys] = useState([]);
  const [allDeliveryAreas, setAllDeliveryAreas] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectDeliveryAreaHandler = (areaId) => {
    if (formData.length) {
      const isExist = formData.some((value) => {
        return value == areaId;
      });

      if (isExist) {
        const filteredArr = formData.filter((value) => {
          return value != areaId;
        });
        setFormData([...filteredArr]);
      } else {
        setFormData([...formData, areaId]);
      }
    } else {
      setFormData([areaId]);
    }
  };

  // Get Delivery Area details
  useEffect(() => {
    setDataLoading(true);
    const getData = async () => {
      try {
        const response = await fetch(
          `${Config.SERVER_URL}/supervisorDeliveryBoys/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                "jwt_supervisor_token"
              )}`,
            },
          }
        );
        const result = await response.json();
        if (result.status == 200) {
          setAllDeliveryAreas(result?.body?.deliveryAreas);
          const deliveryBoyAreaArry = result?.body?.deliveryAreas.map(
            (area) => area._id
          );
          setFormData([...deliveryBoyAreaArry]);
        } else {
          M.toast({ html: result.message, classes: "bg-danger" });
        }
        setDataLoading(false);
      } catch (error) {
        M.toast({ html: error, classes: "bg-danger" });
        setDataLoading(false);
      }
    };

    getData();
  }, []);

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();

    setUpdateLoading(true);

    fetch(`${Config.SERVER_URL}/deliveryBoys/assignDeliveryAreas/${id}`, {
      method: "PUT",
      body: JSON.stringify({ deliveryAreas: formData }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_supervisor_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
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

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"SUPERVISOR"} pageTitle={"Delivery Boys"} />
        {/* End Bread crumb and right sidebar toggle */}

        {/* Delivery Boys List */}
        <div className="row mt-2">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Delivery Boys Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Delivery Area List</h3>
                </div>

                <div className={"col-md-12 px-0"}>
                  {/* Heading */}
                  <div className={"card mb-0 mt-2 border-0 rounded"}>
                    <div className={"card-body pb-0 pt-2 d-flex"}>
                      <div>
                        <h4 className="float-left mt-2 mr-2">Search: </h4>
                      </div>
                      <div className="border px-2">
                        <input
                          type="search"
                          onChange={(evt) => {
                            setSearchQuery(evt.target.value);
                          }}
                          placeholder="By Name/Email"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-8 text-right">
                        <Link
                          className="btn btn-info rounded"
                          to={{
                            pathname: `/supervisor/deliveryBoy/assignDeliveryAreas/${id}`,
                          }}
                        >
                          <span className={"fas fa-plus"}></span> Add Delivery
                          Area Area
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Data */}
                  {!dataLoading ? (
                    <div className="card border-0 rounded m-0 py-1">
                      {allDeliveryAreas?.length ? (
                        <div className="card-body py-0">
                          <div className="table-responsive">
                            <table
                              className={
                                "table table-bordered table-striped my-0"
                              }
                            >
                              <thead>
                                <tr>
                                  <th>SN</th>
                                  <th>NAME</th>

                                  <th className="text-center">ACTION</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allDeliveryAreas.map((deliveryArea, index) => {
                                  return (
                                    <tr key={deliveryArea.id}>
                                      <td>{index + 1}</td>
                                      <td>{deliveryArea.name}</td>

                                      <td className="text-center">
                                        <div className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={formData.some((value) => {
                                              return value == deliveryArea._id;
                                            })}
                                            id={`deliveryArea-${index}`}
                                            onChange={(evt) =>
                                              selectDeliveryAreaHandler(
                                                deliveryArea._id
                                              )
                                            }
                                          />

                                          <label
                                            className="form-check-label"
                                            htmlFor={`deliveryArea-${index}`}
                                          ></label>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={
                            "alert alert-danger mx-3 rounded border-0 py-2"
                          }
                        >
                          No Data Available
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="col-md-12 text-center mt-3">
                      <Spinner />
                    </div>
                  )}
                </div>

                <div className={"form-group col-md-12"}>
                  <button
                    disabled={updateLoading}
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {updateLoading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-plus"></i> Update
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyAreas;
