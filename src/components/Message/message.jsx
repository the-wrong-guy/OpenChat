/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from "react";
import { formatRelative } from "date-fns";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Skeleton from "@material-ui/lab/Skeleton";
import { auth } from "../../firebase";
import styles from "./message.module.scss";
import "./message.scss";

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
  stiffness: 70,
  delay: 0.2,
  when: "beforeChildren",
  staggerChildren: 0.5,
  velocity: 2,
};
export default function Message(props) {
  // eslint-disable-next-line react/destructuring-assignment
  // eslint-disable-next-line react/prop-types
  // const [createdTime, setCreatedTime] = useState([]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  const themeFuncForRectSkeleton = () => {
    if (isDarkTheme) {
      return "rgb(41 41 41)";
    }
    return "rgb(255 255 255 / 32%)";
  };
  const {
    text,
    uid,
    photoURL,
    createdAt,
    displayName,
    photoMsg,
  } = props.message;
  const formatDate = (date) => {
    let formattedDate = "";
    if (date) {
      // Convert the date in words relative to the current date
      formattedDate = formatRelative(date, new Date());
      // Uppercase the first letter
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  };
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
                style={{ color: `${isDarkTheme ? "#19e6a1" : "#52AD88"}` }}
                className={styles.time}
              >
                {createdAt && formatDate(new Date(createdAt.seconds * 1000))}
              </span>
            </div>
            {text && (
              <div className={styles.textDivSend}>
                <span className={styles.textSend}>{text}</span>
              </div>
            )}
            {photoMsg && (
              <motion.div
                style={{
                  borderColor: `${
                    isDarkTheme ? "rgb(173, 85, 255)" : "rgb(173 85 255)"
                  }`,
                }}
                className={styles.photoMsgDivSend}
                whileTap={{ width: "85vw", height: "100vh" }}
              >
                <motion.img
                  className={styles.photoMsg}
                  src={photoMsg}
                  alt="message"
                  whileTap={{ scale: 0.9 }}
                  style={{ opacity: `${imgLoaded ? 1 : 0}` }}
                  onLoad={() => setImgLoaded(true)}
                />
                {!imgLoaded && (
                  <Skeleton
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `${themeFuncForRectSkeleton()}`,
                      position: "absolute",
                    }}
                    animation="wave"
                    variant="rect"
                  />
                )}
              </motion.div>
            )}
          </div>
          <div className={styles.displayPicSend}>
            <img
              style={{
                backgroundColor: `${
                  isDarkTheme ? "rgb(169 169 169)" : "rgb(160 160 160)"
                }`,
              }}
              src={photoURL}
              alt="display pic"
            />
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
            <img
              style={{
                backgroundColor: `${
                  isDarkTheme ? "rgb(169 169 169)" : "rgb(160 160 160)"
                }`,
              }}
              src={photoURL}
              alt="display pic"
            />
          </div>
          <div className={styles.infoDiv}>
            <div>
              <span className={styles.displayName}>
                {match === "sent" ? "You" : displayName}
              </span>
              <span
                style={{ color: `${isDarkTheme ? "#19e6a1" : "#52AD88"}` }}
                className={styles.time}
              >
                {createdAt && formatDate(new Date(createdAt.seconds * 1000))}
              </span>
            </div>
            {text && (
              <div className={styles.textDiv}>
                <span className={styles.text}>{text}</span>
              </div>
            )}
            {photoMsg && (
              <motion.div
                style={{
                  borderColor: `${isDarkTheme ? "#4877f8" : "rgb(173 85 255)"}`,
                  backgroundColor: "#4877f8",
                }}
                className={styles.photoMsgDivSend}
                whileTap={{ width: "85vw", height: "100vh" }}
              >
                <motion.img
                  className={styles.photoMsg}
                  src={photoMsg}
                  alt="message"
                  whileTap={{ scale: 0.9 }}
                  onLoad={() => setImgLoaded(true)}
                  style={{ opacity: `${imgLoaded ? 1 : 0}` }}
                />
                {!imgLoaded && (
                  <Skeleton
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `${themeFuncForRectSkeleton()}`,
                      position: "absolute",
                    }}
                    animation="wave"
                    variant="rect"
                  />
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// moment(createdAt.toDate()).fromNow()
