// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4Y7NvfP8FTn7Iuh8wh7_MmVgjFYiKZ8g",
  authDomain: "next-chord.firebaseapp.com",
  projectId: "next-chord",
  storageBucket: "next-chord.firebasestorage.app",
  messagingSenderId: "988708675976",
  appId: "1:988708675976:web:e68d8005a4e6e6aae19a3d",
  measurementId: "G-KKMCQ16HXJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
