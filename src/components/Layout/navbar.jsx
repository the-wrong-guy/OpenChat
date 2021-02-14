import React from "react";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styles from "./navbar.module.scss";
import logo from "./logo.png";
import DrawerBox from "./drawer";
import { drawerToggle } from "../../Redux/Action/action";

// eslint-disable-next-line react/prop-types
function Navbar({ displayPic }) {
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  return (
    <AppBar
      style={{
        backgroundColor: `${isDarkTheme ? "#181818" : "rgb(255, 179, 36) "}`,
      }}
      position="static"
    >
      <Toolbar className={styles.Toolbar}>
        <div className={styles.logoDiv}>
          <img className={styles.logo} src={logo} alt="logo" />
          <span>Open Chat</span>
        </div>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={() => dispatch(drawerToggle())}
          >
            {displayPic ? (
              <img
                className={styles.displayPic}
                style={{
                  borderColor: `${isDarkTheme ? "#19e6a1" : "#7AAF50"}`,
                }}
                src={displayPic}
                alt="display pic"
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </div>
        <DrawerBox />
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(Navbar);
