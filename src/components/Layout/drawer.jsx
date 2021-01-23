import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import { motion } from "framer-motion";
import { Drawer, IconButton, Button } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import { drawerToggle, themeToggle } from "../../Redux/Action/action";
import { auth } from "../../firebase";
import styles from "./drawer.module.scss";

// eslint-disable-next-line react/prop-types
export default function DrawerBox() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.CONFIG.drawerOpen);
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);

  const toggleDrawer = () => async (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    await dispatch(drawerToggle());
  };

  const handleChecked = async () => {
    await dispatch(themeToggle());
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(drawerToggle());
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const svgVariants = {
    hidden: {
      rotate: -180,
    },
    visible: {
      rotate: 0,
      transition: {
        duration: 1,
      },
    },
  };

  const pathVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      color: "pink",
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      color: "#000",
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };
  return (
    <Drawer onClose={toggleDrawer(false)} anchor="left" open={isOpen}>
      <List className={styles.list}>
        <ListItem
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={() => dispatch(drawerToggle())}>
            <motion.svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              color="#000"
              variants={svgVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.path
                d="M0 0h24v24H0z"
                fill="none"
                variants={pathVariants}
              ></motion.path>
              <motion.path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                variants={pathVariants}
              ></motion.path>
            </motion.svg>
          </IconButton>
        </ListItem>
        <ListItem
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            padding: "27px 0",
          }}
        >
          <span style={{ fontSize: "1rem", fontWeight: "600" }}>
            Theme Mode
          </span>
          <div className={styles.toggle} title="toggle dark mode">
            <label htmlFor="checkBox">
              <input
                type="checkbox"
                onChange={handleChecked}
                checked={isDarkTheme}
                name=""
              />
              <span></span>
            </label>
          </div>
        </ListItem>
        <Divider />
        <ListItem
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            className={styles.logoutBtn}
            variant="contained"
            color="default"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              color="#000"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
}
