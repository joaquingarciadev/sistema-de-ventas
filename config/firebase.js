// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-tIzVs48R5egjSkdLk4LXXCPdVmtNOS0",
  authDomain: "app-sistema-de-ventas.firebaseapp.com",
  projectId: "app-sistema-de-ventas",
  storageBucket: "app-sistema-de-ventas.appspot.com",
  messagingSenderId: "66246747834",
  appId: "1:66246747834:web:4181d14c10a8390dd1c483",
  measurementId: "G-P2F4NYFMRW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);