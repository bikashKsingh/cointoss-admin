import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import {
  initialState,
  deliveryBoyReducer,
} from "../reducer/DeliveryBoyReducer";

import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import EnterOtp from "./pages/EnterOtp";
import CreateNewPassword from "./pages/CreateNewPassword";
import Footer from "./Footer";
import Profile from "./pages/Profile";

// Orders
import OrderDetails from "./pages/orders/OrderDetails";
import OrderList from "./pages/orders/OrderList";

// Delivery Areas
import DeliveryAreaList from "./pages/deliveryAreas/DeliveryAreaList";

// Customer
import CustomerList from "./pages/customers/CustomerList";
import EditCustomer from "./pages/customers/EditCustomer";
import CustomerDetails from "./pages/customers/CustomerDetails";

// Subscription
import SubscriptionsList from "./pages/subscriptions/SubscriptionsList";
import SubscriptionDetails from "./pages/subscriptions/SubscriptionDetails";
import SubscriptionForDelivery from "./pages/subscriptions/SubscriptionForDelivery";
import SubscriptionReports from "./pages/subscriptions/SubscriptionReports";
import DeliveryReports from "./pages/reports/DeliveryReports";

// Create Context
export const DeliveryBoyContext = createContext();

// Create Context
const Routing = () => {
  const history = useHistory();
  // Branch Context
  const { state, dispatch } = useContext(DeliveryBoyContext);
  useEffect(() => {
    const deliveryBoy = JSON.parse(localStorage.getItem("deliveryBoy"));
    if (deliveryBoy) {
      dispatch({ type: "DELIVERY_BOY", payload: deliveryBoy });
      // history.push("/")
    } else {
      history.push("/deliveryBoy/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/deliveryBoy" component={Dashboard} />
      <Route exact path="/deliveryBoy/login" component={Login} />
      <Route
        exact
        path="/deliveryBoy/forgot-password"
        component={ForgotPassword}
      />
      <Route exact path="/deliveryBoy/enter-otp" component={EnterOtp} />
      <Route
        exact
        path="/deliveryBoy/create-password"
        component={CreateNewPassword}
      />
      <Route exact path="/deliveryBoy/profile" component={Profile} />
      {/* Orders */}
      <Route exact path="/deliveryBoy/orders" component={OrderList} />
      <Route
        exact
        path="/deliveryBoy/order/details/:id"
        component={OrderDetails}
      />
      {/* Delivery Areas */}
      <Route
        exact
        path="/deliveryBoy/deliveryAreas"
        component={DeliveryAreaList}
      />
      {/* Customer */}
      <Route exact path="/deliveryBoy/customers" component={CustomerList} />
      <Route
        exact
        path="/deliveryBoy/customer/edit/:id"
        component={EditCustomer}
      />
      <Route
        exact
        path="/deliveryBoy/customer/details/:id"
        component={CustomerDetails}
      />
      {/* <Route exact path="/deliveryBoy/report/customers" component={CustomerReports} /> */}
      {/* Subscriptions */}
      <Route
        exact
        path="/deliveryBoy/subscriptions"
        component={SubscriptionsList}
      />
      <Route
        exact
        path="/deliveryBoy/subscription/details/:id"
        component={SubscriptionDetails}
      />
      <Route
        exact
        path="/deliveryBoy/subscriptionsForDelivery"
        component={SubscriptionForDelivery}
      />
      <Route
        exact
        path="/deliveryBoy/subscriptionReports"
        component={SubscriptionReports}
      />{" "}
      <Route
        exact
        path="/deliveryBoy/deliveryReports"
        component={DeliveryReports}
      />
    </Switch>
  );
};

const SupervisorRouter = () => {
  const [state, dispatch] = useReducer(deliveryBoyReducer, initialState);
  return (
    <div id="main-wrapper">
      <DeliveryBoyContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />
          <Routing />
          <Footer />
        </Router>
      </DeliveryBoyContext.Provider>
    </div>
  );
};

export default SupervisorRouter;
