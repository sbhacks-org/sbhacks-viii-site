import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/Application.scss";

import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Background from "../assets/backgrounds/tileable_background.jpg";
import Back from "../assets/images/back_arrow.png";

import { flatMap } from "lodash";
import { Link, useHistory } from "react-router-dom";
import Schools from "../consts/Schools";
import Genders from "../consts/Genders";
import Majors from "../consts/Majors";
import ShirtSizes from "../consts/ShirtSizes";
import EthnicityOptions from "../consts/EthnicityOptions";
import LevelOfStudyOptions from "../consts/LevelOfStudy";
import GradYearOptions from "../consts/GradYearOptions";

import Autocomplete from "@mui/material/Autocomplete";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import Checkmark from "../assets/checkmark.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundImage: `url(${Background})`,
    height: "fit-content",
  },
  centerContainer: {
    paddingTop: "7%",
    paddingBottom: "7%",
  },
  backArrow: {
    position: "absolute",
    [theme.breakpoints.up("xl")]: {
      left: "85px",
    },
    [theme.breakpoints.between("md", "lg")]: {
      left: "15px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "0vw",
      visibility: "hidden",
    },
  },
  formContainer: {
    // paddingTop: "20px",
    padding: "35px",
    margin: "0 auto",
    color: "#365877",
    [theme.breakpoints.up("xl")]: {
      width: "800px",
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "60vw",
      marginTop: "5vh",
    },
    background: "#EEFFFF",
    borderRadius: "50px",
  },
  title: {
    color: "#2FA0DF",
    [theme.breakpoints.between("md", "xl")]: {
      fontSize: "36px",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "24px",
    },
  },
  formControl: {
    margin: "auto",
    textAlign: "left",
    [theme.breakpoints.between("md", "xl")]: {
      width: "65%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "75%",
    },
  },
  mcText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px",
    },
  },
  formControlFrq: {
    margin: "auto",
    width: "75%",
  },
  frqLabel: {
    fontWeight: "bold",
  },
  frqContainer: {
    backgroundColor: "#C6E9F4",
    borderRadius: "30px",
    padding: "0px 30px 30px 30px",
  },
  charCount: {
    position: "absolute",
    right: "10px",
    bottom: "10px",
    fotnSize: "15px",
  },
  saveBtn: {
    border: "none",
    textAlign: "center",
    padding: "15px 32px",
    display: "inline-block",
    color: "white",
    background: "#2FA0DF",
    borderRadius: "75px",
    fontSize: "36px",
    minWidth: "40%",
    fontFamily: "NexaBold",
    "&:hover": {
      background: "#5FC5FF",
      cursor: "pointer",
    },
    margin: "auto",
    marginBottom: "40px",
    marginTop: "20px",
  },
  mcLabel: {
    textAlign: "left",
    paddingTop: "32px",
  },
}));
const inputProps = {
  style: {
    textAlign: "center",
    fontFamily: "NexaBold",
    fontSize: "16px",
    color: "#ffffff",
    height: "100vh",
    width: "100vw",
  },
};
const InputLabelProps = { style: {} };

const Application = () => {
  const classes = useStyles();

  return (
    <div id="hackerApp" className={classes.container}>
      <div className={classes.centerContainer}>
        <Typography {...inputProps}>
          Please see <a href="https://sbhacks.com">sbhacks.com</a> to apply for
          the current iteration of SB Hacks!
        </Typography>
      </div>
    </div>
  );
};

export default Application;
