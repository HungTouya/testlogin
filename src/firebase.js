// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";  

const firebaseConfig = {  
  apiKey: "AIzaSyC9pAhQ2CFE3CmEB3wyhIZLTlnV2QFbzcc",  
  authDomain: "asdf-fdd3b.firebaseapp.com",  
  projectId: "asdf-fdd3b",  
  storageBucket: "asdf-fdd3b.appspot.com",  
  messagingSenderId: "146345956782",  
  appId: "1:146345956782:web:2b0fd0d8689ff63714243f",  
  measurementId: "G-F77T4WYQ0D",  
};  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Firestore initialized correctly
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
export default app;

