// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwvoeT8tQsRKibLTKmAEYsmW07DhI_B7o",
  authDomain: "diabeteweb-9a012.firebaseapp.com",
  projectId: "diabeteweb-9a012",
  storageBucket: "diabeteweb-9a012.appspot.com", // Fixed incorrect storage domain
  messagingSenderId: "629871986323",
  appId: "1:629871986323:web:457837dfb8bcb24fff2f66",
  measurementId: "G-EZ0NDCZC4C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Auth

export { analytics, auth }; // Export auth for use in authentication components
