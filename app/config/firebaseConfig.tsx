// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAl6UQY2JXXxAeO4zL_ItyQALZFi7s1e8",
  authDomain: "warehouse-management-89f30.firebaseapp.com",
  projectId: "warehouse-management-89f30",
  storageBucket: "warehouse-management-89f30.firebasestorage.app",
  messagingSenderId: "134588391364",
  appId: "1:134588391364:web:f8d575f910edec2690ce91",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
