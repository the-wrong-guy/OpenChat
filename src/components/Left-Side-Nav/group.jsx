/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";
import { useDispatch, useSelector } from "react-redux";
import { realDB } from "../../firebase";
import { updateSelectedGrp } from "../../Redux/Action/action";
import styles from "./lsn.module.scss";

export default function Group({ grpName }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.CONFIG.userInfo);

  const handleDivClick = (e) => {
    console.log(e);
    dispatch(updateSelectedGrp(e));
  };

  const handleLeaveBtn = async (item) => {
    const RDBuserRef = realDB.ref(`users/${userInfo.userId}/joinedGrps`);
    if (userInfo.joinedGrps) {
      const filteredAry = userInfo.joinedGrps.filter((e) => e !== item);
      await RDBuserRef.set(filteredAry).catch((err) => {
        console.log(err);
      });
    }
  };
  return (
    <div className={styles.grp}>
      <div
        role="button"
        onClick={() => handleDivClick(grpName)}
        onKeyDown={() => handleDivClick(grpName)}
        style={{ display: "flex", alignItems: "center", width: "60%" }}
        tabIndex={0}
      >
        <GroupIcon className={styles.grpIcon} />
        <span className={styles.grpName}>{grpName}</span>
      </div>
      {}
      <Button
        style={{ textTransform: "unset", zIndex: "100", width: "40%" }}
        variant="outlined"
        color="secondary"
        size="small"
        onClick={() => handleLeaveBtn(grpName)}
      >
        Leave
      </Button>
    </div>
  );
}
