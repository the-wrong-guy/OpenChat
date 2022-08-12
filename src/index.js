import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';

import actionTypes from './Redux/Action/action.types';
import store from './Redux/store';

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
  document.getElementById('root')
);

serviceWorkerRegistration.register({
  onSuccess: () => {
    store.dispatch({ type: actionTypes.SW_INIT });
  },
  onUpdate: (registration) => {
    store.dispatch({ type: actionTypes.SW_UPDATE, payload: registration });
  },
});

// import reportWebVitals from "./reportWebVitals";
// reportWebVitals(console.log);
