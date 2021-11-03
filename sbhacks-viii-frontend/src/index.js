import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzG1r2gRthS-BQLPbn-tmH2__n5Dt6FZ4",
  authDomain: "sbhacks-viii-site.firebaseapp.com",
  projectId: "sbhacks-viii-site",
  storageBucket: "sbhacks-viii-site.appspot.com",
  messagingSenderId: "229761677178",
  appId: "1:229761677178:web:0157480956e77b83ba08c3",
};

const app = initializeApp(firebaseConfig);

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
