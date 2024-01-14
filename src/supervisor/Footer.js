import React, { useContext } from "react";
import { SupervisorContext } from "./SupervisorRouter";

function Footer() {
  const { state, dispatch } = useContext(SupervisorContext);

  return state ? (
    <footer className="footer">© {new Date().getFullYear()} Esta Global</footer>
  ) : null;
}

export default Footer;
