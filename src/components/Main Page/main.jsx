import React, { useState, useEffect, useRef } from "react";
import { Paper, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import cx from "classnames";
import { motion } from "framer-motion";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../Layout/navbar";
import Message from "../Message/message";
import styles from "./main.module.scss";
import Loader from "../Loader/loader";

export default function Main() {
  const [senderMsg, setSenderMsg] = useState("");
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
  }, [query]);

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
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
      if (user && senderMsg !== "") {
        const { uid, photoURL, displayName } = user;
        await db.collection("messages").add({
          text: senderMsg,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL,
          displayName,
        });
        setSenderMsg("");
        emptyDiv.current.scrollIntoView({ behavior: "smooth" });
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.container}
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
                  messages.map((msg) => <Message key={msg.id} message={msg} />)}

                <span
                  style={{ position: "relative", width: "100%" }}
                  ref={emptyDiv}
                ></span>
              </main>
              <form className={styles.form} onSubmit={sendMessage}>
                <Paper elevation={15} className={styles.inputCard}>
                  <input
                    name="message"
                    type="text"
                    value={senderMsg}
                    onChange={(e) => setSenderMsg(e.target.value)}
                    placeholder="Enter your message here"
                  />
                </Paper>

                <Button
                  className={styles.Button}
                  variant="contained"
                  onClick={sendMessage}
                  type="submit"
                  size="small"
                >
                  Send
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
    </motion.div>
  );
}
