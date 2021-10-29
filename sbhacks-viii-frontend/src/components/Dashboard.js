import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import NavBar from "./NavBar";
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
} from "@material-ui/core";

import Background from "../assets/backgrounds/tileable_background.jpg";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    backgroundImage: `url(${Background})`,
    height: "100%",
  },
  formContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    color: "#365877",
    [theme.breakpoints.up("xl")]: {
      width: "800px",
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
    },
    background: "#EEFFFF",
    borderRadius: "50px",
  },
  submitBtn: {
    border: "none",
    textAlign: "center",
    padding: "15px 32px",
    display: "inline-block",
    color: "white",
    background: "#2FA0DF",
    borderRadius: "75px",
    fontSize: 15,
    width: "40%",
    "&:hover": {
      background: "#5FC5FF",
    },
    marginBottom: "40px",
    marginTop: "20px",
  },
}));

const Dashboard = () => {
  const [appStatus, setAppStatus] = useState("");
  const [fname, setFname] = useState("");

  const classes = useStyles();

  const history = useHistory();

  const editApp = () => {
    history.push("/application");
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);

        if (!user.emailVerified) {
          // email not verified so redirect to login
          history.push("/login");
        }

        axios
          .get("/userdb/getAppFields", { params: { uid: user.uid } })
          .then(async (res) => {
            console.log(res.data);

            setAppStatus(res.data.status);
            setFname(res.data.fname);
          })
          .catch((err) => {
            console.log("Error in getting user data: " + err);
          });

        // ...
      } else {
        console.log("not signed in");
        // User is signed out
        // ...
        // redirect to landing page
      }
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <h2> Dashboard </h2>
        Hi {fname}, your application status is

        <h1> {appStatus} </h1>

        <button type="submit" className={classes.submitBtn} onClick={editApp}>
        <Typography variant="subtitle1">Edit Application</Typography>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
