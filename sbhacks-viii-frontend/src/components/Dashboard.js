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
import Otter from "../assets/images/otter.svg";

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
    display: "grid",
    gridTemplateColumns: "15% 85%",
    gridTemplateRows: "100%",
    height: "80%",
    [theme.breakpoints.up("xl")]: {
      width: "1265px",
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: "950px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
    },
    background: "#EEFFFF",
    borderRadius: "50px",
  },
  left: {
    position: "relative",
    gridColumnStart: "1",
    gridColumnEnd: "2",
  },
  border: {
    position: "absolute",
    top: "3.8%",
    right: "0px",
    backgroundColor: "#C6E9F4",
    width: "2px",
    height: "92.4%",
  },
  right :{
    gridColumnStart: "2",
    gridColumnEnd: "3",
  },
  otterPic: {
    marginTop: "10%",
    [theme.breakpoints.up("xl")]: {
      width: "120px",
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: "80px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "5vw",
    },
  },
  fname: {
    fontFamily: "NexaBold",
    fontSize: "18px",
  },
  lname: {
    fontFamily: "NexaLight",
    fontSize: "18px",
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
  const [lname, setLname] = useState("");

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
        console.log(user)
        console.log(user.emailVerified)

        if (!user.emailVerified) {
          // email not verified so redirect to login
          history.push("/login");
        }

        axios
          .get("/userdb/getDashFields", { params: { uid: user.uid } })
          .then(async (res) => {
            console.log(res.data);

            setAppStatus(res.data.status);
            setFname(res.data.fname);
            setLname(res.data.lname);
          })
          .catch((err) => {
            console.log("Error in getting user data: " + err);
          });

        // ...
      } else {
        console.log("not signed in");
        // User is signed out
        // ...
        // redirect to login page
        history.push("/login");
      }
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.left}>
          <img className={`${classes.otterPic}`} src={Otter}/>
          <div className={classes.fname}>{fname}</div>
          <div className={classes.lname}>{lname}</div>
          <div className={classes.border}></div>
        </div>
        <div className={classes.right}>
          <h2> Dashboard </h2>
          Hi {fname}, your application status is

          <h1> {appStatus} </h1>

          <button type="submit" className={`${classes.submitBtn} clickable`} onClick={editApp}>
            <Typography variant="subtitle1">Edit Application</Typography>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
