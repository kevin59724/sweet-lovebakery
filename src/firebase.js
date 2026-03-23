import { initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAnxit-w0PnoTvyr4VQHnIs-gBQIR3V5i0",
  authDomain: "karisbakery.firebaseapp.com",
  projectId: "karisbakery",
  storageBucket: "karisbakery.firebasestorage.app",
  messagingSenderId: "493727553562",
  appId: "1:493727553562:web:6794ca5ced4c3e9e8059a3",
  measurementId: "G-XZ0YY082WW"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { getApp };
