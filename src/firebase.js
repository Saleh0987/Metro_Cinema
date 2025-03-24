// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
const firebaseConfig = {
  apiKey: "AIzaSyBNU1hX5K7WHastcEUV7TWq9IG5a41jwDY",
  authDomain: "metro-8d5cd.firebaseapp.com",
  projectId: "metro-8d5cd",
  storageBucket: "metro-8d5cd.firebasestorage.app",
  messagingSenderId: "1591666781",
  appId: "1:1591666781:web:25ed1d1cffa23544a685b4",
  measurementId: "G-QEDDQ9C26D",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 
export { app, analytics, db };