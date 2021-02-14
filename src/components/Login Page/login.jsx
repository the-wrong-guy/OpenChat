/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { Paper, Button } from "@material-ui/core";
import { motion } from "framer-motion";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import { auth, realDB, db } from "../../firebase";
import styles from "./login.module.scss";
import phoneImg from "./images/Untitled_design__15_-removebg-preview.png";
import coupleChatting from "./images/Untitled_design__14_-removebg-preview.png";
import chatIcon from "./images/chatIcon.png";
import Loader from "../Loader/loader";

export default function Login() {
  console.log("Rendering");
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const signInWithGoogle = async () => {
    auth.useDeviceLanguage();
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider).then(async () => {
        if (auth.currentUser) {
          var user = auth.currentUser;
          const userRef = realDB.ref(`users/${user.uid}`);
          userRef.once("value", (snapshot) => {
            console.log("running through check...");
            if (snapshot.exists()) {
              console.log("exists!...exiting---->");
              return;
            } else {
              realDB
                .ref(`users/${user.uid}`)
                .set({
                  userId: user.uid,
                  displayName: user.displayName,
                  displayPic: user.photoURL,
                })
                .then(() => {
                  const groupRef = realDB.ref(`users/${user.uid}/joinedGrps`);
                  groupRef.once("value", (snap) => {
                    console.log("running through check...");
                    if (snap.exists()) {
                      console.log("exists!");
                      return;
                    } else {
                      groupRef.set({ 0: "Alpha" });
                      db.collection("groups")
                        .doc("Alpha")
                        .collection("members")
                        .doc(user.uid)
                        .set({
                          userId: user.uid,
                          displayName: user.displayName,
                          displayPic: user.photoURL,
                          joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        });
                    }
                  });
                });
            }
          });
        }
        history.push("/");
      });
    } catch (error) {
      // console.log(error);
    }
  };

  // const signInWithGithub = async () => {
  //   auth.useDeviceLanguage();
  //   const provider = new firebase.auth.GithubAuthProvider();
  //   try {
  //     await auth.signInWithPopup(provider).then(() => {
  //       history.push("/");
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        history.push("/");
        setLoading(false);
      } else {
        history.push("/login");
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={styles.container}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={cx(styles.firstSection, styles.section)}>
            <img
              className={styles.img1}
              src={coupleChatting}
              alt="graphic images"
            />
            <img className={styles.img2} src={chatIcon} alt="graphic images" />
          </div>
          <div className={cx(styles.secondSection, styles.section)}>
            <Paper elevation={5} className={cx(styles.card, styles.section)}>
              <div style={{ textAlign: "center" }}>
                <span className={styles.header1}>Welcome to </span>
                <br />
                <span className={styles.header2}>OpenChat</span>
              </div>

              <Button
                onClick={signInWithGoogle}
                size="small"
                variant="contained"
                className={styles.button}
              >
                <span
                  style={{
                    display: "inline-block",
                    verticalAlign: "midlle",
                    margin: "8px 0px 8px 8px",
                    width: "18px",
                    height: "18px",
                    boxSizing: "border-box",
                  }}
                >
                  <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z"
                      id="Shape"
                      fill="#EA4335"
                    />
                    <path
                      d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z"
                      id="Shape"
                      fill="#FBBC05"
                    />
                    <path
                      d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z"
                      id="Shape"
                      fill="#4285F4"
                    />
                    <path
                      d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z"
                      fill="#34A853"
                    />
                  </svg>
                </span>
                <span style={{ marginLeft: "5px" }}> Sign in with Google</span>
              </Button>
            </Paper>
          </div>

          <div className={cx(styles.thirdSection, styles.section)}>
            <img src={phoneImg} alt="graphic images" />
          </div>
        </>
      )}
    </motion.div>
  );
}
