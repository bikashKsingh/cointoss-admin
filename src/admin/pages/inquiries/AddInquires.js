import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";

const AddInquires = () => {
  const history = useHistory();
  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    fetch(Config.SERVER_URL + "/inquires", {
      method: "POST",
      body: JSON.stringify(formData),
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
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ===================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        <Breadcrumb title="INQUIRES" pageTitle={"Add Inquires"} />

        {/* Add Flavour Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* ADD INQUIRES */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>ADD INQUIRES</h3>
                </div>

                {/* ENTER NAME */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER NAME !
                  </label>
                  <input
                    type="name"
                    value={formData.name}
                    onChange={(evt) =>
                      setFormData({ ...formData, name: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Tannu Singh"}
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
                    placeholder={"9117163463"}
                  />
                </div>

                {/* ENTER EMAIL */}
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
                    placeholder={"tanu@gmail.com"}
                  />
                </div>

                {/* ENTER MESSAGE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER MESSAGE !
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(evt) =>
                      setFormData({ ...formData, message: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Write your message here"}
                  ></textarea>
                </div>
                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Inquiry
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
        </div>
      </div>
    </div>
  );
};

export default AddInquires;
