/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase";
import { Paper, Button, IconButton, useMediaQuery } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { PhotoCamera } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import SendIcon from "@material-ui/icons/Send";
// import GroupsIcon from "@material-ui/icons/GroupWork";
// import ExploreIcon from "@material-ui/icons/Explore";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Offline } from "react-detect-offline";
import { auth, db, storage, realDB } from "../../firebase";
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

const sendButtonVariants = {
  open: { x: [0, 100] },
  closed: { x: [-10, 0] },
};

function Main() {
  console.log("main Rendering");
  // -----------------Setting Up the Dark Theme------------------------//
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  const palletType = isDarkTheme ? "dark" : "light";
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });
  // -----------------Setting Up the Dark Theme------------------------//

  const dispatch = useDispatch();
  const [senderImg, setSenderImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [uploadLoader, setUplaodLoader] = useState(false);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aniSendBtn, setAniSendBtn] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);
  const [userDetails, setUserDetails] = useState({
    displayName: "",
    displayPhoto: null,
  });

  useEffect(() => {
    const unsub = db
      .collection("messages")
      .orderBy("createdAt")
      .limitToLast(15)
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, msg: doc.data() }))
        );
      });
    return unsub;
  }, []);
  const history = useHistory();
  const emptyDiv = useRef();
  const matches = useMediaQuery("(max-width:600px)");

  const [message, setMessage] = useState({
    text: "",
    rows: 1,
    minRows: 1,
    maxRows: 4,
  });

  const handleTextboxChange = (event) => {
    const textareaLineHeight = 27;

    const previousRows = event.target.rows;
    event.target.rows = message.minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= message.maxRows) {
      event.target.rows = message.maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setMessage({
      ...message,
      text: event.target.value,
      rows: currentRows < message.maxRows ? currentRows : message.maxRows,
    });
  };

  useEffect(() => {
    const unsub = () => {
      if (emptyDiv.current) {
        emptyDiv.current.scrollIntoView({
          inline: "center",
          behavior: "smooth",
          alignToTop: false,
        });
      }
    };
    unsub()
    return unsub;
  }, [messages]);

  useEffect(async () => {
    // eslint-disable-next-line no-shadow
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        dispatch(setUserInfo(user));
        setUserDetails({
          displayName: user.displayName,
          displayPhoto: user.photoURL,
        });
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
      if (user && (message.text !== "" || senderImg !== null)) {
        setAniSendBtn(true);
        const { uid, photoURL, displayName } = user;
        if (message.text !== "" && senderImg === null) {
          await db.collection("messages").add({
            text: message.text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            displayName,
          });
          // eslint-disable-next-line no-undef
          new Audio(sendAudio).play();
          setMessage({
            ...message,
            text: "",
            rows: 1,
          });
        } else if (message.text === "" && senderImg !== null) {
          setUplaodLoader(true);
          const storageRef = storage.ref();
          const fileRef = storageRef.child(
            `imgMessages/${uuidv4()}-${senderImg.name}`
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
        } else if (message.text !== "" && senderImg !== null) {
          const tempTextmsg = message.text;
          setMessage({
            ...message,
            text: "",
            rows: 1,
          });
          setUplaodLoader(true);
          const storageRef = storage.ref();
          const fileRef = storageRef.child(
            `imgMessages/${uuidv4()}-${senderImg.name}`
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
        setTimeout(() => setAniSendBtn(false), 500);
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
          <>
            <Navbar displayPic={userDetails.displayPhoto} />
            <Offline>
              <div className={styles.offlineDiv}>
                <div>
                  <span>You&apos;re Offline</span>
                  <WifiOffIcon />
                </div>
              </div>
            </Offline>
            <div>
              <main className={styles.main}>
                {messages &&
                  user &&
                  messages.map(({ id, msg }) => (
                    <Message key={id} msgId={id} message={msg} />
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
                  style={{
                    position: "relative",
                    width: "100%",
                    marginBottom: "60px",
                  }}
                  ref={emptyDiv}
                ></span>
              </main>
              <form
                className={styles.form}
                style={{
                  background: `${isDarkTheme ? "#181818" : "rgb(255 179 36)"}`,
                }}
                onSubmit={sendMessage}
              >
                <Paper
                  elevation={0}
                  style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "20px",
                    padding: `${matches ? "0 10px" : "0 13px"}`,
                    transition: "ease-in-out 300ms",
                  }}
                >
                  <textarea
                    rows={message.rows}
                    value={message.text}
                    placeholder="Send a message..."
                    className={styles.textBox}
                    onChange={handleTextboxChange}
                  />
                </Paper>
                <div>
                  <input
                    accept="image/*"
                    onChange={handleImgChange}
                    id="icon-button-file"
                    type="file"
                    style={{ display: "none" }}
                  />
                  {matches && message.text ? (
                    ""
                  ) : (
                    <label htmlFor="icon-button-file">
                      <IconButton
                        aria-label="upload picture"
                        component="span"
                        style={{ color: "#4a4a4a" }}
                        size="small"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  )}
                </div>
                <IconButton
                  aria-label="send message"
                  onClick={sendMessage}
                  type="submit"
                  style={{ color: "#4a4a4a" }}
                >
                  <motion.div
                    animate={aniSendBtn ? "open" : "closed"}
                    variants={sendButtonVariants}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <SendIcon />
                  </motion.div>
                </IconButton>
              </form>
            </div>
          </>
        )}
      </Paper>
    </ThemeProvider>
  );
}

export default React.memo(Main);
