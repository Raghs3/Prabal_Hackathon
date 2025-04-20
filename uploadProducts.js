const { collection, addDoc } = require('firebase/firestore/lite');
const db = require('./firebase');
const fs = require('fs');
const path = require('path');

async function uploadProducts() {
  try {
    // Read the products.json file
    const filePath = path.join(__dirname, 'products.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(fileData);

    // Reference to the 'products' collection
    const productsCollection = collection(db, 'products');

    // Upload each product to Firestore
    for (const product of products) {
      const docRef = await addDoc(productsCollection, product);
      console.log(`Product added with ID: ${docRef.id}`);
    }

    console.log('All products uploaded successfully!');
  } catch (error) {
    console.error('Error uploading products:', error);
  }
}

// Call the function to upload products
uploadProducts();