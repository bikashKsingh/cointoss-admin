import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { initialState, supervisorReducer } from "../reducer/SupervisorReducer";

import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import EnterOtp from "./pages/EnterOtp";
import CreateNewPassword from "./pages/CreateNewPassword";
import Footer from "./Footer";
import Profile from "./pages/Profile";

// import Profile from "./pages/Profile";
// import PageNoteFound from "./pages/PageNotFound";

// ================   Products  =====================
// import AddProduct from "./pages/products/AddProduct";
import ProductList from "./pages/products/ProductList";
// import EditProduct from "./pages/products/EditProduct";
// import AddProductFromCSV from "./pages/products/AddProductFromCSV";
// import EditProductFromCSV from "./pages/products/EditProductFromCSV";

// ================   Coupons  =====================
// import AddCoupon from "./pages/coupons/AddCoupon";
// import CouponList from "./pages/coupons/CouponList";
// import EditCoupon from "./pages/coupons/EditCoupon";
// import EditCouponFromCSV from "./pages/coupons/EditCouponFromCSV";
// import AddCouponFromCSV from "./pages/coupons/AddCouponFromCSV";

// ================   Occasions  =====================
// import AddOccasion from "./pages/occasions/AddOccasion";
// import OccasionList from "./pages/occasions/OccasionList";
// import EditOccasion from "./pages/occasions/EditOccasion";
// import EditOccasionFromCSV from "./pages/occasions/EditOccasionFromCSV";
// import AddOccasionFromCSV from "./pages/occasions/AddOccasionFromCSV";

// ================   Pincodes  =====================
// import PincodeList from "./pages/pincode/PincodeList";
// import AddPincode from "./pages/pincode/AddPincode";
// import EditPincode from "./pages/pincode/EditPincode";
// import EditPincodeFromCSV from "./pages/pincode/EditPincodeFromCSV";
// import AddPincodeFromCSV from "./pages/pincode/AddPincodeFromCSV";

// ================   Areas  =====================
// import AreaList from "./pages/areas/AreaList";
// import AddArea from "./pages/areas/AddArea";
// import EditArea from "./pages/areas/EditArea";
// import AddAreaFromCSV from "./pages/areas/AddAreaFromCSV";
// import EditPincodeFromCSV from "./pages/pincode/EditPincodeFromCSV";

// Orders
import OrderDetails from "./pages/orders/OrderDetails";
import OrderList from "./pages/orders/OrderList";

// Delivery Areas
import DeliveryAreaList from "./pages/deliveryAreas/DeliveryAreaList";

// Category
// import CategoryList from "./pages/category/CategoryList";
// import AddCategory from "./pages/category/AddCategory";
// import EditCategory from "./pages/category/EditCategory";
// import AddCategoryFromCSV from "./pages/category/AddCategoryFromCSV";
// import EditCategoryFromCSV from "./pages/category/EditCategoryFromCSV";

// Newsletter
// import NewsletterList from "./pages/newsletters/NewsletterList";
// import AddNewsletter from "./pages/newsletters/AddNewsletter";
// import EditNewsletter from "./pages/newsletters/EditNewsletter";
// import AddNewsletterFromCSV from "./pages/newsletters/AddNewsletterFromCSV";
// import EditNewsletterFromCSV from "./pages/newsletters/EditNewsletterFromCSV";

// Customer
import CustomerList from "./pages/customers/CustomerList";
import EditCustomer from "./pages/customers/EditCustomer";
import CustomerDetails from "./pages/customers/CustomerDetails";

// Supervisor
// import SupervisorList from "./pages/supervisors/SupervisorList";
// import AddSupervisor from "./pages/supervisors/AddSupervisor";
// import EditSupervisor from "./pages/supervisors/EditSupervisor";
// import SupervisorDashboard from "./pages/supervisors/SupervisorDashboard";
// import SupervisorDeliveryBoys from "./pages/supervisors/SupervisorDeliveryBoys";
// import AssignPincodes from "./pages/supervisors/AssignPincodes";
// import AssignDeliveryBoys from "./pages/supervisors/AssignDeliveryBoys";
// import SupervisorPincodeList from "./pages/supervisors/SupervisorPincodeList";

// Delivery Boy
import DeliveryBoyList from "./pages/deliveryBoys/DeliveryBoyList";
import DeliveryBoyAreas from "./pages/deliveryBoys/DeliveryBoyAreas";

// Bucket List
import BucketList from "./pages/buckets/BucketList";

// Subscription
import SubscriptionsList from "./pages/subscriptions/SubscriptionsList";
import SubscriptionDetails from "./pages/subscriptions/SubscriptionDetails";
import SubscriptionForDelivery from "./pages/subscriptions/SubscriptionForDelivery";
import AssignDeliveryAreas from "./pages/deliveryBoys/AssignDeliveryAreas";
import BucketDetails from "./pages/buckets/BucketDetails";

// Create Context
export const SupervisorContext = createContext();

