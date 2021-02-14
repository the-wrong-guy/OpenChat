/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  IconButton,
  Button,
  Dialog,
  Paper,
  Tooltip,
  Fab,
} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import GroupIcon from "@material-ui/icons/Group";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import EditIcon from "@material-ui/icons/Edit";
import { db, storage, realDB } from "../../firebase";
import styles from "./lsn.module.scss";

import Group from "./group";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function LeftNav() {
  const userInfo = useSelector((state) => state.CONFIG.userInfo);
  const selectedGrp = useSelector((state) => state.CONFIG.selectedGrp);
  const [preview, setPreview] = useState({
    imgPreview: null,
    bgPreview: null,
  });
  const [exploreGrps, setExploreGrps] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [grpImg, setGrpImg] = useState(null);
  const [grpBGImg, setGrpBGImg] = useState(null);
  const [grpName, setGrpName] = useState("");
  const [grpTagline, setGrpTagline] = useState("");
  const [open, setOpen] = useState(false);
  const resetGrpFormData = () => {
    setGrpName("");
    setGrpTagline("");
    setGrpBGImg(null);
    setGrpImg(null);
    setPreview(() => ({ imgPreview: null, bgPreview: null }));
  };

  const [grpInfo, setGrpInfo] = useState(null);
  useEffect(() => {
    const unsub = db
      .collection("groups")
      .doc(selectedGrp)
      .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        setGrpInfo(doc.data());
      });
    return unsub;
  }, [selectedGrp]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    resetGrpFormData();
  };

  const handleCreateGrp = async () => {
    if (grpName && grpTagline) {
      try {
        setCreatingUser(true);
        const groupRef = db.collection("groups").doc(grpName);
        const RDBuserRef = realDB.ref(`users/${userInfo.userId}/joinedGrps`);
        const storageRef = storage.ref();
        const groupImageref = storageRef.child(
          `GroupInfoImages/${uuidv4()}-${grpImg.name}`
        );
        await groupImageref.put(grpImg);
        const groupImgFileUrl = await groupImageref.getDownloadURL();

        const groupBGImageref = storageRef.child(
          `GroupInfoImages/${uuidv4()}-${grpBGImg.name}`
        );
        await groupBGImageref.put(grpBGImg);
        const groupBGImgFileUrl = await groupBGImageref.getDownloadURL();

        groupRef.get().then(async (docSnapshot) => {
          if (docSnapshot.exists) {
            setCreatingUser(false);
            // eslint-disable-next-line no-useless-return
            return;
          }
          await groupRef.set({
            grpName,
            grpTagline,
            grpImg: groupImgFileUrl,
            grpBackgroundImg: groupBGImgFileUrl,
            admin: userInfo.displayName,
            adminPic: userInfo.displayPic,
            adminId: userInfo.userId,
          });
          RDBuserRef.set([...userInfo.joinedGrps, grpName]).catch((err) => {
            console.log(err);
          });
        });
        setOpen(false);
        resetGrpFormData();
        setCreatingUser(false);
      } catch (error) {
        setCreatingUser(false);
        console.log("Something went wrong while creating your Group");
      }
    } else {
      console.log("Please enter a group name and tagline");
    }
  };

  const handleGrpImgChange = (e) => {
    if (e.target.files[0]) {
      const img = e.target.files[0];
      setGrpImg(img);
      const objectUrl = URL.createObjectURL(img);
      setPreview((prev) => ({ ...prev, imgPreview: objectUrl }));
    }
  };

  const handleGrpBGImgChange = (e) => {
    if (e.target.files[0]) {
      const img = e.target.files[0];
      setGrpBGImg(img);
      const objectUrl = URL.createObjectURL(img);
      setPreview((prev) => ({ ...prev, bgPreview: objectUrl }));
    }
  };

  const handleExploreGroups = () => {
    db.collection("groups")
      .where("grpName", "not-in", userInfo.joinedGrps)
      .get()
      .then((querySnapshot) => {
        const tempData = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          tempData.push(doc.data());
        });
        console.log(tempData);
        setExploreGrps(tempData);
      })
      .catch((error) => {
        console.log("Error getting documents...", error);
      });
  };

  const handleJoinGrp = async (e) => {
    try {
      const RDBuserRef = realDB.ref(`users/${userInfo.userId}/joinedGrps`);
      let localAdminId;
      db.collection("groups")
        .doc(e)
        .onSnapshot((doc) => {
          console.log("Current data: ", doc.data());
          const dta = doc.data();
          localAdminId = dta.adminId;
        });
      if (userInfo.userId === localAdminId) {
        return;
      }
      await db
        .collection("groups")
        .doc(e)
        .collection("members")
        .doc(userInfo.userId)
        .set({
          userId: userInfo.userId,
          displayName: userInfo.displayName,
          displayPic: userInfo.displayPic,
          joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          RDBuserRef.set([...userInfo.joinedGrps, e]).catch((err) => {
            console.log(err);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ height: "100%" }}>
      <div className={styles.joinedGrps}>
        <div className={styles.header}>Groups</div>
        <div className={styles.grpsList}>
          {userInfo &&
            userInfo.joinedGrps &&
            userInfo.joinedGrps.map((grp, id) => (
              <Group grpName={grp} key={id} />
            ))}
        </div>
      </div>
      <div className={styles.exploreGrps}>
        <div className={styles.header}>Explore</div>
        <div className={styles.grpsList}>
          <div className={styles.grp}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <GroupIcon className={styles.grpIcon} />
              <span className={styles.grpName}>Godzilla</span>
            </div>
            <Button
              style={{ textTransform: "unset" }}
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleExploreGroups}
            >
              Explore
            </Button>
          </div>
          {exploreGrps &&
            exploreGrps.map((d) => (
              <div key={uuidv4()} className={styles.grp}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <GroupIcon className={styles.grpIcon} />
                  <span className={styles.grpName}>{d.grpName}</span>
                </div>
                <Button
                  style={{ textTransform: "unset" }}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => handleJoinGrp(d.grpName)}
                >
                  Join
                </Button>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.createGrp}>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          onClick={handleClickOpen}
          aria-label="create-button"
        >
          <AddIcon />
        </Fab>
        <span>Create a Group</span>
      </div>
      <ThemeProvider theme={theme}>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: "340px",
              height: "370px",
              borderRadius: "15px",
            },
          }}
          aria-labelledby="form-dialog-title"
          className={styles.dialogBox}
        >
          <div className={styles.grpForm}>
            <div
              className={styles.grpProfileDiv}
              style={{
                backgroundImage: `url(${preview.bgPreview})`,
              }}
            >
              <input
                style={{ display: "none" }}
                accept="image/*"
                type="file"
                id="grp-bgimg-input"
                onChange={handleGrpBGImgChange}
              />
              <label htmlFor="grp-bgimg-input">
                <Tooltip
                  title="Add Background Group Image"
                  aria-label="Add Background Group Image"
                >
                  <IconButton style={{ float: "right" }} component="span">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </label>
              <div className={styles.grpImgDiv}>
                {preview.imgPreview ? (
                  <img
                    className={styles.grpImg}
                    src={preview.imgPreview}
                    alt="group preview img"
                  />
                ) : (
                  <img
                    src="https://s2.svgbox.net/materialui.svg?ic=person&color=000"
                    className={styles.grpImg}
                    alt="group preview img"
                  />
                )}

                <input
                  style={{ display: "none" }}
                  accept="image/*"
                  type="file"
                  id="grp-img-input"
                  onChange={handleGrpImgChange}
                />
                <label className={styles.iconLabel} htmlFor="grp-img-input">
                  <Tooltip title="Add Group Photo" aria-label="add group image">
                    <Fab size="small" aria-label="edit" component="span">
                      <AddAPhotoIcon
                        size="small"
                        style={{ color: "#252525" }}
                      />
                    </Fab>
                  </Tooltip>
                </label>
              </div>
            </div>
            <div className={styles.inputsBtndiv}>
              <Paper elevation={10} className={styles.inputCards}>
                <input
                  value={grpName}
                  onChange={(e) => setGrpName(e.target.value)}
                  type="text"
                  name="group-name"
                  placeholder="Enter a Group Name"
                />
              </Paper>
              <Paper elevation={10} className={styles.inputCards}>
                <input
                  value={grpTagline}
                  onChange={(e) => setGrpTagline(e.target.value)}
                  type="text"
                  name="group-tagline"
                  placeholder="Enter your Group tagline"
                />
              </Paper>

              <div
                style={{
                  display: "flex",
                  width: "80%",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  className={styles.drawerBtn1}
                  variant="contained"
                  onClick={handleClose}
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  className={styles.drawerBtn2}
                  variant="contained"
                  onClick={handleCreateGrp}
                  size="small"
                >
                  {creatingUser ? (
                    <img
                      src="https://s2.svgbox.net/loaders.svg?ic=tail-spin&color=ffffff"
                      width="32"
                      height="32"
                      alt="creating user"
                    />
                  ) : (
                    <span>Create</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}

export default React.memo(LeftNav);
