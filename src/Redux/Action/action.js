import actionTypes from "./action.types";

// eslint-disable-next-line import/prefer-default-export
export const themeToggle = () => ({
  type: actionTypes.THEME_TOGGLE,
});

export const drawerToggle = () => ({
  type: actionTypes.DRAWER_TOGGLE,
});
