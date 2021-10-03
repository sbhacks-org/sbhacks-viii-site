import React, {useEffect, useState} from "react";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
  } from "firebase/auth";

const Dashboard = () => {
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
            // redirect to landing page
          }
        });
      }, []);

      return (
          <div>
              Dashboard
          </div>
      )

}

export default Dashboard;