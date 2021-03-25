import actionTypes from "../Action/action.types";

const intialState = {
  darkTheme: true,
  drawerOpen: false,
  userInfo: null,
  serviceWorkerInitialized: false,
  serviceWorkerUpdated: false,
  serviceWorkerRegistration: null,
};
const CONFIG = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.THEME_TOGGLE:
      return { ...state, darkTheme: !state.darkTheme };
    case actionTypes.DRAWER_TOGGLE:
      return { ...state, drawerOpen: !state.drawerOpen };
    case actionTypes.SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case actionTypes.SW_INIT:
      return {
        ...state,
        serviceWorkerInitialized: !state.serviceWorkerInitialized,
      };
    case actionTypes.SW_UPDATE:
      return {
        ...state,
        serviceWorkerUpdated: !state.serviceWorkerUpdated,
        serviceWorkerRegistration: action.payload,
      };    
    default:
      return state;
  }
};

export default CONFIG;
