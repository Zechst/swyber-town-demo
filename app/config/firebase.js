// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRvzSq0KFBHug66EZjKL74c5lbRm8w-9U",
  authDomain: "swyber-town-demo.firebaseapp.com",
  databaseURL:
    "https://swyber-town-demo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "swyber-town-demo",
  storageBucket: "swyber-town-demo.firebasestorage.app",
  messagingSenderId: "349926698372",
  appId: "1:349926698372:web:d31d1464a6ee045f31c1d1",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

console.log("Firebase initialized:", firebaseApp.name); // Should log "[DEFAULT]"

// Initialize and export the Auth instance
export const auth = getAuth(firebaseApp);
console.log("Auth object:", auth); // Should log the Auth instance details

// Initialize Firebase Realtime Database
export const database = getDatabase(firebaseApp);

// Export the Firebase app
export default firebaseApp;
