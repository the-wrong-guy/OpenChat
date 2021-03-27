import React from "react";
import { AppBar, Toolbar, IconButton, Avatar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styles from "./navbar.module.scss";
import OpenChat from "./OpenChat.webp";
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
          <img className={styles.logo} src={OpenChat} alt="OpenChat" />
          <span className={styles.header}> OpenChat</span>
        </div>
        

        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={() => dispatch(drawerToggle())}
            size="small"
          >
            {displayPic ? (
              <Avatar alt="display Pic" src={displayPic} />
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
