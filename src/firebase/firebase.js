import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlLfIRzH_A7FZ9S6c-b3IjjtmT_EKK99I",
  authDomain: "crm-task-management.firebaseapp.com",
  projectId: "crm-task-management",
  storageBucket: "crm-task-management.firebasestorage.app",
  messagingSenderId: "180167881937",
  appId: "1:180167881937:web:881261ef6e64b030f3c1f0",
  measurementId: "G-WKW8XEY2LV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;