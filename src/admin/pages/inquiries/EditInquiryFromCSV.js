import Papa from "papaparse";
import React, { useState, useEffect } from "react";
import Config from "../../../config/Config";
import M from "materialize-css";
import Breadcrumb from "../../components/Breadcrumb";
import { CSVLink } from "react-csv";
import { updateInquiry } from "../../helpers/csvHelper";

const EditInquiryFromCSV = () => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [isAllRecordLoaded, setIsAllRecordLoaded] = useState(true);

  const [tableHeaders, setTableHeaders] = useState(updateInquiry.headers);
  const [tableData, setTableData] = useState([]);

  const fileChangeHandler = (event) => {
    const files = event.target.files;
    if (files) {
      Papa.parse(event.target.files[0], {
        complete: async (results) => {
          let keys = results.data[0];
          // I want to remove some óíúáé, blan spaces, etc
          keys = results.data[0].map((v) =>
            v
              // .toLowerCase()
              .replace(/ /g, "_")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
          let values = results.data.slice(1);
          let objects = values.map((array) => {
            let object = {};
            keys.forEach((key, i) => (object[key] = array[i]));
            return object;
          });
          // Now I call to my API and everything goes ok

          // Get data from array and call the api
          objects.map((item, i) => {
            if (item.id != "") {
              submitHandler(item);
            }
          });
        },
      });
    }
  };

  // Update Submit Handler
  const submitHandler = (data) => {
    const updateData = {
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      message: data.message,
      inquiryStatus: data.inquiryStatus,
      status: data?.status?.toLowerCase(),
    };
    fetch(`${Config.SERVER_URL}/inquires/${data.id}`, {
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
            // M.toast({ html: result.message, classes: "bg-success" });
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              M.toast({ html: result.errors[key], classes: "bg-danger" });
            });
          }
          setUploaded((old) => {
            return [
              ...old,
              {
                name: result.body.name || "",
                message: result.message || result.errors.message,
              },
            ];
          });
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get data from database
  useEffect(() => {
    setIsAllRecordLoaded(false);
    fetch(`${Config.SERVER_URL}/inquires?status=All`, {
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
            const dataArray = [];
            result.body.map((item, index) => {
              let data = {
                id: item._id,
                name: item.name,
                mobile: item.mobile,
                email: item.email,
                message: item.message,
                inquiryStatus: item.inquiryStatus,
                status: item?.status?.toString(),
              };

              dataArray.push(data);
            });
            setTableData(dataArray);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsAllRecordLoaded(true);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllRecordLoaded(true);
        }
      );
  }, []);

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className="container-fluid">
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        <Breadcrumb title={"INQUIRES"} pageTitle={"Update Inquires"} />

        {/* Add Color Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              //   onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Newsletter Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12 d-flex justify-content-between">
                  <h3 className={"my-3 text-info"}>Upload CSV File</h3>
                  <div className="">
                    {isAllRecordLoaded ? (
                      <CSVLink
                        className="btn btn-info"
                        data={tableData}
                        headers={tableHeaders}
                        filename="inquiries.csv"
                      >
                        Download CSV Format
                      </CSVLink>
                    ) : (
                      <button className="btn btn-info" type="button">
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading..
                      </button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className={"form-group col-md-6"}>
                  <input
                    type="file"
                    onChange={fileChangeHandler}
                    className="form-control"
                  />
                </div>
                <div className={"form-group col-md-6"}>
                  {uploadLoading ? (
                    <div className={"bg-white p-3 text-center"}>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading..
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-md-11 mx-auto">
            <div className={"row shadow-sm bg-white py-3"}>
              <div className="col-md-12">
                {uploaded.map((item, index) => {
                  return (
                    <div className="card card-body">
                      {" "}
                      {item.name} {item.message}{" "}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInquiryFromCSV;
