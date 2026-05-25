import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBL6L7O9iJ1c5Fv9VNM_DprTbF5LYOVArg",
  authDomain: "study-planner-3058c.firebaseapp.com",
  projectId: "study-planner-3058c",
  storageBucket: "study-planner-3058c.firebasestorage.app",
  messagingSenderId: "112793029737",
  appId: "1:112793029737:web:c29d51ed581d721da826f8",
  measurementId: "G-9FHH0L931P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
