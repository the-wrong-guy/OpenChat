import actionTypes from "../Action/action.types";

const intialState = {
  darkTheme: false,
  drawerOpen: false,
};
const CONFIG = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.THEME_TOGGLE:
      return { ...state, darkTheme: !state.darkTheme };
    case actionTypes.DRAWER_TOGGLE:
      return { ...state, drawerOpen: !state.drawerOpen };
    default:
      return state;
  }
};

export default CONFIG;
