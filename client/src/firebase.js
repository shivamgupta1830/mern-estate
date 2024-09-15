// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5327e.firebaseapp.com",
  projectId: "mern-estate-5327e",
  storageBucket: "mern-estate-5327e.appspot.com",
  messagingSenderId: "312933588071",
  appId: "1:312933588071:web:170389422f459f93a808c2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
