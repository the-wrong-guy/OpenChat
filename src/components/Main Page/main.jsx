/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from "react";
import { Paper, Button, IconButton } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { PhotoCamera } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db, storage } from "../../firebase";
import { setUserInfo } from "../../Redux/Action/action";
import Navbar from "../Layout/navbar";
import Message from "../Message/message";
import styles from "./main.module.scss";
import Loader from "../Loader/loader";

import sendAudio from "../../Message Sounds/among_us_chat_sound.mp3";
import recieveAudio from "../../Message Sounds/facebook_chat_sound.mp3";

export default function Main() {
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  const palletType = isDarkTheme ? "dark" : "light";
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });
  // -----------------------------------------//

  const dispatch = useDispatch();
  const [senderMsg, setSenderMsg] = useState("");
  const [senderImg, setSenderImg] = useState(null);
  // const [query, SetQuery] = useState(null);
  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt", "asc").limit(100);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);
  const [userDetails, setUserDetails] = useState({
    displayName: "",
    displayPhoto: null,
  });
  const history = useHistory();
  const emptyDiv = useRef();

  useEffect(() => {
    if (emptyDiv.current) {
      emptyDiv.current.scrollIntoView({ behavior: "smooth" });
    }
    // setInterval(() => {}, 3000);
    // if (messages) {
    //   // eslint-disable-next-line array-callback-return
    //   messages.map((msg) => {
    //     if (msg.uid !== user.uid) {
    //       // eslint-disable-next-line no-undef
    //       new Audio(recieveAudio).play();
    //     }
    //   });
    // }
  }, [messages]);

  useEffect(async () => {
    // eslint-disable-next-line no-shadow
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUserDetails({
          displayName: user.displayName,
          displayPhoto: user.photoURL,
        });
        dispatch(setUserInfo(user));
        setLoading(false);
        history.push("/");
      } else {
        setUser(null);
        history.push("/login");
      }
    });

    return unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      if (user && (senderMsg !== "" || senderImg !== null)) {
        const { uid, photoURL, displayName } = user;
        if (senderMsg !== "" && senderImg === null) {
          await db.collection("messages").add({
            text: senderMsg,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            displayName,
          });
          setSenderMsg("");
        } else if (senderMsg === "" && senderImg !== null) {
          const storageRef = storage.ref();
          const fileRef = storageRef.child(
            `images/${uuidv4()}-${senderImg.name}`
          );
          await fileRef.put(senderImg);
          setSenderImg(null);
          const fileUrl = await fileRef.getDownloadURL();
          await db.collection("messages").add({
            photoMsg: fileUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            displayName,
          });
        } else if (senderMsg !== "" && senderImg !== null) {
          const storageRef = storage.ref();
          const fileRef = storageRef.child(
            `images/${uuidv4()}-${senderImg.name}`
          );
          await fileRef.put(senderImg);
          setSenderImg(null);
          const fileUrl = await fileRef.getDownloadURL();
          await db.collection("messages").add({
            text: senderMsg,
            photoMsg: fileUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            displayName,
          });
          setSenderMsg("");
        }

        // eslint-disable-next-line no-undef
        new Audio(sendAudio).play();
        emptyDiv.current.scrollIntoView({ behavior: "smooth" });
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImgChange = (e) => {
    if (e.target.files[0]) {
      setSenderImg(e.target.files[0]);
    }
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <Paper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.container}
        component={motion.div}
      >
        {loading ? (
          <div className={styles.loaderDiv}>
            <Loader />
          </div>
        ) : (
          <div>
            <Navbar
              displayName={userDetails.displayName}
              displayPic={userDetails.displayPhoto}
            />
            <div className={styles.messageBox}>
              <div className={styles.innnerContainer}>
                <main className={styles.main}>
                  {messages &&
                    user &&
                    messages.map((msg) => (
                      <Message key={msg.id} message={msg} />
                    ))}

                  <span
                    style={{ position: "relative", width: "100%" }}
                    ref={emptyDiv}
                  ></span>
                </main>
                <form className={styles.form} onSubmit={sendMessage}>
                  <Paper elevation={15} className={styles.inputCard}>
                    <input
                      fullWidth
                      name="message"
                      type="text"
                      value={senderMsg}
                      onChange={(e) => setSenderMsg(e.target.value)}
                      placeholder="Enter your message here"
                    />
                  </Paper>
                  <div>
                    <input
                      accept="image/*"
                      onChange={handleImgChange}
                      className={styles.imgInput}
                      id="icon-button-file"
                      type="file"
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        style={{ position: "relative" }}
                      >
                        <PhotoCamera
                          style={{ color: `${senderImg ? "green" : "grey"}` }}
                        />
                      </IconButton>
                    </label>
                  </div>
                  <Button
                    className={styles.Button}
                    variant="contained"
                    onClick={sendMessage}
                    type="submit"
                  >
                    <img
                      src="https://img.icons8.com/plasticine/30/000000/paper-plane.png"
                      alt="button"
                    />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </Paper>
    </ThemeProvider>
  );
}
