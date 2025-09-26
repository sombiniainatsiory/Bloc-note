import { initializeApp } from "firebase/app";
import {
  getFirestore,
  enableIndexedDbPersistence,
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZFrgSE6y_ndIjyA0EHckAU0Zwb-gGUxc",
  authDomain: "pwa-tsiory-fi2401-064.firebaseapp.com",
  projectId: "pwa-tsiory-fi2401-064",
  storageBucket: "pwa-tsiory-fi2401-064.firebasestorage.app",
  messagingSenderId: "588621221751",
  appId: "1:588621221751:web:2dab2073d9f7b961149b72",
  measurementId: "G-8SBDBS393N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


enableIndexedDbPersistence(db).catch(() => {

});

export {
  db, serverTimestamp, collection, addDoc, onSnapshot, query, orderBy
};
