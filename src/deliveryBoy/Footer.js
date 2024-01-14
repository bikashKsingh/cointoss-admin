import React, { useContext } from "react";
import { DeliveryBoyContext } from "./DeliveryBoyRouter";

function Footer() {
  const { state, dispatch } = useContext(DeliveryBoyContext);

  return state ? (
    <footer className="footer">© {new Date().getFullYear()} Esta Global</footer>
  ) : null;
}

export default Footer;
