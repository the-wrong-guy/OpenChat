/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase";
import { Paper, Button, IconButton } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { PhotoCamera } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Offline } from "react-detect-offline";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db, storage } from "../../firebase";
import { setUserInfo } from "../../Redux/Action/action";
import Navbar from "../Layout/navbar";
import Message from "../Message/message";
import styles from "./main.module.scss";
import Loader from "../Loader/loader";

import sendAudio from "../../Message Sounds/among_us_chat_sound.mp3";
// import recieveAudio from "../../Message Sounds/facebook_chat_sound.mp3";

const previewImgVariant = {
  in: {
    y: 0,
    opacity: 1,
  },
  out: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 1,
    },
  },
};

export default function Main() {
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  const palletType = isDarkTheme ? "dark" : "light";
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });
  // -----------------Setting Up the Dark Theme------------------------//

  const dispatch = useDispatch();
  const [senderMsg, setSenderMsg] = useState("");
  const [senderImg, setSenderImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [uploadLoader, setUplaodLoader] = useState(false);
  // const [query, SetQuery] = useState(null);
  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt", "asc");
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
      emptyDiv.current.scrollIntoView({
        inline: "center",
        behavior: "smooth",
        alignToTop: false,
      });
    }
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
          // eslint-disable-next-line no-undef
          new Audio(sendAudio).play();
          setSenderMsg("");
        } else if (senderMsg === "" && senderImg !== null) {
          setUplaodLoader(true);
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
          // eslint-disable-next-line no-undef
          new Audio(sendAudio).play();
          setUplaodLoader(false);
        } else if (senderMsg !== "" && senderImg !== null) {
          const tempTextmsg = senderMsg;
          setSenderMsg("");
          setUplaodLoader(true);
          const storageRef = storage.ref();
          const fileRef = storageRef.child(
            `images/${uuidv4()}-${senderImg.name}`
          );
          await fileRef.put(senderImg);
          setSenderImg(null);
          const fileUrl = await fileRef.getDownloadURL();
          await db.collection("messages").add({
            text: tempTextmsg,
            photoMsg: fileUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            displayName,
          });
          setUplaodLoader(false);
          // eslint-disable-next-line no-undef
          new Audio(sendAudio).play();
        }
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

  useEffect(() => {
    if (!senderImg) {
      setImgPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(senderImg);
    setImgPreview(objectUrl);
    emptyDiv.current.scrollIntoView({ behavior: "smooth" });
    // Unmount
    // eslint-disable-next-line consistent-return
    return () => URL.revokeObjectURL(objectUrl);
  }, [senderImg]);

  const handleImgCancel = () => {
    setSenderImg(null);
    emptyDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ when: "beforeChildren", staggerChildren: 0.4 }}
        className={styles.container}
        component={motion.div}
      >
        {loading ? (
          <div style={{ width: "100%", height: "100vh", background: "#000" }}>
            <Loader />
          </div>
        ) : (
          <div>
            <Navbar
              displayName={userDetails.displayName}
              displayPic={userDetails.displayPhoto}
            />

            <Offline>
              <div className={styles.offlineDiv}>
                <div>
                  <span>You&apos;re Offline</span>
                  <WifiOffIcon />
                </div>
              </div>
            </Offline>

            <div className={styles.messageBox}>
              <div className={styles.innnerContainer}>
                <main className={styles.main}>
                  {messages &&
                    user &&
                    messages.map((msg) => (
                      <Message key={msg.id} message={msg} />
                    ))}
                  {senderImg && (
                    <AnimatePresence>
                      <motion.div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          margin: "10px 0",
                        }}
                        variants={previewImgVariant}
                        initial="out"
                        animate="in"
                        exit="out"
                        transition={{
                          stiffness: 50,
                          default: { duration: 1 },
                        }}
                      >
                        <motion.div
                          style={{
                            borderColor: `${
                              isDarkTheme ? "rgb(173, 85, 255)" : "#505050"
                            }`,
                          }}
                          className={styles.imgPreviewDivSend}
                        >
                          {!uploadLoader && (
                            <IconButton
                              onClick={handleImgCancel}
                              className={styles.cancelPreviewBtn}
                            >
                              <CancelIcon />
                            </IconButton>
                          )}

                          {uploadLoader ? (
                            <div className={styles.uploadLoader}>
                              <img
                                src="https://s2.svgbox.net/loaders.svg?ic=elastic-spinner&color=000000"
                                width="32"
                                height="32"
                                alt="uplaod loader"
                              />
                            </div>
                          ) : (
                            <Button
                              onClick={sendMessage}
                              className={styles.uploadBtn}
                              variant="contained"
                            >
                              Upload
                            </Button>
                          )}
                          <img
                            className={styles.imgPreview}
                            src={imgPreview}
                            alt="preview"
                          />
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  <span
                    style={{ position: "relative", width: "100%" }}
                    ref={emptyDiv}
                  ></span>
                </main>
                <form className={styles.form} onSubmit={sendMessage}>
                  <Paper elevation={20} className={styles.inputCard}>
                    <input
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
