import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import Config from "../../../config/Config";
import { storage } from "../../../firebase/FirebaseConfig";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const AddTestimonial = () => {
  const history = useHistory();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(true);

  const [isAdded, setIsAdded] = useState(false);

  const [data, setData] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    designation: "",
    image: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    if (progress > 0 && progress < 100) {
      M.toast({ html: "Wait for Image uploading", classes: "bg-warning" });
      return;
    }

    fetch(Config.SERVER_URL + "/testimonials", {
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

            setIsAdded(!isAdded);
            setProgress(0);
            history.goBack();
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              M.toast({ html: result.errors[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // For Image
  const imgChangeHandler = (e, type) => {
    if (e.target.files[0]) {
      setUploaded(false);
      handleUpload(e.target.files[0], type);
    }
  };

  // Upload Image
  const handleUpload = (image, type) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            if (type == "ADD") {
              setFormData({
                ...formData,
                image: url,
              });
            } else {
              setData({
                ...data,
                image: url,
              });
            }
            setUploaded(true);
            // setCategory({ ...category, category_image: url })
          });
      }
    );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"ADD TESTIMONIAL"} pageTitle={"Add Testimonial"} />

        {/* Add Testimonial Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* TESTIMONIAL CUSTOMER DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>
                    TESTIMONIAL CUSTOMER DETAILS
                  </h3>
                </div>

                {/* CUSTOMER NAME */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>CUSTOMER NAME</label>
                  <input
                    type="text"
                    onChange={(evt) => {
                      setFormData({ ...formData, name: evt.target.value });
                    }}
                    value={formData.name}
                    className="form-control"
                    placeholder={"Enter customer name"}
                  />
                </div>

                {/* CUSTOMER DESIGNATION */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>CUSTOMER DESIGNATION</label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        designation: evt.target.value,
                      })
                    }
                    value={formData.designation}
                    className="form-control"
                    placeholder={"Write designation"}
                  />
                </div>

                {/* COMMENT */}
                <div className={"form-group mb-3 col-md-12"}>
                  <label className={"text-dark h6"}>COMMENT</label>
                  <textarea
                    name=""
                    id=""
                    rows="4"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        comment: evt.target.value,
                      })
                    }
                    value={formData.comment}
                    className="form-control"
                    placeholder={"Write commnet"}
                  ></textarea>
                </div>

                {/* CUSTOMER IMAGE */}
                <div className={"form-group mb-3 col-md-6"}>
                  <div className="row">
                    <div
                      className={
                        formData.image !== "null" ? "col-md-8" : "col-md-12"
                      }
                    >
                      <label className={"text-dark h6"}>CUSTOMER IMAGE</label>
                      <input
                        type="file"
                        name=""
                        className="form-control"
                        onChange={(e) => imgChangeHandler(e, "ADD")}
                      />
                    </div>

                    {!uploaded ? (
                      <div className="col-md-4">
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading..
                      </div>
                    ) : (
                      <div className="col-md-4">
                        {formData.image ? (
                          <img
                            style={{
                              height: "100px",
                              width: "100px",
                              borderRadius: "20px",
                            }}
                            className="img img-thumbnail"
                            src={formData.image}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* IMAGE URL */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>IMAGE URL</label>
                  <input
                    type="text"
                    name=""
                    className="form-control"
                    placeholder="Image URL"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                <div className={"form-group col-md-12"}>
                  <button className="btn btn-info rounded" type={"submit"}>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-plus"></i> Add
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

export default AddTestimonial;
