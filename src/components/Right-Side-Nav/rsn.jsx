import React, { useEffect, useState, useMemo } from "react";
import firebase from "firebase";
import { Fab } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { db } from "../../firebase";
import styles from "./rsn.module.scss";

function RightNav() {
  console.log("Rendering");
  const userInfo = useSelector((state) => state.CONFIG.userInfo);
  const selectedGrp = useSelector((state) => state.CONFIG.selectedGrp);
  const usersRef = db
    .collection("groups")
    .doc(selectedGrp)
    .collection("members");
  const query = usersRef.orderBy("joinedAt", "asc");
  const [members] = useCollectionData(query, { idField: "id" });
  const [grpInfo, setGrpInfo] = useState(null);
  useEffect(() => {
    console.log(members);
    const unsub = db
      .collection("groups")
      .doc(selectedGrp)
      .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        setGrpInfo(doc.data());
      });
    return unsub;
  }, [selectedGrp]);

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
      }}
    >
      <div className={styles.adminOuterDiv}>
        {grpInfo && (
          <div
            style={{
              height: "140px",
              width: "100%",
              backgroundImage: `url(${grpInfo.grpBackgroundImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <span className={styles.grpName}>{grpInfo.grpName}</span>
            <span>{grpInfo.grpTagline}</span>
            {grpInfo && userInfo && grpInfo.adminId === userInfo.userId ? (
              <span>Delete</span>
            ) : (
              <span>Details</span>
            )}
          </div>
        )}

        <div className={styles.header}>
          <span>Admin</span>
        </div>
        <div className={styles.personDiv}>
          {(grpInfo && (
            <img
              className={styles.icon}
              src={grpInfo.adminPic}
              alt="admin display pic"
            />
          )) || <PersonIcon className={styles.icon} />}

          <span>{grpInfo && grpInfo.admin}</span>
        </div>
      </div>
      <div className={styles.memberOuterDiv}>
        <div className={styles.header}>
          <span>Members</span>
        </div>
        <div className={styles.memberDiv}>
          {members !== undefined && members.length !== 0 ? (
            members.map((m, id) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={id} className={styles.personDiv}>
                {m.displayPic ? (
                  <img
                    src={m.displayPic}
                    className={styles.icon}
                    alt="display pic"
                  />
                ) : (
                  <PersonIcon className={styles.icon} />
                )}

                <span>{m.displayName}</span>
              </div>
            ))
          ) : (
            <span style={{ textAlign: "center" }}>No members yet!</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RightNav);
