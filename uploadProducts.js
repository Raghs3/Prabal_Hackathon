const { collection, setDoc, doc, getDoc } = require('firebase/firestore/lite');
const db = require('./firebase');
const fs = require('fs');
const path = require('path');

async function updateProducts() {
  try {
    // Read the updated products.json file
    const filePath = path.join(__dirname, 'products.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(fileData);

    // Reference to the 'products' collection
    const productsCollection = collection(db, 'products');

    // Update each product in Firestore
    for (const product of products) {
      // Sanitize the document ID by replacing slashes with underscores
      const sanitizedDocId = product.name.replace(/\//g, '_');

      const productDoc = doc(productsCollection, sanitizedDocId); // Use sanitized name as the document ID

      // Check if the document already exists
      const existingDoc = await getDoc(productDoc);
      if (existingDoc.exists()) {
        console.log(`Updated existing product: ${product.name} (ID: ${sanitizedDocId})`);
      } else {
        console.log(`Added new product: ${product.name} (ID: ${sanitizedDocId})`);
      }

      // Add or update the document
      await setDoc(productDoc, product, { merge: true }); // Merge new fields with existing data
    }

    console.log('All products processed successfully!');
  } catch (error) {
    console.error('Error updating products:', error);
  }
}

// Call the function to update products
updateProducts();