
// firebase.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore/lite'); // Note: Use firestore/lite for client-side


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

module.exports = db;
