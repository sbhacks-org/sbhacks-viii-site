import React, { useEffect, useState } from "react";
import "../styles/ApplicationNavBar.css";
import logo from "../assets/logo_white.png"

const AppPortalNavBar = () => {
    return (
        <div className="appnavbar">
            <div class="right">LOG OUT</div>
            <div class="left">
            <img  className="navLogo" src={logo} alt="Logo" />;
            </div>
        </div>
    )
}

export default AppPortalNavBar;