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

import axios from "axios";

axios.defaults.baseURL =
  "https://us-central1-sbhacks-viii-site.cloudfunctions.net/api";
// axios.defaults.baseURL = "http://localhost:5001/sbhacks-viii-site/us-central1/api";

const theme = createMuiTheme({
  palette: {
    text: {
      primary: "#fab664",
      secondary: "#ffffff",
    },
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
        <Route path="/authentication">
          <AuthenticationPage />
        </Route>
        <Route path="/">
          <div class="content">
            <NavBar/>
            <div id='landing' class="initial-content">
              <MailingList />
            </div>
            <ThemeProvider theme={theme}>
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
