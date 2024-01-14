import React, { useState, useEffect } from "react";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";

const Setting = () => {
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);

  const [setting, setSetting] = useState({});
  const [contactUs, setContactUs] = useState({});

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();

    fetch(`${Config.SERVER_URL}/settings`, {
      method: "POST",
      body: JSON.stringify(setting),
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
    fetch(`${Config.SERVER_URL}/settings/`, {
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
            let body = result.body;
            delete body.id;
            delete body._id;
            delete body.createdAt;
            delete body.updatedAt;
            setSetting(result.body);
            setContactUs(result.body.contactUs || {});
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb
          title={"Setting"}
          pageTitle={"Update Setting"}
          pageLink={"/branch/setting"}
        />

        {/* End Bread crumb and right sidebar toggle */}

        {/* Add Setting Form */}
        <div className="row mt-2">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Withdrawal */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Withdrawal Details</h3>
                </div>

                {/*  Minimum Withdrawal Amount */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Minimum Withdrawal Amount
                  </label>
                  <input
                    type="text"
                    value={setting.minimumwithdrawalAmount}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        minimumwithdrawalAmount: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter withdrawal amount"}
                  />
                </div>
              </div>

              {/* Referral Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Referral Details</h3>
                </div>

                {/* Referral Amount */}
                <div className="form-group col-md-6">
                  <div className="form-check m-0 p-0">
                    <label htmlFor="" className="text-dark h6 active">
                      Referral Amount
                    </label>
                    <input
                      type="text"
                      value={setting.referralAmount}
                      onChange={(evt) =>
                        setSetting({
                          ...setting,
                          referralAmount: evt.target.value,
                        })
                      }
                      className="form-control"
                      placeholder={"Enter referral amount"}
                    />
                  </div>
                </div>

                {/* Referred Amount */}
                <div className="form-group col-md-6">
                  <div className="form-check m-0 p-0">
                    <label htmlFor="" className="text-dark h6 active">
                      Referred Amount
                    </label>
                    <input
                      type="text"
                      value={setting.referredAmount}
                      onChange={(evt) =>
                        setSetting({
                          ...setting,
                          referredAmount: evt.target.value,
                        })
                      }
                      className="form-control"
                      placeholder={"Enter referred amount"}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Contact Details</h3>
                </div>

                {/* Support Mobile */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Support Mobile
                  </label>
                  <input
                    type="text"
                    value={setting.supportMobile}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        supportMobile: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter mobile number"}
                  />
                </div>

                {/* Support Email */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={setting.supportEmail}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        supportEmail: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter email id"}
                  />
                </div>

                {/* Support Whatsapp Number */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Support Whatsapp Number
                  </label>
                  <input
                    type="tel"
                    value={setting.supportWhatsapp}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        supportWhatsapp: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter whatsapp number"}
                  />
                </div>

                {/* Office Address */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Office Address
                  </label>
                  <input
                    type="text"
                    value={contactUs.officeAddress}
                    onChange={(evt) =>
                      setContactUs({
                        ...contactUs,
                        officeAddress: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Write Address"}
                  />
                </div>
              </div>

              {/* Social Media Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Social Media Details</h3>
                </div>

                {/* Facebook */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={setting.facebook}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        facebook: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter facebook profile"}
                  />
                </div>

                {/* Twitter */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={setting.twitter}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        twitter: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter twitter profile"}
                  />
                </div>

                {/* Instagram */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={setting.instagram}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        instagram: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter instagram profile"}
                  />
                </div>

                {/* Youtube */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    Youtube
                  </label>
                  <input
                    type="text"
                    value={setting.youtube}
                    onChange={(evt) =>
                      setSetting({
                        ...setting,
                        youtube: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter youtube profile"}
                  />
                </div>

                <div className={"form-group col-md-12 mt-2"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isUpdateLoaded ? (
                      <div>
                        <i className="fas fa-refresh"></i> Update Setting
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

export default Setting;
