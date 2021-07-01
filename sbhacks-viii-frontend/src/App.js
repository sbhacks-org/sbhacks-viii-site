import logo from "./logo.svg";
import "./App.css";
import MailingList from "./components/MailingList.js";
import UnsubscribePage from "./components/UnsubscribePage.js"
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
      <Switch>
        <Route path="/unsubscribe">
          <UnsubscribePage/>
        </Route>
        <Route path="/">
        <div className="App">
          <MailingList/>
        </div>
        </Route>
      </Switch>
  );
}

export default App;
