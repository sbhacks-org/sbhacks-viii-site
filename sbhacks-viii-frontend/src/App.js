import "./App.css";
import MailingList from "./components/MailingList.js";
import UnsubscribePage from "./components/UnsubscribePage.js"
import ConfirmPage from "./components/ConfirmPage.js"
import { Switch, Route } from 'react-router-dom';
import SocialMediaBar from "./components/SocialMediaBar";

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
          <MailingList/>
          <SocialMediaBar/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
