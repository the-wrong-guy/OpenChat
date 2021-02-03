import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";
import App from "./App";
import store from "./Redux/store";
import { swInit, swUpdate } from "./Redux/Action/action";
import actionTypes from "./Redux/Action/action.types";

// const dispatch = useDispatch();

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Router>
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById("root")
);

serviceWorkerRegistration.register({
  onSuccess: () => {
    store.dispatch({ type: actionTypes.SW_INIT });
    console.log("1st");
  },
  onUpdate: (registration) => {
    store.dispatch({ type: actionTypes.SW_UPDATE, payload: registration });
    console.log("2nd");
  },
});

// import reportWebVitals from "./reportWebVitals";
// reportWebVitals(console.log);
