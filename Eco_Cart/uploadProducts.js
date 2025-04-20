const { collection, addDoc, query, where, getDocs, updateDoc } = require('firebase/firestore/lite');
const db = require('../firebase');
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
      // Check if a product with the same name already exists
      const productQuery = query(productsCollection, where('name', '==', product.name));
      const querySnapshot = await getDocs(productQuery);

      if (!querySnapshot.empty) {
        // If the product exists, compare the data
        const existingDoc = querySnapshot.docs[0]; // Get the first matching document
        const docRef = existingDoc.ref;
        const existingData = existingDoc.data();

        // Check if there are any changes
        const hasChanges = Object.keys(product).some(
          (key) => JSON.stringify(product[key]) !== JSON.stringify(existingData[key])
        );

        if (hasChanges) {
          // Update only if there are changes
          await updateDoc(docRef, product);
          console.log(`Updated existing product: ${product.name} (ID: ${docRef.id})`);
        } else {
          console.log(`No changes for product: ${product.name} (ID: ${docRef.id})`);
        }
      } else {
        // If the product does not exist, add it as a new document
        const docRef = await addDoc(productsCollection, product);
        console.log(`Added new product: ${product.name} (ID: ${docRef.id})`);
      }
    }

    console.log('All products processed successfully!');
  } catch (error) {
    console.error('Error uploading products:', error);
  }
}

// Call the function to upload products
uploadProducts();