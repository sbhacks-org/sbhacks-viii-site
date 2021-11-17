import React, { useEffect, useState } from "react";
import "../styles/ApplicationNavBar.css";
import logo from "../assets/flatLogo_white.png";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";

const AppPortalNavBar = () => {
  const history = useHistory();

  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        history.push("/login");
      })
      .catch(() => console.log("sign out error ocurred"));
  };

  return (
    <div className="appnavbar">
      <div className="right container clickable" onClick={logOut}>
        LOG OUT
      </div>
      <div className="left container clickable">
        <img className="navLogo" src={logo} alt="Logo" onClick={() => history.push('/')}/>
      </div>
    </div>
  );
};

export default AppPortalNavBar;
