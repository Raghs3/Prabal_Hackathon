const { collection, addDoc } = require('firebase/firestore/lite');
const db = require('./firebase');

const productData = {
  name: "Mamaearth Ultra Light Indian Sunscreen SPF 50",
  brand: "Mamaearth",
  materials: "Contains Turmeric (Tetrahydrocurcumin), Glycerin, Phospholipids, Titanium Dioxide, and Parsol Mcx (Octinoxate). Further research is needed to confirm the complete ingredient list.",
  certifications: ["Made Safe"],
  packaging: "Information regarding the packaging material and recyclability requires further investigation.",
  brand_ethics: "Mamaearth claims a commitment to sustainability, natural ingredients, and toxin-free formulations. Independent verification of their ethical sourcing and manufacturing practices is needed.",
  manufacturing: "Details on Mamaearth's eco-friendly manufacturing practices are not readily available and require further investigation.",
  end_of_life: "Disposal and recyclability instructions are unavailable and need to be verified through the product packaging or Mamaearth's customer service.",
  cruelty_free: true,
  vegan: "Unknown",
  category: "Personal Care Products",
  rating: null
};

async function addProduct() {
  try {
    const productsCollection = collection(db, 'products');
    const docRef = await addDoc(productsCollection, productData);
    console.log('Product added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

addProduct();
