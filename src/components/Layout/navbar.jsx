import React from "react";
import { AppBar, Toolbar, IconButton, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import styles from "./navbar.module.scss";
import { auth } from "../../firebase";
import logo from "./logo.png";
// eslint-disable-next-line react/prop-types
export default function Navbar({ displayName, displayPic }) {
  const history = useHistory();
  const signOut = () => {
    try {
      auth.signOut().then(() => {
        history.push("/login");
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AppBar className={styles.appbar} position="static">
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
          >
            {displayPic ? (
              <img
                className={styles.displayPic}
                style={{ height: "40px", borderRadius: "50%" }}
                src={displayPic}
                alt="display pic"
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Button onClick={signOut} variant="contained" size="small">
            Sign Out
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

// <Button onClick={signOut} variant="contained" size="small">
// Sign Out
// </Button>
