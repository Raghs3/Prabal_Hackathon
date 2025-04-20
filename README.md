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
