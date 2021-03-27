/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import LoginPage from "./components/Login Page/login";
import MainPage from "./components/Main Page/main";

function App() {
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  const darkTheme = createMuiTheme({
    overrides: {
      MuiPaper: {
        root: {
          backgroundColor: "#000000",
        },
      },
    },
    palette: {
      type: "dark",
    },
  });

  const lightTheme = createMuiTheme({
    palette: {
      type: "light",
    },
  });

  // eslint-disable-next-line react/jsx-filename-extension
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/">
            <MainPage />
          </Route>
        </Switch>
      </ThemeProvider>
    </AnimatePresence>
  );
}

export default App;
