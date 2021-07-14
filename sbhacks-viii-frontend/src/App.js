import "./App.css";
import MailingList from "./components/MailingList.js";
import UnsubscribePage from "./components/UnsubscribePage.js";
import ConfirmPage from "./components/ConfirmPage.js";
import { Switch, Route } from "react-router-dom";
import SocialMediaBar from "./components/SocialMediaBar";
import About from "./components/About.js";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import axios from "axios";

axios.defaults.baseURL = "https://us-central1-sbhacks-viii-site.cloudfunctions.net/api";
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
        <Route path="/">
          <div class="content">
            <MailingList />
            <ThemeProvider theme={theme}>
              <About />
            </ThemeProvider>
          </div>
          <SocialMediaBar />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
