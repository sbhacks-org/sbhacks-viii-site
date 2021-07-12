import "./App.css";
import MailingList from "./components/MailingList.js";
import UnsubscribePage from "./components/UnsubscribePage.js"
import ConfirmPage from "./components/ConfirmPage.js"
import { Switch, Route } from 'react-router-dom';
import SocialMediaBar from "./components/SocialMediaBar";
import About from "./components/About.js";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Source Sans Pro"',
  },
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
          <ConfirmPage/>
        </Route>
        <Route path="/unsubscribe">
          <UnsubscribePage/>
        </Route>
        <Route path="/">
          <div class="content">
            <MailingList/>
            <ThemeProvider theme={theme}>
              <About />
            </ThemeProvider>
          </div>
          <SocialMediaBar/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
