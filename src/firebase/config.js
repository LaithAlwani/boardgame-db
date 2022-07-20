// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1X15-ijN6YBkL6hwgL3DmoxXjE3_YWlk",
  authDomain: "bgdb-2dd2f.firebaseapp.com",
  projectId: "bgdb-2dd2f",
  storageBucket: "bgdb-2dd2f.appspot.com",
  messagingSenderId: "888021691344",
  appId: "1:888021691344:web:169b54fca0088cb95727d5",
  measurementId: "G-HXJ2MG9BWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);