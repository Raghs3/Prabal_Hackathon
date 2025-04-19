
// firebase.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore/lite'); // Note: Use firestore/lite for client-side

const firebaseConfig = {
    apiKey: "AIzaSyB92l7OBqQtBABrrvYdXd4nheL3efrrFlw",
    authDomain: "eco-cart-9d811.firebaseapp.com",
    projectId: "eco-cart-9d811",
    storageBucket: "eco-cart-9d811.firebasestorage.app",
    messagingSenderId: "488801897373",
    appId: "1:488801897373:web:2885294fe80fe20072fd74",
    measurementId: "G-XGC65R7NBV"
  };
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

module.exports = db;
