import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "public-chat-d77f2.firebaseapp.com",
  projectId: "public-chat-d77f2",
  storageBucket: "public-chat-d77f2.appspot.com",
  messagingSenderId: "186594219558",
  appId: "1:186594219558:web:6d9bc4497fe76c2a4fb8e7",
  measurementId: "G-R8RE824GE4",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const realDB = firebase.database();
