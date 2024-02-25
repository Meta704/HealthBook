import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAC2Z-UiBy_COYJUE9Oh2KT8EoPU0fLoRQ",
  authDomain: "healthbook-d87ba.firebaseapp.com",
  databaseURL: "https://healthbook-d87ba-default-rtdb.firebaseio.com",
  projectId: "healthbook-d87ba",
  storageBucket: "healthbook-d87ba.appspot.com",
  messagingSenderId: "603316969059",
  appId: "1:603316969059:web:d48cb951a128bf401de256",
  measurementId: "G-SZSS87FSP6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const initialize = () => {
  try {
    initializeApp(firebaseConfig);
  } catch (error) {
    return false;
  }
  return true;
}