import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbnknXhx9VYY9L8UFW6uMpNYLM6SRsMVg",
  authDomain: "solving-systems-activities.firebaseapp.com",
  projectId: "solving-systems-activities",
  storageBucket: "solving-systems-activities.firebasestorage.app",
  messagingSenderId: "81374640982",
  appId: "1:81374640982:web:ad4796df648ddf464774f7",
  measurementId: "G-G258FQT9EK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
