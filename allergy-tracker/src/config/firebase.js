import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB45sMZ5_OVV_jI7jaZmWZrWdfKKYtpFKo",
  authDomain: "allertrack.firebaseapp.com",
  projectId: "allertrack",
  storageBucket: "allertrack.firebasestorage.app",
  messagingSenderId: "29377535345",
  appId: "1:29377535345:web:b6943e76e0a1c394f7aad0",
  measurementId: "G-Y5ML2SEF8K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;