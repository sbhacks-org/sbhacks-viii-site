import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import Background from "../assets/backgrounds/tileable_background.jpg";

import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
} from "@material-ui/core";

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

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const history = useHistory();
  const classes = useStyles();

  const resetPassword = (e, email) => {
    e.preventDefault();
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        console.log("password email reset sent");
        history.push("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " | " + errorMessage);
        // ..
      });
  };
  const update = (e, set) => {
    e.preventDefault();
    set(e.target.value);
  };

  return (
    <div className={classes.container}>
      {/* <form>
        <input
          type="email"
          value={email}
          onChange={(e) => update(e, setEmail)}
        />
        <button onClick={(e) => resetPassword(e, email)}>Reset Password</button>
      </form>
      <Link to="login">Login</Link> */}
      <div className={classes.formContainer}>
        <h2> Reset Your Password </h2>
        <form onSubmit={(e) => resetPassword(e, email)}>
          <div className={classes.inputContainer}>
            <FormControl>
              <TextField
                label="Email"
                name="email"
                type="text"
                value={email}
                onChange={(e) => update(e, setEmail)}
                className={classes.textField}
                inputProps={{ style: { fontSize: 20 } }}
                InputLabelProps={{ style: { fontSize: 20 } }}
              />
            </FormControl>
          </div>
          <div>
          After submitting, check your email for instructions to reset your password.
          </div>
          <button type="submit" className={classes.submitBtn}>
            <Typography variant="subtitle1">Reset</Typography>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
