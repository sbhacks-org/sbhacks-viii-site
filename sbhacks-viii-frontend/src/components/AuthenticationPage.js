import React, { useEffect, useState } from "react";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthenticationPage = (props) => {
  useEffect(() => {}, []);
  const [showLogin, setShowLogin] = useState(true);

  const loginSubmit = (e, email, password) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Successful sign in");
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " | " + errorMessage);
      });
  };

  const registerSubmit = (e, email, password) => {
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
          console.log('verificaiton email sent');
        });
        // add to db
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " | " + errorMessage);
        // ..
      });
  };

  return (
    <div>
      <button
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
      {showLogin ? (
        <AuthenticationForm handlesubmit={loginSubmit} submitTxt="Login" />
      ) : (
        <AuthenticationForm
          handlesubmit={registerSubmit}
          submitTxt="Register"
        />
      )}
    </div>
  );
};

export default AuthenticationPage;

export const AuthenticationForm = (props) => {
  const handleSubmit = props.handlesubmit;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const update = (e, set) => {
    e.preventDefault();
    set(e.target.value);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, email, password)}>
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
