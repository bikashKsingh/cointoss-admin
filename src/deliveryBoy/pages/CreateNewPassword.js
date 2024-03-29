import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { DeliveryBoyContext } from "../DeliveryBoyRouter";
import Config from "../../config/Config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function CreateNewPassword() {
  // History Initialization
  const history = useHistory();

  // Create State
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Use Context
  const { state, dispatch } = useContext(DeliveryBoyContext);

  // Submit Handler
  const createPasswordHandler = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    const { token } = JSON.parse(localStorage.getItem("resetPassword")) || {};

    if (!token) {
      toast.error("Somthing went wrong !");
      history.push("/deliveryBoy/login");
      return;
    }

    if (!password || !cPassword) {
      toast.error("Enter the Password !");
      setLoading(false);
      return;
    }

    if (password !== cPassword) {
      toast.error("Confirm Password is not Same !");
      setLoading(false);
      return;
    }

    const formData = {
      password,
      cPassword,
    };
    try {
      const response = await fetch(
        Config.SERVER_URL + "/deliveryBoys/createNewPassword",
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        if (result.message) toast.success(result.message);
        localStorage.removeItem("resetPassword");
        history.push("/deliveryBoy/login");
      } else {
        if (result?.errors?.password) toast.error(result?.errors?.password);
        if (result?.errors?.cPassword) toast.error(result?.errors?.cPassword);
        if (result?.message) toast.error(result?.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  return (
    <div className={"container-fluid pt-5"} style={{ height: "100vh" }}>
      <div className={"row"} style={{ paddingTop: "10%" }}>
        <div className={"col-md-4 m-auto"}>
          <div className={"card shadow-sm bg-white rounded-0 border-0"}>
            <div className={"card-body"}>
              <div className={"text-center mb-3"}>
                <img
                  className={"img img-fluid"}
                  src={"/assets/images/logo.png"}
                  style={{ height: "70px" }}
                />
                <h4 className={"form-heading"}>Create New Password</h4>
              </div>
              <form
                onSubmit={createPasswordHandler}
                className={"form-material"}
              >
                <div className={"form-group"}>
                  <div className={"form-group mb-4"}>
                    <input
                      type="password"
                      value={password}
                      onChange={(evt) => setPassword(evt.target.value)}
                      className="form-control"
                      placeholder={"Enter Password"}
                    />
                  </div>

                  <div className={"form-group mb-4"}>
                    <input
                      type="password"
                      value={cPassword}
                      onChange={(evt) => setCPassword(evt.target.value)}
                      className="form-control"
                      placeholder={"Confirm Password"}
                    />
                  </div>

                  <div className={"text-center"}>
                    <button
                      disabled={loading}
                      className={"btn btn-info shadow-sm form-btn"}
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <div>
                          <i className="fas fa-sign-in"></i> Create
                        </div>
                      )}
                    </button>
                  </div>

                  <div className={"mt-3"}>
                    <Link to={"/deliveryBoy/login"}>Back to Login?</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateNewPassword;
