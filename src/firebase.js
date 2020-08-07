import firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyAnNipbnuXWwe7hLxpWK2s4CxmleNCuEWc",
  authDomain: "react-slack-apps.firebaseapp.com",
  databaseURL: "https://react-slack-apps.firebaseio.com",
  projectId: "react-slack-apps",
  storageBucket: "react-slack-apps.appspot.com",
  messagingSenderId: "919523688322",
  appId: "1:919523688322:web:d019d4685a0b018a5f199b",
  measurementId: "G-ZLG30TEPZK",
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
