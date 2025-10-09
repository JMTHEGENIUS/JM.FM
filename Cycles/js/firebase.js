import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGgmb1Lhi6iYFGrfgvG4v1q2E9Dsf2IL4",
  authDomain: "cosmic-blueprint-8a7f3.firebaseapp.com",
  projectId: "cosmic-blueprint-8a7f3",
  storageBucket: "cosmic-blueprint-8a7f3.firebasestorage.app",
  messagingSenderId: "1064528198761",
  appId: "1:1064528198761:web:49fab8d9735809178f36f8"
};


const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);
