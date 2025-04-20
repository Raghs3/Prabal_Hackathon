# EcoCart – Sustainable Shopping Assistant

EcoCart is a web application designed to promote sustainable shopping by providing users with detailed information about eco-friendly products. The app rates products based on their eco-friendliness (materials, brand ethics, certifications, etc.) and suggests greener alternatives. It also allows users to add new products, manage the product database, and save data to a Firestore database.

---

## Features

### 1. **Product Catalog**
- Displays a categorized list of eco-friendly products.
- Each product card includes:
  - Product name, brand, and category.
  - Materials used, certifications, and brand ethics.
  - Eco-friendliness rating (0-10) with a visual indicator.
  - Greener alternatives and end-of-life information.
  - Tags for "Cruelty-Free" and "Vegan" products.

### 2. **Add New Products**
- Users can add new products via a modal form.
- The form includes fields for:
  - Product name, brand, category, materials, certifications, packaging, and more.
  - Eco-friendliness rating (slider input).
  - Image URL for the product.

### 3. **Firestore Integration**
- All product data is stored in a Firestore database.
- Products are fetched dynamically from Firestore and displayed on the website.
- New products are added directly to Firestore, ensuring real-time updates.

### 4. **AI Agent Integration**
- An AI Agent powered by **Gemini LLM** is integrated into the project.
- The AI Agent assists in analyzing product data and suggesting greener alternatives.
- It uses advanced natural language processing to provide insights into product sustainability.

### 5. **Save to Server**
- Users can save the product database to the Firestore server.
- A "Save to Server" button triggers the upload of all locally stored product data to Firestore.

### 6. **Download JSON**
- Users can download the product database as a JSON file for offline use or backup.

---

## Project Structure

```
Prabal_Hackathon/
├── README.md
├── firebase.js
├── uploadProducts.js
├── Eco_Cart/
│   ├── index.html
│   ├── styles.css
│   ├── product-form.css
│   ├── database-management.css
│   ├── script.js
│   ├── add-product.js
│   ├── database-management.js
│   ├── products.json (optional, used for initial data)
```

### Key Files
1. **`firebase.js`**:
   - Handles Firebase initialization and Firestore configuration.
   - Provides a `db` instance for interacting with the Firestore database.

2. **`uploadProducts.js`**:
   - Reads product data from a JSON file and uploads it to Firestore.
   - Checks for existing products in Firestore and updates them if changes are detected.

3. **`Eco_Cart/index.html`**:
   - The main HTML file for the web app.
   - Includes links to stylesheets and scripts.

4. **`Eco_Cart/script.js`**:
   - Fetches product data from Firestore and displays it on the website.
   - Groups products by category and renders them as cards.

5. **`Eco_Cart/add-product.js`**:
   - Manages the "Add Product" form and saves new products to Firestore.

6. **`Eco_Cart/database-management.js`**:
   - Handles database-related operations like saving and downloading JSON files.

7. **`Eco_Cart/products.json`**:
   - An optional file used for initial product data (can be replaced by Firestore).

---

## Firestore Integration

### Firestore Setup
1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Enable Firestore**:
   - In the Firebase Console, navigate to the Firestore Database section and enable it.

3. **Add Firebase Configuration**:
   - Add your Firebase configuration to `firebase.js`:
     ```javascript
     import { initializeApp } from 'firebase/app';
     import { getFirestore } from 'firebase/firestore/lite';

     const firebaseConfig = {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_AUTH_DOMAIN",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_STORAGE_BUCKET",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);

     export { db };
     ```

4. **Firestore Rules**:
   - Update Firestore rules to allow read and write access during development:
     ```json
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true; // Replace with proper authentication rules in production
         }
       }
     }
     ```

### Fetching Products from Firestore
- Products are fetched dynamically from Firestore using the `getDocs` method:
  ```javascript
  import { collection, getDocs } from 'firebase/firestore/lite';
  import { db } from '../firebase.js';

  async function fetchProductsFromFirestore() {
      const productsCollection = collection(db, 'products');
      const querySnapshot = await getDocs(productsCollection);
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(productsArray);
  }
  ```

### Adding Products to Firestore
- New products are added to Firestore using the `addDoc` method:
  ```javascript
  import { collection, addDoc } from 'firebase/firestore/lite';
  import { db } from '../firebase.js';

  async function saveProductToDatabase(newProduct) {
      try {
          const productsCollection = collection(db, 'products');
          await addDoc(productsCollection, newProduct);
          console.log('Product added successfully!');
      } catch (error) {
          console.error('Error adding product:', error);
      }
  }
  ```

---

## AI Agent Integration (Gemini LLM)

### Overview
The AI Agent is powered by **Gemini LLM**, a state-of-the-art large language model. It is integrated into the project to provide intelligent insights and recommendations.

### Features
1. **Product Analysis**:
   - The AI Agent analyzes product data to identify areas for improvement in sustainability.
   - It suggests greener alternatives based on the product's materials, certifications, and brand ethics.

2. **Natural Language Processing**:
   - Users can interact with the AI Agent to ask questions about products or sustainability practices.

3. **Integration with Firestore**:
   - The AI Agent fetches product data directly from Firestore for real-time analysis.

---

## How to Run the Project

### Prerequisites
- Node.js and npm installed on your system.
- A Firebase project with Firestore enabled.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/ecocart.git
   cd ecocart
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start a Local Server**:
   - Use **Live Server** in VS Code or run:
     ```bash
     npx http-server
     ```

4. **Access the App**:
   - Open `http://localhost:8080` in your browser.

---

## Future Enhancements
- Add user authentication for personalized product recommendations.
- Integrate AI-powered chat for real-time sustainability advice.
- Expand the database to include more product categories and certifications.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributors
- **Raghav** - Developer
- **Gemini LLM** - AI Agent Integration
- **Firebase** - Database and Hosting