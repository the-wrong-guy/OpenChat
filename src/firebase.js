import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "public-chat-d77f2.firebaseapp.com",
  projectId: "public-chat-d77f2",
  storageBucket: "public-chat-d77f2.appspot.com",
  messagingSenderId: "186594219558",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-R8RE824GE4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const realDB = firebase.database();
