// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBijZHZ8N6MCnAsGcD4Y8iZ9yWS3Vtzdm0",
  authDomain: "lenskart-3ac40.firebaseapp.com",
  projectId: "lenskart-3ac40",
  storageBucket: "lenskart-3ac40.firebasestorage.app",
  messagingSenderId: "20976950753",
  appId: "1:20976950753:web:c19037ad73c11581fa86a0",
  measurementId: "G-Y0NFD8RQH3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { auth, app, messaging };
