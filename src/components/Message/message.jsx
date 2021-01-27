/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { auth } from "../../firebase";
import styles from "./message.module.scss";
import "./message.css";

const VariantRecieve = {
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "-100%",
  },
};

const VariantSent = {
  in: {
    opacity: 1,
    x: "0%",
  },
  out: {
    opacity: 0,
    x: "100%",
  },
};

const Transition = {
  type: "spring",
  stiffness: 60,
};
export default function Message(props) {
  // eslint-disable-next-line react/destructuring-assignment
  // eslint-disable-next-line react/prop-types
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  const {
    text,
    uid,
    photoURL,
    createdAt,
    displayName,
    photoMsg,
  } = props.message;
  const match = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div
      className={`${
        match === "sent" ? "outerMostConSend" : "outerMostConRecieve"
      }`}
    >
      {match === "sent" ? (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={VariantSent}
          transition={Transition}
          className={styles.SendContainer}
        >
          <div className={styles.infoDivSend}>
            <div>
              <span className={styles.displayNameSend}>
                {match === "sent" ? "You" : displayName}
              </span>
              <span
                style={{ color: `${isDarkTheme ? "#19e6a1" : "#505050"}` }}
                className={styles.time}
              >
                {createdAt && moment(createdAt.toDate()).fromNow()}
              </span>
            </div>
            {text && (
              <div className={styles.textDivSend}>
                <span className={styles.textSend}>{text}</span>
              </div>
            )}
            {photoMsg && (
              <div className={styles.photoMsgDivSend}>
                <img className={styles.photoMsg} src={photoMsg} alt="message" />
              </div>
            )}
          </div>
          <div className={styles.displayPicSend}>
            <img src={photoURL} alt="display pic" />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial="out"
          animate="in"
          exit="out"
          variants={VariantRecieve}
          transition={Transition}
          className={styles.RecieveContainer}
        >
          <div className={styles.displayPic}>
            <img src={photoURL} alt="display pic" />
          </div>
          <div className={styles.infoDiv}>
            <div>
              <span className={styles.displayName}>
                {match === "sent" ? "You" : displayName}
              </span>
              <span
                style={{ color: `${isDarkTheme ? "#19e6a1" : "#505050"}` }}
                className={styles.time}
              >
                {createdAt && moment(createdAt.toDate()).fromNow()}
              </span>
            </div>
            {text && (
              <div className={styles.textDiv}>
                <span className={styles.text}>{text}</span>
              </div>
            )}
            {photoMsg && (
              <div className={styles.photoMsgDivSend}>
                <img className={styles.photoMsg} src={photoMsg} alt="message" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// moment(createdAt.toDate()).fromNow()
