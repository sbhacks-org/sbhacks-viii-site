import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
} from "@material-ui/core";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Background from "../assets/backgrounds/tileable_background.jpg";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundImage: `url(${Background})`,
    height: "100%",
  },
  centerContainer: {
    paddingTop: "80px",
    margin: "0 auto",
    [theme.breakpoints.up("md")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
    },
  },
  titleContainer: {
    textAlign: "left",
    marginBottom: "30px",
  },
  formContainer: {
    borderRadius: "0px 50px 50px 50px",
    background: "#EEFBFF",
    padding: "40px 10px",
  },
  textField: {
    marginBottom: "40px",
    [theme.breakpoints.up("md")]: {
      width: "150%",
      transform: "translate(-15%)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      transform: "translate(0%)",
    },
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
  loginTab: {
    [theme.breakpoints.up("md")]: {
      width: "200px",
      height: "50px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "125px",
      height: "40px",
    },
    width: "8vw",
    height: "50px",
    borderRadius: "35px 35px 0px 0px",
    border: "none",
  },
  registerTab: {
    [theme.breakpoints.up("md")]: {
      width: "200px",
      height: "50px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "125px",
      height: "40px",
    },
    transform: "translateX(-10%)",
    width: "8vw",
    borderRadius: "35px 35px 0px 0px",
    border: "none",
  },
}));

const AuthenticationPage = (props) => {
  // useEffect(() => {}, []);
  const classes = useStyles();
  const [showLogin, setShowLogin] = useState(true);
  const [submitStatus, setSubmitStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  // might be helpful: https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          // logged in and email verified so redirect to dashboard
          history.push("/dashboard");
        }
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const history = useHistory();
  const loginSubmit = (e, email, password) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Successful sign in");
        console.log(user);
        console.log(user.emailVerified)

        if (!user.emailVerified) {
          // set error message to check email from noreply@sbhacks-viii-site.firebaseapp.com
          setSubmitStatus(
            "your email has not been verified. check for an email from noreply@sbhacks-viii-site.firebaseapp.com"
          );
          setErrorStatus(true);
        } else {
          axios.post("/userdb/login", { uid: user.uid });

          // redirect to dashboard
          history.push("/dashboard");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " | " + errorMessage);

        setSubmitStatus(
          "incorrect email or password"
        );
        setErrorStatus(true);
      });
  };

  const registerSubmit = (e, email, password, fname, lname) => {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("registered");
        console.log(user);
        // ...
        sendEmailVerification(auth.currentUser).then(() => {
          // Email verification sent!
          // ...
          console.log("verification email sent");
          setSubmitStatus("check your email to verify your account");
          setErrorStatus(false);
        });

        console.log(user.uid); // use this for identifying user in backend

        // TO DO: add to db
        axios.post("/userdb/register", {
          uid: user.uid,
          emailAddress: email,
          fname: fname,
          lname: lname,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " | " + errorMessage);

        setSubmitStatus(
          "incorrect email or password is too weak"
        );
        setErrorStatus(true);
        // ..
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.centerContainer}>
        <div className={classes.titleContainer}>
          <Typography color="secondary" variant="h4">
            Welcome to SB Hacks VIII
          </Typography>
        </div>
        <div style={{ textAlign: "left" }}>
          <button
            className={`${classes.loginTab} clickable`}
            style={{
              background: showLogin ? "#EEFFFF" : "#C6E9F4",
              position: "relative",
              zIndex: showLogin ? 2 : 1,
            }}
            onClick={() => {
              setShowLogin(true);
              setSubmitStatus("");
            }}
          >
            <Typography variant="subtitle2" color="primary">
              LOGIN
            </Typography>
          </button>
          <button
            className={`${classes.registerTab} clickable`}
            style={{
              background: showLogin ? "#C6E9F4" : "#EEFFFF",
              position: "relative",
              zIndex: showLogin ? 1 : 2,
            }}
            onClick={() => {
              setShowLogin(false);
              setSubmitStatus("");
            }}
          >
            <Typography variant="subtitle2" color="primary">
              REGISTER
            </Typography>
          </button>
        </div>
        <div className={classes.formContainer}>
          {showLogin ? (
            <>
              <AuthenticationForm
                askForName={false}
                handlesubmit={loginSubmit}
                submitStatus={submitStatus}
                errorStatus={errorStatus}
                submitTxt="LOG IN"
              />
              <Link to="/resetpassword">Forgot your password?</Link>
            </>
          ) : (
            <AuthenticationForm
              askForName={true}
              handlesubmit={registerSubmit}
              submitStatus={submitStatus}
              errorStatus={errorStatus}
              submitTxt="REGISTER"
            />
          )}

          <Typography variant="subtitle2" className={classes.frqLabel}>
            Encountering problems? Email us at{" "}
            <a href="mailto:team@sbhacks.com">team@sbhacks.com</a>!
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;

export const AuthenticationForm = (props) => {
  const classes = useStyles();

  const handleSubmit = props.handlesubmit;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const update = (e, set) => {
    e.preventDefault();
    if (e.target.value.length < 320) {
      set(e.target.value);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, email, password, fname, lname)}>
      <div className={classes.inputContainer}>
        {props.askForName && (
          <>
            <div>
              <FormControl>
                <TextField
                  label="First name"
                  name="fname"
                  type="text"
                  value={fname}
                  onChange={(e) => update(e, setFname)}
                  className={classes.textField}
                  inputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 20 }, required: false }}  // required: false hides the asterik                  fullWidth
                  required  // makes it required
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <TextField
                  label="Last name"
                  name="lname"
                  type="text"
                  value={lname}
                  onChange={(e) => update(e, setLname)}
                  className={classes.textField}
                  inputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 20 }, required: false }}  // required: false hides the asterik
                  required  // makes it required
                />
              </FormControl>
            </div>
          </>
        )}
        <div>
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
              required
            />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => update(e, setPassword)}
              className={classes.textField}
              inputProps={{ style: { fontSize: 20 } }}
              InputLabelProps={{ style: { fontSize: 20 } }}
              required
            />
          </FormControl>
        </div>
        <div style={{ color: props.errorStatus ? "red" : "" }}>
          {props.submitStatus}
        </div>
      </div>
      <button type="submit" className={`${classes.submitBtn} clickable`}>
        <Typography variant="subtitle1">{props.submitTxt}</Typography>
      </button>
    </form>
  );
};
