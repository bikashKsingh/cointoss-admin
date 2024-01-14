import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const EditInquiry = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
    inquiryStatus: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();
    const updateData = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      inquiryStatus: formData.inquiryStatus,
      status: formData.status,
      message: formData.message,
    };
    fetch(`${Config.SERVER_URL}/inquires/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
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
            history.goBack();
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              M.toast({ html: result.errors[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsUpdateLoaded(true);
        },
        (error) => {
          setIsUpdateLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get Records
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/inquires/${id}`, {
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
            setFormData(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsDataLoaded(true);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsDataLoaded(true);
        }
      );
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        <Breadcrumb
          title="INQUIRY"
          pageTitle={"Update Inquiry"}
          pageLink={"#"}
        />

        {/* Update Inquiry Form */}
        <div className="row">
          {isDataLoaded ? (
            <div className={"col-md-11 mx-auto"}>
              <form
                onSubmit={submitHandler}
                className="form-horizontal form-material"
              >
                {/* Inquiry Details */}
                <div className={"row shadow-sm bg-white py-3"}>
                  <div className="col-md-12">
                    <h3 className={"my-3 text-info"}>Inquiry Details</h3>
                  </div>

                  {/* ENTER NAME */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      ENTER NAME !
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(evt) =>
                        setFormData({ ...formData, name: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Enter name"}
                    />
                  </div>

                  {/* ENTER MOBILE */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      ENTER MOBILE !
                    </label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(evt) =>
                        setFormData({ ...formData, mobile: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Enter mobile"}
                    />
                  </div>

                  {/* Enter Email */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      ENTER EMAIL !
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(evt) =>
                        setFormData({ ...formData, email: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Enter email"}
                    />
                  </div>

                  {/* SELECT INQUIRY STATUS */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      SELECT INQUIRY STATUS
                    </label>
                    <select
                      name=""
                      id=""
                      value={formData.inquiryStatus}
                      onChange={(evt) => {
                        setFormData({
                          ...formData,
                          inquiryStatus: evt.target.value,
                        });
                      }}
                      className="form-control"
                    >
                      <option value={"OPEN"}>OPEN</option>
                      <option value={"INPROGRESS"}>INPROGRESS</option>
                      <option value={"PENDING"}>PENDING</option>
                      <option value={"CLOSED"}>CLOSED</option>
                    </select>
                  </div>

                  {/* SELECT STATUS */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      SELECT STATUS
                    </label>
                    <select
                      name=""
                      id=""
                      value={formData.status}
                      onChange={(evt) => {
                        setFormData({ ...formData, status: evt.target.value });
                      }}
                      className="form-control"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Disabled</option>
                    </select>
                  </div>

                  {/* MESSAGE */}
                  <div className={"form-group col-md-12"}>
                    <label htmlFor="" className="text-dark h6 active">
                      MESSAGE
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(evt) =>
                        setFormData({ ...formData, message: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Enter message"}
                    ></textarea>
                  </div>

                  <div className={"form-group col-md-6"}>
                    <button
                      className="btn btn-info rounded px-3 py-2"
                      type={"submit"}
                    >
                      {isUpdateLoaded ? (
                        <div>
                          <i className="fas fa-refresh"></i> Update Inquiry
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
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="col-md-11 mx-auto text-center bg-white py-5">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditInquiry;
