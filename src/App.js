import React from "react";

// import User from './components/user/User'
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useParams,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import leftNavigation from './components/user/LeftNavigation'
import AdminRouter from "./admin/AdminRouter";
import Branch from "./components/branch/Branch";
import SupervisorRouter from "./supervisor/SupervisorRouter";
import DeliveryBoyRouter from "./deliveryBoy/DeliveryBoyRouter";
// import Vendor from "./components/vendor/Vendor";
// import Website from "./components/web/Website";
// import Student from "./components/student/Student";
// import Staff from "./components/staff/StaffRoutes";

function App(props) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/admin"} component={AdminRouter} />
        <Route path={"/branch"} component={Branch} />
        <Route path={"/supervisor"} component={SupervisorRouter} />
        <Route path={"/deliveryBoy"} component={DeliveryBoyRouter} />
        {/* <Route path={"/vendor"} component={Vendor} /> */}
        {/* <Route path={"/student"} component={Student} /> */}
        {/* <Route path={"/staff"} component={Staff} /> */}
        {/* <Route path={"/"} component={Website} /> */}
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
