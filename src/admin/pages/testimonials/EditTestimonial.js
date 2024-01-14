import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory, useParams } from "react-router-dom";
import Config from "../../../config/Config";
import { storage } from "../../../firebase/FirebaseConfig";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const EditTestimonial = () => {
  const history = useHistory();
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(true);

  const [isAdded, setIsAdded] = useState(false);

  const [data, setData] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    comment: "",
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

    // Data for update
    const updatedData = {
      name: formData.name,
      designation: formData.designation,
      comment: formData.comment,
      image: formData.image,
      status: formData.status,
    };

    fetch(Config.SERVER_URL + "/testimonials/" + formData._id, {
      method: "PUT",
      body: JSON.stringify(updatedData),
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

  // get Records
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/testimonials/${id}`, {
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
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}

        <Breadcrumb title={"TESTIMONIAL"} pageTitle={"Update User"} />

        {/* Add Testimonial Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* TESTIMONIAL DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>TESTIMONIAL DETAILS</h3>
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

                {/* Images */}
                <div className={"form-group mb-3 col-md-6"}>
                  <div className="row">
                    <div className={!formData.image ? "col-md-8" : "col-md-12"}>
                      <label className={"text-dark h6"}>Image</label>
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

                <div className={"form-group col-md-6"}>
                  <button
                    disabled={loading}
                    className="btn btn-info rounded"
                    type={"submit"}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-refresh"></i> Update
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

export default EditTestimonial;