// Create Context
const Routing = () => {
  const history = useHistory();
  // Branch Context
  const { state, dispatch } = useContext(SupervisorContext);
  useEffect(() => {
    const supervisor = JSON.parse(localStorage.getItem("supervisor"));
    if (supervisor) {
      dispatch({ type: "SUPERVISOR", payload: supervisor });
      // history.push("/")
    } else {
      history.push("/supervisor/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/supervisor" component={Dashboard} />
      <Route exact path="/supervisor/login" component={Login} />
      <Route
        exact
        path="/supervisor/forgot-password"
        component={ForgotPassword}
      />
      <Route exact path="/supervisor/enter-otp" component={EnterOtp} />
      <Route
        exact
        path="/supervisor/create-password"
        component={CreateNewPassword}
      />
      <Route exact path="/supervisor/profile" component={Profile} />

      {/* Products */}
      <Route exact path="/supervisor/products" component={ProductList} />

      {/* Buckets */}
      <Route exact path="/supervisor/buckets" component={BucketList} />
      <Route
        exact
        path="/supervisor/bucket/details/:id"
        component={BucketDetails}
      />

      {/* Orders */}
      <Route exact path="/supervisor/orders" component={OrderList} />
      <Route
        exact
        path="/supervisor/order/details/:id"
        component={OrderDetails}
      />

      {/*  Pincode */}
      {/* <Route exact path="/supervisor/pincodes" component={PincodeList} />
      <Route exact path="/supervisor/pincode/add" component={AddPincode} />
      <Route
        exact
        path="/supervisor/pincode/addByCSV"
        component={AddPincodeFromCSV}
      />
      <Route
        exact
        path="/supervisor/pincode/editByCSV"
        component={EditPincodeFromCSV}
      />
      <Route
        exact
        path="/supervisor/pincode/edit/:id"
        component={EditPincode}
      /> */}

      {/*  Areas */}
      {/* <Route exact path="/supervisor/areas" component={AreaList} />
      <Route exact path="/supervisor/area/add" component={AddArea} />
      <Route
        exact
        path="/supervisor/area/addByCSV"
        component={AddAreaFromCSV}
      /> */}
      {/* <Route
        exact
        path="/supervisor/pincode/editByCSV"
        component={EditPincodeFromCSV}
      /> */}
      {/* <Route exact path="/supervisor/area/edit/:id" component={EditArea} /> */}

      {/* Supervisor */}
      {/* <Route exact path="/supervisor/supervisors" component={SupervisorList} />
      <Route
        exact
        path="/supervisor/supervisor/add"
        component={AddSupervisor}
      />
      <Route
        exact
        path="/supervisor/supervisor/edit/:id"
        component={EditSupervisor}
      />
      <Route
        exact
        path="/supervisor/supervisor/dashboard/:id"
        component={SupervisorDashboard}
      />
      <Route
        exact
        path="/supervisor/supervisor/assignPincodes/:id"
        component={AssignPincodes}
      />
      <Route
        exact
        path="/supervisor/supervisor/assignDeliveryBoys/:id"
        component={AssignDeliveryBoys}
      />
      <Route
        exact
        path="/supervisor/supervisor/deliveryBoys/:id"
        component={SupervisorDeliveryBoys}
      />

      <Route
        exact
        path="/supervisor/supervisor/pincodes/:id"
        component={SupervisorPincodeList}
      /> */}

      {/* Delivery boys */}
      <Route
        exact
        path="/supervisor/deliveryBoys"
        component={DeliveryBoyList}
      />
      <Route
        exact
        path="/supervisor/deliveryBoy/deliveryAreas/:id"
        component={DeliveryBoyAreas}
      />
      <Route
        exact
        path="/supervisor/deliveryBoy/assignDeliveryAreas/:id"
        component={AssignDeliveryAreas}
      />

      {/* Delivery Areas */}
      <Route
        exact
        path="/supervisor/deliveryAreas"
        component={DeliveryAreaList}
      />

      {/* Customer */}
      <Route exact path="/supervisor/customers" component={CustomerList} />
      <Route
        exact
        path="/supervisor/customer/edit/:id"
        component={EditCustomer}
      />
      <Route
        exact
        path="/supervisor/customer/details/:id"
        component={CustomerDetails}
      />
      {/* <Route exact path="/supervisor/report/customers" component={CustomerReports} /> */}

      {/* Subscriptions */}
      <Route
        exact
        path="/supervisor/subscriptions"
        component={SubscriptionsList}
      />
      <Route
        exact
        path="/supervisor/subscription/details/:id"
        component={SubscriptionDetails}
      />
      <Route
        exact
        path="/supervisor/subscriptionsForDelivery"
        component={SubscriptionForDelivery}
      />
    </Switch>
  );
};

const SupervisorRouter = () => {
  const [state, dispatch] = useReducer(supervisorReducer, initialState);
  return (
    <div id="main-wrapper">
      <SupervisorContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />

          <Routing />
          <Footer />
        </Router>
      </SupervisorContext.Provider>
    </div>
  );
};

export default SupervisorRouter;
