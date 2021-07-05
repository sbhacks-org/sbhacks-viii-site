import "./App.css";
import MailingList from "./components/MailingList.js";
import UnsubscribePage from "./components/UnsubscribePage.js"
import ConfirmPage from "./components/ConfirmPage.js"
import { Switch, Route } from 'react-router-dom';

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
        </Route>
      </Switch>
    </div>
  );
}

export default App;
