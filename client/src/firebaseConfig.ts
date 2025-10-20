// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQpLgRcRkhJcHtJrkX6KktoAYEknUj-GA",
    authDomain: "comicku-a4aae.firebaseapp.com",
    projectId: "comicku-a4aae",
    storageBucket: "comicku-a4aae.firebasestorage.app",
    messagingSenderId: "449222490773",
    appId: "1:449222490773:web:2038082d8995a70d11b99c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
