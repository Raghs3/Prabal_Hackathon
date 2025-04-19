import { db } from './firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Define the functions
async function addUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Test User",
      age: Math.floor(Math.random() * 50) + 20
    });
    console.log("User added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding user: ", e);
  }
}

async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (e) {
    console.error("Error getting users: ", e);
  }
}

// ✅ Attach the functions globally *after* they're declared
window.addUser = addUser;
window.getUsers = getUsers;
