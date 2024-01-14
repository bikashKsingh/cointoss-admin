import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import { initialState, adminReducer } from "../reducer/AdminReducer";

// import PageNoteFound from "./pages/PageNotFound";

// ================   Admin  =====================
import Profile from "./pages/Profile";

// ================   Settings  =====================
import Setting from "./pages/setting/Setting";

// ================   Reviews  =====================
import ReviewList from "./pages/reviews/ReviewList";
import EditReview from "./pages/reviews/EditReview";

// ================   Coupons  =====================
import AddCoupon from "./pages/coupons/AddCoupon";
import CouponList from "./pages/coupons/CouponList";
import EditCoupon from "./pages/coupons/EditCoupon";
import EditCouponFromCSV from "./pages/coupons/EditCouponFromCSV";
import AddCouponFromCSV from "./pages/coupons/AddCouponFromCSV";

// Newsletter
import NewsletterList from "./pages/newsletters/NewsletterList";
import AddNewsletter from "./pages/newsletters/AddNewsletter";
import EditNewsletter from "./pages/newsletters/EditNewsletter";
import AddNewsletterFromCSV from "./pages/newsletters/AddNewsletterFromCSV";
import EditNewsletterFromCSV from "./pages/newsletters/EditNewsletterFromCSV";

// Testimonials
import TestimonialList from "./pages/testimonials/TestimonialList";
import AddTestimonial from "./pages/testimonials/AddTestimonial";
import EditTestimonial from "./pages/testimonials/EditTestimonial";
import AddTestimonialFromCSV from "./pages/testimonials/AddTestimonialFromCSV";
import EditTestimonialFromCSV from "./pages/testimonials/EditTestimonialFromCSV";

// Customer
import CustomerList from "./pages/customers/CustomerList";
import EditCustomer from "./pages/customers/EditCustomer";
import CustomerDetails from "./pages/customers/CustomerDetails";

import ForgotPassword from "./pages/ForgotPassword";
import EnterOtp from "./pages/EnterOtp";
import CreateNewPassword from "./pages/CreateNewPassword";
import Footer from "./Footer";

import AddInquires from "./pages/inquiries/AddInquires";
import InquiryList from "./pages/inquiries/InquiryList";
import EditInquiry from "./pages/inquiries/EditInquiry";
import MainMenuList from "./pages/mainMenus/MainMenuList";
import AddMainMenu from "./pages/mainMenus/AddMainMenu";
import EditMainMenu from "./pages/mainMenus/EditMainMenu";
import AddInquiryFromCSV from "./pages/inquiries/AddInquiryFromCSV";
import EditInquiryFromCSV from "./pages/inquiries/EditInquiryFromCSV";
import PrivacyPolicy from "./pages/webContents/PrivacyPolicy";
import TermsConditions from "./pages/webContents/TermsAndConditions";
import ContactUs from "./pages/webContents/ContactUs";
import AboutUs from "./pages/webContents/AboutUs";

// Create Context
export const AdminContext = createContext();

// Create Context
const Routing = () => {
  const history = useHistory();
  // Branch Context
  const { state, dispatch } = useContext(AdminContext);
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      dispatch({ type: "ADMIN", payload: admin });
      // history.push("/")
    } else {
      history.push("/admin/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/admin" component={Dashboard} />
      <Route exact path="/admin/login" component={Login} />
      <Route exact path="/admin/forgot-password" component={ForgotPassword} />
      <Route exact path="/admin/enter-otp" component={EnterOtp} />
      <Route
        exact
        path="/admin/create-password"
        component={CreateNewPassword}
      />
      <Route exact path="/admin/profile" component={Profile} />
      {/* Coupons */}
      <Route exact path="/admin/coupons" component={CouponList} />
      <Route exact path="/admin/coupon/add" component={AddCoupon} />
      <Route exact path="/admin/coupon/addByCSV" component={AddCouponFromCSV} />
      <Route
        exact
        path="/admin/coupon/editByCSV"
        component={EditCouponFromCSV}
      />
      <Route exact path="/admin/coupon/edit/:id" component={EditCoupon} />

      {/* Settings */}
      <Route exact path="/admin/setting" component={Setting} />

      {/* Testimonials */}
      <Route exact path="/admin/testimonials" component={TestimonialList} />
      <Route exact path="/admin/testimonial/add" component={AddTestimonial} />
      <Route
        exact
        path="/admin/testimonial/addByCSV"
        component={AddTestimonialFromCSV}
      />
      <Route
        exact
        path="/admin/testimonial/editByCSV"
        component={EditTestimonialFromCSV}
      />
      <Route
        exact
        path="/admin/testimonial/edit/:id"
        component={EditTestimonial}
      />

      {/* Newsletter */}
      <Route exact path="/admin/newsletters" component={NewsletterList} />
      <Route exact path="/admin/newsletter/add" component={AddNewsletter} />
      <Route
        exact
        path="/admin/newsletter/addByCSV"
        component={AddNewsletterFromCSV}
      />
      <Route
        exact
        path="/admin/newsletter/editByCSV"
        component={EditNewsletterFromCSV}
      />
      <Route
        exact
        path="/admin/newsletter/edit/:id"
        component={EditNewsletter}
      />
      {/* Web Contents */}
      <Route exact path="/admin/privacyPolicy" component={PrivacyPolicy} />
      <Route exact path="/admin/termsConditions" component={TermsConditions} />
      <Route exact path="/admin/contactUs" component={ContactUs} />
      <Route exact path="/admin/aboutUs" component={AboutUs} />
      {/* Main Menu */}
      <Route exact path="/admin/mainMenus" component={MainMenuList} />
      <Route exact path="/admin/mainMenu/add" component={AddMainMenu} />
      <Route exact path="/admin/mainMenu/edit/:id" component={EditMainMenu} />
      {/* Inquires */}
      <Route exact path="/admin/inquires" component={InquiryList} />
      <Route exact path="/admin/inquiry/add" component={AddInquires} />
      <Route
        exact
        path="/admin/inquiry/addByCSV"
        component={AddInquiryFromCSV}
      />
      <Route
        exact
        path="/admin/inquiry/editByCSV"
        component={EditInquiryFromCSV}
      />
      <Route exact path="/admin/inquiry/edit/:id" component={EditInquiry} />
      {/* Customer */}
      <Route exact path="/admin/customers" component={CustomerList} />
      <Route exact path="/admin/customer/edit/:id" component={EditCustomer} />
      <Route
        exact
        path="/admin/customer/details/:id"
        component={CustomerDetails}
      />

      {/* Reviews */}
      <Route exact path="/admin/reviews" component={ReviewList} />
      <Route exact path="/admin/review/edit/:id" component={EditReview} />
    </Switch>
  );
};
const AdminRouter = () => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  return (
    <div id="main-wrapper">
      <AdminContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />
          <Routing />
          <Footer />
        </Router>
      </AdminContext.Provider>
    </div>
  );
};

export default AdminRouter;
