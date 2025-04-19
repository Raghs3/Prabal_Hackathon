const { collection, getDocs } = require('firebase/firestore/lite');
const db = require('./firebase');

async function getProducts() {
  try {
    // Reference to the 'products' collection
    const productsCollection = collection(db, 'products');
    
    // Fetch all documents from the 'products' collection
    const querySnapshot = await getDocs(productsCollection);
    
    // Map through the documents and print product data
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

getProducts();
