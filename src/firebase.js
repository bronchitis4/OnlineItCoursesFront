import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDm5eCrf_R5lyzJ3HkpJFjqTSL3L-tlCVQ",
  authDomain: "weblab4-120ec.firebaseapp.com",
  projectId: "weblab4-120ec",
  storageBucket: "weblab4-120ec.appspot.com",
  messagingSenderId: "782669029260",
  appId: "1:782669029260:web:46c8e731d0d4b617af80a9",
  measurementId: "G-NJP1NWCYDK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);