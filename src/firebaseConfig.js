// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwywNjnLnxtMsrN9y7xPSwNY6INbqIz6M",
    authDomain: "urban-sunrise-cafe.firebaseapp.com",
    projectId: "urban-sunrise-cafe",
    storageBucket: "urban-sunrise-cafe.appspot.com",
    messagingSenderId: "805258973019",
    appId: "1:805258973019:web:ade3de93a1da42df55947e",
    measurementId: "G-M6LWBKSMFK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
