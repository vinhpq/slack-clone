import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyAENtSbNiE0HFJN2pGDbzqO8RitUh34cY4",
    authDomain: "slack-clone-a6829.firebaseapp.com",
    databaseURL: "https://slack-clone-a6829.firebaseio.com",
    projectId: "slack-clone-a6829",
    storageBucket: "slack-clone-a6829.appspot.com",
    messagingSenderId: "268506383891",
    appId: "1:268506383891:web:65ece7831405463b5321e6",
    measurementId: "G-LTH9372YDY"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { auth, provider };
  export default db;