// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABCbl2c86484rVCVbU_9Cuo2cxu-ifMCU",
  authDomain: "elbouchrahm.firebaseapp.com",
  projectId: "elbouchrahm",
  storageBucket: "elbouchrahm.firebasestorage.app",
  messagingSenderId: "938974463777",
  appId: "1:938974463777:web:f3e70af94a2512345c6060",
  measurementId: "G-W606G9GF4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, analytics };
export default app;