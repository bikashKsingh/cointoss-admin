import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import date from "date-and-time";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";

const EditCoupon = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useState(null);
  const [isCouponLoaded, setIsCouponLoaded] = useState(false);
  const [coupon, setCoupon] = useState({
    code: "",
    applyFor: "",
    discountType: "",
    discount: "",
    description: "",
    numberOfUsesTimes: "",
    minimumAmount: "",
    startDate: "",
    expiryDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();

    const updateData = {
      code: coupon.code,
      applyFor: coupon.applyFor,
      discountType: coupon.discountType,
      discount: coupon.discount,
      numberOfUsesTimes: coupon.numberOfUsesTimes,
      description: coupon.description,
      minimumAmount: coupon.minimumAmount,
      startDate: coupon.startDate,
      expiryDate: coupon.expiryDate,
      status: coupon.status,
      categories: selectedCategories.map((cat) => cat.value),
      subCategories: selectedSubCategories.map((cat) => cat.value),
    };

    fetch(`${Config.SERVER_URL}/coupons/${coupon.id}`, {
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
    fetch(`${Config.SERVER_URL}/coupons/${id}`, {
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
            setCoupon(result.body);
            setEditorValue(result?.body?.description);

            // for selected categories
            let cats = result?.body?.categories || undefined;
            if (cats) {
              let values = cats.map((item) => {
                return {
                  value: item._id,
                  label: item.name,
                };
              });
              setSelectedCategories(values);
            }

            // for selected categories
            let subCats = result?.body?.subCategories || undefined;
            if (subCats) {
              let values = subCats.map((item) => {
                return {
                  value: item._id,
                  label: item.name,
                };
              });
              setSelectedSubCategories(values);
            }
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsCouponLoaded(true);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsCouponLoaded(true);
        }
      );
  }, []);

  // Get Categories
  const getCategories = async () => {
    try {
      const response = await fetch(`${Config.SERVER_URL}/categories?limit=0`);
      const result = await response.json();
      if (result.status == 200) {
        let f = result?.body?.map((v) => {
          return { label: v.name, value: v._id };
        });
        setCategories(f);
      }
    } catch (e) {
      M.toast({ html: e.message, classes: "bg-danger" });
    }
  };

  // Get Sub Categories
  const getSubCategories = async () => {
    try {
      const response = await fetch(
        `${Config.SERVER_URL}/subCategories?limit=0`
      );
      const result = await response.json();
      if (result.status == 200) {
        let f = result?.body?.map((v) => {
          return { label: v.name, value: v._id };
        });
        setSubCategories(f);
      }
    } catch (e) {
      M.toast({ html: e.message, classes: "bg-danger" });
    }
  };

  // get all categories & sub categories
  useEffect(() => {
    getCategories();
    getSubCategories();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"COUPONS"} pageTitle={"Update Coupon"} />

        {/* Add Coupon Form */}
        <div className="row">
          {isCouponLoaded ? (
            <div className={"col-md-11 mx-auto"}>
              <form
                onSubmit={submitHandler}
                className="form-horizontal form-material"
              >
                {/* COUPON DETAILS */}
                <div className={"row shadow-sm bg-white py-3"}>
                  <div className="col-md-12">
                    <h3 className={"my-3 text-info"}>COUPON DETAILS</h3>
                  </div>

                  {/* Coupon Code */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      ENTER COUPON CODE
                    </label>
                    <input
                      type="text"
                      value={coupon.couponCode}
                      onChange={(evt) =>
                        setCoupon({ ...coupon, couponCode: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Enter the Coupon Code"}
                    />
                  </div>

                  {/* Apply For */}
                  <div className={"col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      SELECT USER TYPE
                    </label>
                    <div className="d-flex mt-2">
                      <div className="custom-control custom-radio pl-0">
                        <input
                          type="radio"
                          id="userType1"
                          name="userType"
                          checked={coupon.applyFor == "NEW_USER" ? true : false}
                          value={"NEW_USER"}
                          onChange={(evt) =>
                            setCoupon({ ...coupon, applyFor: evt.target.value })
                          }
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="userType1"
                        >
                          New User
                        </label>
                      </div>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          id="userType2"
                          name="userType"
                          checked={
                            coupon.applyFor == "EXISTING_USER" ? true : false
                          }
                          onChange={(evt) =>
                            setCoupon({ ...coupon, applyFor: evt.target.value })
                          }
                          value={"EXISTING_USER"}
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="userType2"
                        >
                          Existing User
                        </label>
                      </div>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          id="userType3"
                          name="userType"
                          checked={
                            coupon.applyFor === "ALL_USER" ? true : false
                          }
                          onChange={(evt) =>
                            setCoupon({ ...coupon, applyFor: evt.target.value })
                          }
                          value={"ALL_USER"}
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="userType3"
                        >
                          All User
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Discount type*/}
                  <div className={"col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      SELECT DISCOUNT TYPE
                    </label>
                    <div className="d-flex">
                      <div className="custom-control custom-radio pl-0 ml-0">
                        <input
                          type="radio"
                          id="discountType1"
                          name="discountType"
                          value={"AMOUNT"}
                          checked={
                            coupon.discountType == "AMOUNT" ? true : false
                          }
                          onChange={(evt) =>
                            setCoupon({
                              ...coupon,
                              discountType: evt.target.value,
                            })
                          }
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="discountType1"
                        >
                          AMOUNT
                        </label>
                      </div>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          id="discountType2"
                          name="discountType"
                          value={"PERCENTAGE"}
                          checked={
                            coupon.discountType == "PERCENTAGE" ? true : false
                          }
                          onChange={(evt) =>
                            setCoupon({
                              ...coupon,
                              discountType: evt.target.value,
                            })
                          }
                          className="custom-control-input"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="discountType2"
                        >
                          PRECENTAGE
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      DISCOUNT AMOUNT
                    </label>
                    <input
                      type="number"
                      value={coupon.discount}
                      onChange={(evt) =>
                        setCoupon({ ...coupon, discount: evt.target.value })
                      }
                      name={"discount"}
                      className="form-control"
                      placeholder={"Discount"}
                    />
                  </div>

                  {/* minimum Amount */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      MINIMUM AMOUNT FOR APPLYING COUPON
                    </label>
                    <input
                      type="number"
                      value={coupon.minimumAmount}
                      onChange={(evt) =>
                        setCoupon({
                          ...coupon,
                          minimumAmount: evt.target.value,
                        })
                      }
                      name={"minimumAmount"}
                      className="form-control"
                      placeholder={"Minimum Amount For Coupon"}
                    />
                  </div>

                  {/* start Date */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      COUPON ACTIVATION DATE
                    </label>
                    <input
                      type="date"
                      value={date.format(
                        new Date(coupon.startDate),
                        "YYYY-MM-DD"
                      )}
                      onChange={(evt) =>
                        setCoupon({ ...coupon, startDate: evt.target.value })
                      }
                      name={"startDate"}
                      className="form-control"
                      placeholder={"Startting date"}
                    />
                  </div>

                  {/* Valid Upto */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      COUPON VALIDE DATE
                    </label>
                    <input
                      type="date"
                      value={
                        coupon.expiryDate
                          ? date.format(
                              new Date(coupon.expiryDate),
                              "YYYY-MM-DD"
                            )
                          : ""
                      }
                      onChange={(evt) =>
                        setCoupon({ ...coupon, expiryDate: evt.target.value })
                      }
                      name={"startDate"}
                      className="form-control"
                      placeholder={"Valid Upto"}
                    />
                  </div>

                  {/* Uses Times for USES */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      USES TIMES FOR USER
                    </label>
                    <input
                      type="NUMBER"
                      value={coupon.numberOfUsesTimes}
                      onChange={(evt) =>
                        setCoupon({
                          ...coupon,
                          numberOfUsesTimes: evt.target.value,
                        })
                      }
                      className="form-control"
                      placeholder={"1"}
                    />
                  </div>

                  {/* SELECT CATEGORY */}
                  <div className={"form-group col-md-6 overflow-none"}>
                    <label htmlFor="" className="text-dark h6 active">
                      SELECT CATEGORY
                    </label>
                    <div className="">
                      <Select
                        value={selectedCategories}
                        options={categories}
                        isMulti
                        onChange={(items) => {
                          setSelectedCategories(items);
                        }}
                      />
                    </div>
                  </div>

                  {/* SELECT SUB CATEGORY */}
                  <div className={"form-group col-md-6 overflow-none"}>
                    <label htmlFor="" className="text-dark h6 active">
                      SELECT SUB CATEGORY
                    </label>
                    <div className="">
                      <Select
                        value={selectedSubCategories}
                        options={subCategories}
                        isMulti
                        onChange={(items) => {
                          setSelectedSubCategories(items);
                        }}
                      />
                    </div>
                  </div>

                  {/* Coupon Status */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      COUPON STATUS
                    </label>
                    <select
                      name=""
                      id=""
                      value={coupon.status}
                      onChange={(evt) => {
                        setCoupon({ ...coupon, status: evt.target.value });
                      }}
                      className="form-control"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Disabled</option>
                    </select>
                  </div>
                </div>

                {/* Coupon Description */}
                <div className={"row shadow-sm bg-white mt-3 py-3"}>
                  <div className="col-md-12">
                    <h3 className={"my-3 text-info"}>Coupon Description</h3>
                    <Editor
                      apiKey="dxkecw9qym6pvb1b00a36jykem62593xto5hg5maqyksi233"
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      initialValue={editorValue}
                      onChange={(newValue, editor) => {
                        setCoupon({
                          ...coupon,
                          description: editor.getContent(),
                        });
                      }}
                      init={{
                        height: 150,

                        menubar: false,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                  </div>
                  <div className={"form-group col-md-12"}></div>
                  <div className={"form-group col-md-12"}>
                    <button
                      className="btn btn-info rounded px-3 py-2"
                      type={"submit"}
                    >
                      {isUpdateLoaded ? (
                        <div>
                          <i className="fas fa-refresh"></i> Update Coupon
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

export default EditCoupon;
