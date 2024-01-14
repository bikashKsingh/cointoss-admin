import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [regOfficeAddress, setRegOfficeAddress] = useState(null);
  const [branchOfficeAddress, setBranchOfficeAddress] = useState(null);
  const [factoryAddress, setFactoryAddress] = useState(null);

  const [contactUs, setContactUs] = useState(false);
  const [editorValue, setEditorValue] = useState(null);
  const editorRef = useRef(null);

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    let url = `${Config.SERVER_URL}/contactUs`;
    if (contactUs) {
      url += `/${formData._id}`;
    }
    let method = contactUs ? "PUT" : "POST";

    let data = {
      title: formData.title,
      description: formData.description,
      googleMapUrl: formData.googleMapUrl,
      mobileNumber: formData.mobileNumber,
      inquiryNumber: formData.inquiryNumber,
      supportNumber: formData.supportNumber,
      whatsApp: formData.whatsApp,
      supportEmail: formData.supportEmail,
      inquiryEmail: formData.inquiryEmail,

      regOfficeAddress,
      branchOfficeAddress,
      factoryAddress,

      facebook: formData.facebook,
      instagram: formData.instagram,
      twitter: formData.twitter,
      linkedin: formData.linkedin,
      youtube: formData.youtube,
      pintrest: formData.pintrest,

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
            setContactUs(true);
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
        const response = await fetch(`${Config.SERVER_URL}/contactUs`);
        const result = await response.json();
        if (result.status === 200) {
          if (result.body) {
            console.log(result.body);
            setContactUs(true);
            setFormData(result.body);
            setEditorValue(result?.body?.description);
            setRegOfficeAddress(result?.body?.regOfficeAddress || null);
            setBranchOfficeAddress(result?.body?.branchOfficeAddress || null);
            setFactoryAddress(result?.body?.factoryAddress || null);
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
        <Breadcrumb title={"CONTACT US"} pageTitle={"Contact Us"} />

        {/* Add Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* CONTACT US DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>CONTACT US DETAILS</h3>
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

                {/* GOOGLE MAP URL */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    GOOGLE MAP URL
                  </label>
                  <input
                    type="text"
                    value={formData.googleMapUrl}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        googleMapUrl: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter google map url"}
                  />
                </div>

                {/* MOBILE NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MOBILE NUMBER
                  </label>
                  <input
                    type="text"
                    value={formData.mobileNumber}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        mobileNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter mobile number"}
                  />
                </div>

                {/* INQUIRY NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    INQUIRY NUMBER
                  </label>
                  <input
                    type="text"
                    value={formData.inquiryNumber}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        inquiryNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter inquiry number"}
                  />
                </div>

                {/* CUSTOMER SUPPORT NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CUSTOMER SUPPORT NUMBER
                  </label>
                  <input
                    type="text"
                    value={formData.supportNumber}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        supportNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter support number"}
                  />
                </div>

                {/* WHATSAPP NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    WHATSAPP NUMBER
                  </label>
                  <input
                    type="text"
                    value={formData.whatsApp}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        whatsApp: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter whatsapp number"}
                  />
                </div>

                {/* INQUIRY EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    INQUIRY EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.inquiryEmail}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        inquiryEmail: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter inquiry email"}
                  />
                </div>

                {/* SUPPORT EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SUPPORT EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        supportEmail: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter support email"}
                  />
                </div>
              </div>

              {/* REGISTER OFFICE ADDRESS */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>REGISTER OFFICE ADDRESS</h3>
                </div>
                {/* MOBILE NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MOBILE NUMBER
                  </label>
                  <input
                    type="text"
                    value={regOfficeAddress?.mobileNumber}
                    onChange={(evt) =>
                      setRegOfficeAddress({
                        ...regOfficeAddress,
                        mobileNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter mobile number"}
                  />
                </div>

                {/* LANDLINE NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    LANDLINE NUMBER
                  </label>
                  <input
                    type="text"
                    value={regOfficeAddress?.landlineNumber}
                    onChange={(evt) =>
                      setRegOfficeAddress({
                        ...regOfficeAddress,
                        landlineNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter landline number"}
                  />
                </div>

                {/* EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={regOfficeAddress?.email}
                    onChange={(evt) =>
                      setRegOfficeAddress({
                        ...regOfficeAddress,
                        email: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter email address"}
                  />
                </div>

                {/* ADDRESS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ADDRESS
                  </label>
                  <input
                    type="text"
                    value={regOfficeAddress?.address}
                    onChange={(evt) =>
                      setRegOfficeAddress({
                        ...regOfficeAddress,
                        address: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter address"}
                  />
                </div>
              </div>

              {/* BRANCH OFFICE ADDRESS */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>BRANCH OFFICE ADDRESS</h3>
                </div>
                {/* MOBILE NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MOBILE NUMBER
                  </label>
                  <input
                    type="text"
                    value={branchOfficeAddress?.mobileNumber}
                    onChange={(evt) =>
                      setBranchOfficeAddress({
                        ...branchOfficeAddress,
                        mobileNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter mobile number"}
                  />
                </div>

                {/* LANDLINE NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    LANDLINE NUMBER
                  </label>
                  <input
                    type="text"
                    value={branchOfficeAddress?.landlineNumber}
                    onChange={(evt) =>
                      setBranchOfficeAddress({
                        ...branchOfficeAddress,
                        landlineNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter landline number"}
                  />
                </div>

                {/* EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={branchOfficeAddress?.email}
                    onChange={(evt) =>
                      setBranchOfficeAddress({
                        ...branchOfficeAddress,
                        email: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter email address"}
                  />
                </div>

                {/* ADDRESS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ADDRESS
                  </label>
                  <input
                    type="text"
                    value={branchOfficeAddress?.address}
                    onChange={(evt) =>
                      setBranchOfficeAddress({
                        ...branchOfficeAddress,
                        address: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter address"}
                  />
                </div>
              </div>

              {/* FACTORY ADDRESS */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>FACTORY ADDRESS</h3>
                </div>
                {/* MOBILE NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MOBILE NUMBER
                  </label>
                  <input
                    type="text"
                    value={factoryAddress?.mobileNumber}
                    onChange={(evt) =>
                      setFactoryAddress({
                        ...factoryAddress,
                        mobileNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter mobile number"}
                  />
                </div>

                {/* LANDLINE NUMBER */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    LANDLINE NUMBER
                  </label>
                  <input
                    type="text"
                    value={factoryAddress?.landlineNumber}
                    onChange={(evt) =>
                      setFactoryAddress({
                        ...factoryAddress,
                        landlineNumber: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter landline number"}
                  />
                </div>

                {/* EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={factoryAddress?.email}
                    onChange={(evt) =>
                      setFactoryAddress({
                        ...factoryAddress,
                        email: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter email address"}
                  />
                </div>

                {/* ADDRESS */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ADDRESS
                  </label>
                  <input
                    type="text"
                    value={factoryAddress?.address}
                    onChange={(evt) =>
                      setFactoryAddress({
                        ...factoryAddress,
                        address: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter address"}
                  />
                </div>
              </div>

              {/* SOCIAL MEDIA DETAILS */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>SOCIAL MEDIA DETAILS</h3>
                </div>
                {/* FACEBOOK PROFILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    FACEBOOK PROFILE
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(evt) =>
                      setFormData({ ...formData, facebook: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter facebook profile url"}
                  />
                </div>
                {/* INSTAGRAM PROFILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    INSTAGRAM PROFILE
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        instagram: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter instagram profile url"}
                  />
                </div>
                {/* TWITTER PROFILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    TWITTER PROFILE
                  </label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        twitter: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter twitter profile url"}
                  />
                </div>
                {/* YOUTUBE PROFILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    YOUTUBE PROFILE
                  </label>
                  <input
                    type="text"
                    value={formData.youtube}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        youtube: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter youtube profile url"}
                  />
                </div>
                {/* LINKEDIN PROFILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    LINKEDIN PROFILE
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        linkedin: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter linkedin profile url"}
                  />
                </div>
                {/* PINTREST PROFILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PINTREST PROFILE
                  </label>
                  <input
                    type="text"
                    value={formData.pintrest}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        pintrest: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter pintrest profile url"}
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
                        {contactUs ? "Update" : "Submit"}
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

export default ContactUs;
