import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDRfqpZz5vMKjBjZwjqhbF0WHK0hXzMxnM",
  authDomain: "allergy-tracker-9f9c5.firebaseapp.com",
  projectId: "allergy-tracker-9f9c5",
  storageBucket: "allergy-tracker-9f9c5.appspot.com",
  messagingSenderId: "1093305670670",
  appId: "1:1093305670670:web:3c9a4c1f3fa9d9c6c3b9c5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);