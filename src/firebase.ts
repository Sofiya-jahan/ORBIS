// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "iprap-5c076.firebaseapp.com",
  projectId: "iprap-5c076",
  storageBucket: "iprap-5c076.firebasestorage.app",
  messagingSenderId: "25955177934",
  appId: "1:25955177934:web:8fa619e599086a4ab8879f",
  measurementId: "G-EV5KFMW7E6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
