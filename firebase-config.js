// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDofjVLUy7y1TZHptJs3-k9bIzQZsWIiRI",
  authDomain: "monadfoklistweb3.firebaseapp.com",
  databaseURL: "https://monadfoklistweb3-default-rtdb.firebaseio.com/",
  projectId: "monadfoklistweb3",
  storageBucket: "monadfoklistweb3.firebasestorage.app",
  messagingSenderId: "598517998126",
  appId: "1:598517998126:web:40d9014269f4fb29f035bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };