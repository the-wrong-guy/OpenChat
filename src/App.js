/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginPage from "./components/Login Page/login";
import MainPage from "./components/Main Page/main";

function App() {
  // eslint-disable-next-line react/jsx-filename-extension
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.pathname}>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/">
          <MainPage />
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

export default App;
