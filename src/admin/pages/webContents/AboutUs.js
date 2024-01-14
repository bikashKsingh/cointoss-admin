import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const AboutUs = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [aboutUs, setAboutUs] = useState(false);
  const [desEditorValue, setDesEditorValue] = useState(null);
  const [missionDesEditorValue, setMissionDesEditorValue] = useState(null);
  const [visionDesEditorValue, setVisionDesEditorValue] = useState(null);
  const editorRef = useRef(null);

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    let url = `${Config.SERVER_URL}/aboutUs`;
    if (aboutUs) {
      url += `/${formData._id}`;
    }
    let method = aboutUs ? "PUT" : "POST";

    let data = {
      title: formData.title,
      description: formData.description,
      missionTitle: formData.missionTitle,
      missionDescription: formData.missionDescription,
      visionTitle: formData.visionTitle,
      visionDescription: formData.visionDescription,
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
            setAboutUs(true);
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
        const response = await fetch(`${Config.SERVER_URL}/aboutUs`);
        const result = await response.json();
        if (result.status === 200) {
          if (result.body) {
            setAboutUs(true);
            setFormData(result.body);
            setDesEditorValue(result?.body?.description);
            setMissionDesEditorValue(result?.body?.missionDescription);
            setVisionDesEditorValue(result?.body?.visionDescription);
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
        <Breadcrumb title={"ABOUT US"} pageTitle={"About Us"} />

        {/* Add Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* ABOUT US DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>ABOUT US DETAILS</h3>
                </div>

                {/* TITLE */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    TITLE
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

                {/* DESCRIPTIONS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    DESCRIPTIONS
                  </label>
                  <Editor
                    apiKey="dxkecw9qym6pvb1b00a36jykem62593xto5hg5maqyksi233"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={desEditorValue}
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

              {/* MISSION DETAILS */}
              <div className={"row shadow-sm bg-white py-3 MT-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>MISSION DETAILS</h3>
                </div>

                {/* MISSION TITLE */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MISSION TITLE
                  </label>
                  <input
                    type="text"
                    value={formData.missionTitle}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        missionTitle: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter mission title"}
                  />
                </div>

                {/* MISSION DESCRIPTIONS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MISSION DESCRIPTIONS
                  </label>
                  <Editor
                    apiKey="dxkecw9qym6pvb1b00a36jykem62593xto5hg5maqyksi233"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={missionDesEditorValue}
                    // value={formData.description}
                    onChange={(newValue, editor) => {
                      setFormData({
                        ...formData,
                        missionDescription: editor.getContent(),
                      });
                    }}
                    init={{
                      height: 200,
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

              {/* VISION DETAILS */}
              <div className={"row shadow-sm bg-white py-3 MT-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>VISION DETAILS</h3>
                </div>

                {/* VISION TITLE */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    VISION TITLE
                  </label>
                  <input
                    type="text"
                    value={formData.visionTitle}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        visionTitle: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter mission title"}
                  />
                </div>

                {/* VISION DESCRIPTIONS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    VISION DESCRIPTIONS
                  </label>
                  <Editor
                    apiKey="dxkecw9qym6pvb1b00a36jykem62593xto5hg5maqyksi233"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={visionDesEditorValue}
                    // value={formData.description}
                    onChange={(newValue, editor) => {
                      setFormData({
                        ...formData,
                        visionDescription: editor.getContent(),
                      });
                    }}
                    init={{
                      height: 200,
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
                        {aboutUs ? "Update" : "Submit"}
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

export default AboutUs;
