import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlslk1Ub4OjkI7x-QwE0ne1NYTQc9z63g",
  authDomain: "fake-social-app-e763d.firebaseapp.com",
  projectId: "fake-social-app-e763d",
  storageBucket: "fake-social-app-e763d.appspot.com",
  messagingSenderId: "595936421624",
  appId: "1:595936421624:web:2dbdd80d73a346ff4f3d0d",
  measurementId: "G-2N4Y0BXNBE",
  databaseURL: "https://fake-social-app-e763d-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return firebaseConfig;
  }
}

export { db, storage };
