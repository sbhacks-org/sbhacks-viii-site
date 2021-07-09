import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import axios from 'axios'

function SocialMediaBar() {
  const imageStyle = {
    height: 2 + "rem", 
    padding: 1 + "rem",
  };
  return (
    <div>
      <a href="mailto:team@sbhacks.com" class="text-3xl hover:bg-white hover:bg-opacity-25">
        <img src="icons/email.png" style={imageStyle} alt="email"/>
      </a>
      <a href="https://facebook.com/ucsbhacks" class="text-3xl hover:bg-white hover:bg-opacity-25">
        <img src="icons/facebook.png" style={imageStyle} alt="facebook"/>
      </a>
      <a href="https://instagram.com/sbhacks" class="text-3xl hover:bg-white hover:bg-opacity-25">
        <img src="icons/instagram.png" style={imageStyle} alt="instagram"/>
      </a>
      <a href="https://twitter.com/sb_hacks" class="text-3xl hover:bg-white hover:bg-opacity-25">
        <img src="icons/twitter.png" style={imageStyle} alt="twitter"/>
      </a>
      <a href="https://medium.com/@ucsbhacks" class="text-3xl hover:bg-white hover:bg-opacity-25">
        <img src="icons/medium.png" style={imageStyle} alt="medium"/>
      </a>
    </div>
  );
}

export default SocialMediaBar;