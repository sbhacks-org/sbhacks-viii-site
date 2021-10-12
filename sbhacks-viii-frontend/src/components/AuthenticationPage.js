import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  useEffect(() => {}, []);
  const classes = useStyles();
  const [showLogin, setShowLogin] = useState(true);
  const [resume, setResume] = useState(undefined);

  // might be helpful: https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const loginSubmit = (e, email, password) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Successful sign in");
        console.log(user);

        // TO DO: Update last signed in time through backend
        axios.post("/userdb/login", { uid: user.uid });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " | " + errorMessage);
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
        // ..
      });
  };

  const update = (e, set) => {
    e.preventDefault();
    set(e.target.value);
  };

  const uploadResume = (e) => {
    e.preventDefault();
    const auth = getAuth();
    const resumeName = auth.currentUser.uid + "_resume";
    const storage = getStorage();
    const storageRef = ref(storage, resumeName);

    // 'file' comes from the Blob or File API
    console.log(resume);
    const file = resume;
    uploadBytes(storageRef, file).then((snapshot) => {
      const storage = getStorage();
      getDownloadURL(storageRef)
        .then((url) => {
          // url is resume link string
          // call API to update resume link here
        })
        .catch((error) => {
          // Handle any errors
        });
      console.log("Uploaded a blob or file!");
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
            className={classes.loginTab}
            style={{
              background: showLogin ? "#EEFFFF" : "#C6E9F4",
              position: "relative",
              zIndex: showLogin ? 2 : 1,
            }}
            onClick={() => {
              setShowLogin(true);
            }}
          >
            <Typography variant="subtitle2" color="primary">
              LOGIN
            </Typography>
          </button>
          <button
            className={classes.registerTab}
            style={{
              background: showLogin ? "#C6E9F4" : "#EEFFFF",
              position: "relative",
              zIndex: showLogin ? 1 : 2,
            }}
            onClick={() => {
              setShowLogin(false);
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
                submitTxt="LOG IN"
              />
              <Link to="resetpassword">Forgot your password?</Link>
            </>
          ) : (
            <AuthenticationForm
              askForName={true}
              handlesubmit={registerSubmit}
              submitTxt="REGISTER"
            />
          )}
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
    if(e.target.value.length < 320) {
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
                  InputLabelProps={{ style: { fontSize: 20 } }}
                  fullWidth
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
                  InputLabelProps={{ style: { fontSize: 20 } }}
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
            />
          </FormControl>
        </div>
      </div>
      <button type="submit" className={classes.submitBtn}>
        <Typography variant="subtitle1">{props.submitTxt}</Typography>
      </button>
    </form>
  );
};
