import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import App from "./App";
import store from "./Redux/store";

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

serviceWorker.register();

// import reportWebVitals from "./reportWebVitals";
// reportWebVitals(console.log);
