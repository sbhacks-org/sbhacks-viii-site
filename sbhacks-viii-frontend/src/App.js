import { hot } from "react-hot-loader/root";
import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import MailingList from "./components/MailingList.js";
import UnsubscribePage from "./components/UnsubscribePage.js";
import ConfirmPage from "./components/ConfirmPage.js";
import { Switch, Route } from "react-router-dom";
import SocialMediaBar from "./components/SocialMediaBar";
import About from "./components/About.js";
import Sponsors from "./components/Sponsors.js";
import AuthenticationPage from "./components/AuthenticationPage";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import NavBar from "./components/NavBar";
import FAQ from "./components/Faq";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import Application from "./components/Application";
import AppPortalNavBar from "./components/AppPortalNavBar";

import axios from "axios";

axios.defaults.baseURL =
"https://us-central1-sbhacks-viii-site.cloudfunctions.net/api";
// axios.defaults.baseURL =
//   "http://localhost:5001/sbhacks-viii-site/us-central1/api";

const landingTheme = createMuiTheme({
  palette: {
    text: {
      primary: "#fab664",
      secondary: "#ffffff",
    },
  },
});

const dashboardTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#365877",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["NexaBold"],
  },
});

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/confirm">
          <ConfirmPage />
        </Route>
        <Route path="/unsubscribe">
          <UnsubscribePage />
        </Route>
        <Route path="/login">
          <ThemeProvider theme={dashboardTheme}>
            <AuthenticationPage />
          </ThemeProvider>
        </Route>
        <Route path="/resetpassword">
          <ResetPassword />
        </Route>
        <Route path="/dashboard">
          <AppPortalNavBar />
          <ThemeProvider theme={dashboardTheme}>
            <Dashboard />
          </ThemeProvider>
        </Route>
        <Route path="/application">
          <AppPortalNavBar />
          <Application />
        </Route>
        <Route path="/">
          <div class="content">
            <NavBar />
            <div id="landing" class="initial-content">
              <MailingList />
            </div>
            <ThemeProvider theme={landingTheme}>
              <About />
              <FAQ/>
              <Sponsors />
            </ThemeProvider>
          </div>
          <SocialMediaBar />
        </Route>
      </Switch>
    </div>
  );
}

export default hot(App);
