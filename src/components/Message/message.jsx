/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from "react";
import moment from "moment";
import { auth } from "../../firebase";
import styles from "./message.module.scss";
import "./message.css";

export default function Message(props) {
  // eslint-disable-next-line react/destructuring-assignment
  // eslint-disable-next-line react/prop-types
  const { text, uid, photoURL, createdAt, displayName } = props.message;
  const match = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div
      className={`${
        match === "sent" ? "outerMostConSend" : "outerMostConRecieve"
      }`}
    >
      {match === "sent" ? (
        <div className={styles.SendContainer}>
          <div className={styles.infoDivSend}>
            <div>
              <span className={styles.displayNameSend}>
                {match === "sent" ? "You" : displayName}
              </span>
              <span className={styles.time}>
                {createdAt === null
                  ? async () => {
                      await moment(createdAt.toDate()).fromNow();
                    }
                  : moment(createdAt.toDate()).fromNow()}
              </span>
            </div>
            <div className={styles.textDivSend}>
              <span className={styles.textSend}>{text}</span>
            </div>
          </div>
          <div className={styles.displayPicSend}>
            <img src={photoURL} alt="display pic" />
          </div>
        </div>
      ) : (
        <div className={styles.RecieveContainer}>
          <div className={styles.displayPic}>
            <img src={photoURL} alt="display pic" />
          </div>
          <div className={styles.infoDiv}>
            <div>
              <span className={styles.displayName}>
                {match === "sent" ? "You" : displayName}
              </span>
              <span className={styles.time}>
                {createdAt === null
                  ? async () => {
                      await moment(createdAt.toDate()).fromNow();
                    }
                  : moment(createdAt.toDate()).fromNow()}
              </span>
            </div>
            <div className={styles.textDiv}>
              <span className={styles.text}>{text}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// moment(createdAt.toDate()).fromNow()
