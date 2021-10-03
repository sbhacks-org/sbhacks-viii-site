import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

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
import "../styles/AuthenticationPage.css";

const AuthenticationPage = (props) => {
  useEffect(() => { }, []);
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

  const registerSubmit = (e, email, password, fname, lname,) => {
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
        axios.post("/userdb/register", { uid: user.uid, emailAddress: email, fname: fname, lname: lname});
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
    <div id='landingPage'>
      <div className='title'>Welcome to SB Hacks VIII</div>
      <div><button
        onClick={() => {
          setShowLogin(true);
        }}
      >
        Login
      </button>
        <button
          onClick={() => {
            setShowLogin(false);
          }}
        >
          Register
        </button>
      </div>
      {showLogin ? (
        <AuthenticationForm 
          askForName={false}
          handlesubmit={loginSubmit}
          submitTxt="Login" />
      ) : (
        <AuthenticationForm
          askForName={true}
          handlesubmit={registerSubmit}
          submitTxt="Register"
        />
      )}
      <Link to='resetpassword'>Forgot your password?</Link>

      {/* <form>
        <input type="file" onChange={(e) => setResume(e.target.files[0])} />
        <button onClick={(e) => uploadResume(e)}>Submit Resume</button>
      </form> */}
    </div>
  );
};

export default AuthenticationPage;

export const AuthenticationForm = (props) => {
  const handleSubmit = props.handlesubmit;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');

  const update = (e, set) => {
    e.preventDefault();
    set(e.target.value);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, email, password, fname, lname)}>
      {
        props.askForName &&
        <>
          <input type='text' value={fname} onChange={(e) => update(e, setFname)} />
          <input type='text' value={lname} onChange={(e) => update(e, setLname)} />
        </>
      }
      <input type="email" value={email} onChange={(e) => update(e, setEmail)} />
      <input
        type="password"
        value={password}
        onChange={(e) => update(e, setPassword)}
      />

      <button>{props.submitTxt}</button>
    </form>
  );
};
