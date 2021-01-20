/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
} from "react-router-dom";
import Routes from "./route";
import LoginPage from "./components/Login Page/login";
import MainPage from "./components/Main Page/main";
import { auth } from "./firebase";

function App() {
  const history = useHistory();

  // eslint-disable-next-line react/jsx-filename-extension
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/">
          <MainPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
