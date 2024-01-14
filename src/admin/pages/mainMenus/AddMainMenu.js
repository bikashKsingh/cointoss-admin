import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";

const AddMainMenu = () => {
  const history = useHistory();
  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    menuType: "SINGLE",
  });

  const [inputFields, setInputFields] = useState([]);
  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };

  const addFields = () => {
    let newfield = { title: "", slug: "" };
    setInputFields([...inputFields, newfield]);
  };

  const removeFields = (index) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  };

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    fetch(Config.SERVER_URL + "/mainMenus", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        subMenus: inputFields,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
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
        <Breadcrumb title="MAIN MENU" pageTitle={"Add Menu Item"} />

        {/* Add Flavour Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* MAIN MENU EMAIL */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>MAIN MENU</h3>
                </div>

                {/* MENU ITEM TITLE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MENU ITEM TITLE !
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(evt) =>
                      setFormData({ ...formData, title: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"home"}
                  />
                </div>

                {/* MENU ITEM SLUG */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MENU ITEM SLUG !
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(evt) =>
                      setFormData({ ...formData, slug: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"/home"}
                  />
                </div>

                {/* MENU ITEM TYPE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MENU ITEM TYPE !
                  </label>
                  <select
                    className="form-control"
                    name=""
                    id=""
                    value={formData.menuType}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        menuType: event.target.value,
                      });
                    }}
                  >
                    {/* <option value="MEGAMENU">MEGAMENU</option> */}
                    <option value="LIST">LIST</option>
                    <option value="SINGLE">SINGLE</option>
                  </select>
                </div>

                {/* If menu type is LIST */}

                {formData.menuType === "LIST" ? (
                  <>
                    <div className="col-md-12 d-flex align-items-center gap-3">
                      <h3 className={"my-3 text-info"}>SUB MENU</h3>
                      <div className="">
                        <button
                          className="btn btn-info ml-3"
                          type="button"
                          onClick={addFields}
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                    {inputFields.map((input, index) => {
                      return (
                        <div className="col-md-12">
                          <div className="row">
                            {/* MENU ITEM TITLE */}
                            <div
                              className={
                                "form-group col-md-5 col-sm-5 col-xsm-5"
                              }
                            >
                              <input
                                type="text"
                                name={"title"}
                                value={input.title}
                                onChange={(event) =>
                                  handleFormChange(index, event)
                                }
                                className="form-control"
                                placeholder={"Enter Title"}
                              />
                            </div>

                            {/* MENU ITEM SLUG */}
                            <div
                              className={
                                "form-group col-md-5 col-sm-5 col-xsm-5"
                              }
                            >
                              <input
                                type="text"
                                name="slug"
                                value={input.slug}
                                onChange={(event) =>
                                  handleFormChange(index, event)
                                }
                                className="form-control"
                                placeholder={"Enter Slug"}
                              />
                            </div>

                            <div className="col-md-2 col-sm-2 col-xsm-2">
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeFields(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : null}

                {/* Add Button */}
                <div className={"form-group col-md-12"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Menu Item
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

export default AddMainMenu;
