import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
// import reportWebVitals from "./reportWebVitals";
import "./index.css";
import App from "./App";

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  // eslint-disable-next-line no-undef
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
