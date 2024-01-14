import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const TermsAndConditions = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [termsConditions, setTermsConditions] = useState(false);
  const [editorValue, setEditorValue] = useState(null);
  const editorRef = useRef(null);

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    let url = `${Config.SERVER_URL}/termsConditions`;
    if (termsConditions) {
      url += `/${formData._id}`;
    }
    let method = termsConditions ? "PUT" : "POST";

    let data = {
      title: formData.title,
      description: formData.description,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords,
    };

    fetch(url, {
      method: method,
      body: JSON.stringify(data),
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
            setTermsConditions(true);
            setFormData(result.body);
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

  // Get Data
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${Config.SERVER_URL}/termsConditions`);
        const result = await response.json();
        if (result.status === 200) {
          if (result.body) {
            setTermsConditions(true);
            setFormData(result.body);
            setEditorValue(result?.body?.description);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    getData();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb
          title={"TERMS & CONDITIONS"}
          pageTitle={"Terns & Conditions"}
        />

        {/* Add Coupon Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* TERMS & CONDITIONS CONTENTS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>
                    TERMS & CONDITIONS CONTENTS
                  </h3>
                </div>

                {/* ENTER TITLE */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER TITLE
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(evt) =>
                      setFormData({ ...formData, title: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter title"}
                  />
                </div>

                {/* ENTER DESCRIPTIONS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER DESCRIPTIONS
                  </label>
                  <Editor
                    apiKey="dxkecw9qym6pvb1b00a36jykem62593xto5hg5maqyksi233"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={editorValue}
                    // value={formData.description}
                    onChange={(newValue, editor) => {
                      setFormData({
                        ...formData,
                        description: editor.getContent(),
                      });
                    }}
                    init={{
                      height: 300,
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
              </div>

              {/* SEO DETAILS */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>SEO DETAILS</h3>
                </div>

                {/* ENTER SEO TITLE */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER SEO TITLE
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(evt) =>
                      setFormData({ ...formData, seoTitle: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter seo title"}
                  />
                </div>

                {/* ENTER SEO DESCRIPTION */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER SEO DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={formData.seoDescription}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        seoDescription: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter seo title"}
                  />
                </div>

                {/* ENTER SEO KEYWORDS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER SEO KEYWORDS
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        seoKeywords: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter seo keywords"}
                  />
                </div>

                <div className={"form-group col-md-12"}>
                  <button
                    disabled={loading}
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-plus"></i>{" "}
                        {termsConditions ? "Update" : "Submit"}
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

export default TermsAndConditions;
