import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import CONFIG from "./Reducer/reducer";

const rootReducers = combineReducers({
  CONFIG,
});

const store = createStore(rootReducers, composeWithDevTools());
export default store;
