import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCcJqqAz8014Ou6bjp5T9RDWRUN39LIxVk",
    authDomain: "cricekt-d58bd.firebaseapp.com",
    projectId: "cricekt-d58bd",
    storageBucket: "cricekt-d58bd.firebasestorage.app",
    messagingSenderId: "445044254938",
    appId: "1:445044254938:web:e544e429758d4e7ae89de3",
    measurementId: "G-B8WENVP72F"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };
