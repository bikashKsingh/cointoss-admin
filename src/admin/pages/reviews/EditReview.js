import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory, useParams } from "react-router-dom";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const EditReview = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [isAdded, setIsAdded] = useState(false);

  const [formData, setFormData] = useState({
    status: "",
    reviewStatus: "",
    comment: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    // Data for update
    const updatedData = {
      retings: formData.retings,
      comment: formData.comment,
      status: formData.status,
      reviewStatus: formData.reviewStatus,
    };

    fetch(Config.SERVER_URL + "/reviews/" + formData._id, {
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

  // get Records
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/reviews/${id}`, {
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
            // console.log(result.body);
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

        <Breadcrumb title={"USER REVIEW"} pageTitle={"Update Review"} />

        {/* Add Level Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* REVIEW DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>REVIEW DETAILS</h3>
                </div>

                {/* USER NAME */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>USER NAME</label>
                  <input
                    type="text"
                    readOnly
                    value={formData?.user?.name}
                    className="form-control"
                    placeholder={"Enter user name"}
                  />
                </div>
                {/* COURSE NAME */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>COURSE NAME</label>
                  <input
                    type="text"
                    value={formData?.course?.name}
                    className="form-control"
                    placeholder={"Enter course name"}
                  />
                </div>

                {/* Ratings */}
                <div className={"form-group mb-3 col-md-4"}>
                  <label className={"text-dark h6"}>Ratings</label>
                  <input
                    type="text"
                    value={formData?.ratings}
                    onChange={(event) => {
                      setFormData({ ...formData, ratings: event.target.value });
                    }}
                    className="form-control"
                    placeholder={"Enter course name"}
                  />
                </div>

                {/* SELECT STATUS */}
                <div className={"form-group col-md-4"}>
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

                {/* REVIEW STATUS */}
                <div className={"form-group col-md-4"}>
                  <label htmlFor="" className="text-dark h6 active">
                    REVIEW STATUS
                  </label>
                  <select
                    name=""
                    id=""
                    value={formData.reviewStatus}
                    onChange={(evt) => {
                      setFormData({
                        ...formData,
                        reviewStatus: evt.target.value,
                      });
                    }}
                    className="form-control"
                  >
                    <option value={"PENDING"}>PENDING</option>
                    <option value={"APPROVED"}>APPROVED</option>
                  </select>
                </div>

                {/* Comment */}
                <div className={"form-group mb-3 col-md-12"}>
                  <label className={"text-dark h6"}>Comment</label>
                  <textarea
                    value={formData?.comment}
                    className="form-control"
                    rows={5}
                    onChange={(event) => {
                      setFormData({ ...formData, comment: event.target.value });
                    }}
                    placeholder={"Enter comment"}
                  ></textarea>
                </div>

                <div className={"form-group col-md-12"}>
                  <button
                    disabled={loading}
                    className="btn btn-info rounded"
                    type={"submit"}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-refresh"></i> Update Review
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

export default EditReview;
