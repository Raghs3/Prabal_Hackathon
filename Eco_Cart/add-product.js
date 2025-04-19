// Add a function to create and show the Add Product form
function showAddProductForm() {
  // Create overlay and modal
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal-container';
  modal.innerHTML = `
    <div class="modal-header">
      <h2>Add New Product</h2>
      <button class="close-modal">&times;</button>
    </div>
    <form id="add-product-form">
      <div class="form-group">
        <label for="product-name">Product Name*</label>
        <input type="text" id="product-name" required>
      </div>
      
      <div class="form-group">
        <label for="product-brand">Brand*</label>
        <input type="text" id="product-brand" required>
      </div>
      
      <div class="form-group">
        <label for="product-category">Category*</label>
        <select id="product-category" required>
          <option value="">Select a category</option>
          <option value="Reusable Bottles and Cups">Reusable Bottles and Cups</option>
          <option value="Eco Friendly Bags">Eco Friendly Bags</option>
          <option value="Sustainable Clothing">Sustainable Clothing</option>
          <option value="Personal Care Products">Personal Care Products</option>
          <option value="Home Essentials">Home Essentials</option>
          <option value="Stationery">Stationery</option>
          <option value="Zero Waste Kits Starter Packs">Zero Waste Kits Starter Packs</option>
          <option value="Sustainable Tech Accessories">Sustainable Tech Accessories</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="product-materials">Materials</label>
        <input type="text" id="product-materials" placeholder="e.g., Bamboo, Organic Cotton, Recycled Plastic">
      </div>
      
      <div class="form-group">
        <label for="product-certifications">Certifications</label>
        <input type="text" id="product-certifications" placeholder="e.g., FSC, Fair Trade, GOTS (comma separated)">
      </div>
      
      <div class="form-group">
        <label for="product-packaging">Packaging</label>
        <input type="text" id="product-packaging" placeholder="e.g., Biodegradable packaging, No plastic">
      </div>
      
      <div class="form-group">
        <label for="product-brand-ethics">Brand Ethics</label>
        <textarea id="product-brand-ethics" placeholder="Summary of the brand's sustainability and ethical practices"></textarea>
      </div>
      
      <div class="form-group">
        <label for="product-manufacturing">Manufacturing</label>
        <input type="text" id="product-manufacturing" placeholder="e.g., Made in renewable energy powered factory">
      </div>
      
      <div class="form-group">
        <label for="product-end-of-life">End of Life</label>
        <input type="text" id="product-end-of-life" placeholder="e.g., Compostable, Recyclable, Biodegradable">
      </div>
      
      <div class="form-checkbox-group">
        <div class="checkbox-container">
          <input type="checkbox" id="product-cruelty-free">
          <label for="product-cruelty-free">Cruelty Free</label>
        </div>
        
        <div class="checkbox-container">
          <input type="checkbox" id="product-vegan">
          <label for="product-vegan">Vegan</label>
        </div>
      </div>
      
      <div class="form-group">
        <label for="product-rating">Eco-Friendliness Rating (0-10)*</label>
        <input type="range" id="product-rating" min="0" max="10" step="0.5" value="5" required>
        <output id="rating-output">5.0</output>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-secondary cancel-btn">Cancel</button>
        <button type="submit" class="btn-primary">Add Product</button>
      </div>
    </form>
  `;
  
  // Append to DOM
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Add event listeners
  document.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  document.querySelector('.cancel-btn').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  // Rating slider output update
  const ratingSlider = document.getElementById('product-rating');
  const ratingOutput = document.getElementById('rating-output');
  
  ratingSlider.addEventListener('input', () => {
    ratingOutput.textContent = ratingSlider.value;
  });
  
  // Handle form submission
  document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addProductToDatabase();
  });
}

// Function to collect form data and add to the database
function addProductToDatabase() {
  // Get form values
  const newProduct = {
    name: document.getElementById('product-name').value.trim(),
    brand: document.getElementById('product-brand').value.trim(),
    category: document.getElementById('product-category').value,
    materials: document.getElementById('product-materials').value.trim(),
    certifications: document.getElementById('product-certifications').value.trim()
                   ? document.getElementById('product-certifications').value.split(',').map(item => item.trim())
                   : [],
    packaging: document.getElementById('product-packaging').value.trim(),
    brand_ethics: document.getElementById('product-brand-ethics').value.trim(),
    manufacturing: document.getElementById('product-manufacturing').value.trim(),
    end_of_life: document.getElementById('product-end-of-life').value.trim(),
    cruelty_free: document.getElementById('product-cruelty-free').checked,
    vegan: document.getElementById('product-vegan').checked,
    rating: parseFloat(document.getElementById('product-rating').value)
  };
  
  // Validate required fields
  if (!newProduct.name || !newProduct.brand || !newProduct.category) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  // Save the product to the database (using localStorage in this example)
  saveProductToDatabase(newProduct);
}

// Function to save the product to the database
function saveProductToDatabase(newProduct) {
  // First, fetch the existing database
  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load product database');
      }
      return response.json();
    })
    .then(productsArray => {
      // Add the new product
      productsArray.push(newProduct);
      
      // In a real-world scenario, we would send this to a server endpoint
      // Since we're working locally, we'll simulate saving with localStorage
      localStorage.setItem('products', JSON.stringify(productsArray));
      
      // Show success message
      showNotification('Product added successfully!', 'success');
      
      // Close the modal
      const overlay = document.querySelector('.modal-overlay');
      if (overlay) {
        document.body.removeChild(overlay);
      }
      
      // Refresh the product display
      refreshProductDisplay(productsArray);
    })
    .catch(error => {
      console.error('Error saving product:', error);
      showNotification('Failed to save product. Please try again.', 'error');
    });
}

// Function to refresh the product display
function refreshProductDisplay(productsArray) {
  // Clear current display
  const container = document.getElementById('products-container');
  container.innerHTML = '';
  
  // Re-display all products using the updated array
  const categories = {};
  
  // Group products by category
  productsArray.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push(product);
  });
  
  // Render each category (reusing the original display logic)
  Object.entries(categories).forEach(([categoryName, products]) => {
    // Create category section
    const section = document.createElement('div');
    section.className = 'category-section';
    
    const heading = document.createElement('h2');
    heading.textContent = categoryName;
    section.appendChild(heading);
    
    // Create product grid
    const productGrid = document.createElement('div');
    productGrid.className = 'product-grid';
    
    // Render each product card
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      // Set rating color based on score
      const ratingColor = getRatingColor(product.rating);
      
      // Create card HTML
      card.innerHTML = `
        <div class="card-inner">
          <div class="product-front" style="border-color: ${ratingColor}">
            <h3 class="product-name">${product.name}</h3>
            <p class="brand">${product.brand}</p>
            <div class="product-image">
              <img src="placeholder.jpg" alt="${product.name}" loading="lazy">
            </div>
            <div class="rating" style="background-color: ${ratingColor}">
              <span class="rating-stars">${getRatingStars(product.rating)}</span>
              <span class="rating-score">${product.rating}/10</span>
            </div>
          </div>
          
          <div class="product-back">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-details">
              <div class="detail-row">
                <strong>Materials:</strong> 
                <span>${product.materials || 'Not specified'}</span>
              </div>
              <div class="detail-row">
                <strong>Certifications:</strong> 
                <span>${formatListProperty(product.certifications)}</span>
              </div>
              <div class="detail-row">
                <strong>Brand Ethics:</strong> 
                <span>${formatListProperty(product.brand_ethics)}</span>
              </div>
              <div class="detail-row">
                <strong>Manufacturing:</strong> 
                <span>${Array.isArray(product.manufacturing) ? 'Various locations' : (product.manufacturing || 'Not specified')}</span>
              </div>
              <div class="detail-row">
                <strong>End of Life:</strong> 
                <span>${product.end_of_life || 'Not specified'}</span>
              </div>
              <div class="tags">
                ${product.cruelty_free ? '<span class="tag tag-cruelty-free">Cruelty Free</span>' : ''}
                ${product.vegan ? '<span class="tag tag-vegan">Vegan</span>' : ''}
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add flip functionality
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
      
      productGrid.appendChild(card);
    });
    
    section.appendChild(productGrid);
    container.appendChild(section);
  });
  
  // Re-add filter functionality
  setupFilters(categories);
}

// Function to show notifications
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

// Function to create and initialize the Save to Server feature
function setupSaveToServerButton() {
  const saveButton = document.createElement('button');
  saveButton.id = 'save-to-server';
  saveButton.className = 'save-to-server-btn';
  saveButton.innerHTML = '<span>Save Database to Server</span>';
  
  // Position at bottom right of the page
  document.body.appendChild(saveButton);
  
  // Add click event
  saveButton.addEventListener('click', () => {
    saveToServer();
  });
}

// Function to save products data to server
function saveToServer() {
  // Get the products from localStorage
  const products = JSON.parse(localStorage.getItem('products'));
  
  if (!products) {
    showNotification('No changes to save', 'info');
    return;
  }
  
  // In a real implementation, this would be an AJAX POST request
  // For demonstration, we'll simulate a server save
  
  // Create overlay with loading spinner
  const overlay = document.createElement('div');
  overlay.className = 'save-overlay';
  overlay.innerHTML = `
    <div class="save-spinner">
      <div class="spinner"></div>
      <p>Saving to server...</p>
    </div>
  `;
  document.body.appendChild(overlay);
  
  // Simulate server request
  setTimeout(() => {
    // Simulate successful save
    // In real implementation this would be inside the fetch .then() callback
    document.body.removeChild(overlay);
    showNotification('Database successfully saved to server!', 'success');
    
    // Clear localStorage saved changes
    // localStorage.removeItem('products');
    
    /* 
    In a real implementation:
    
    fetch('/api/save-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products)
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to save');
      return response.json();
    })
    .then(data => {
      document.body.removeChild(overlay);
      showNotification('Database successfully saved to server!', 'success');
      localStorage.removeItem('products');
    })
    .catch(error => {
      document.body.removeChild(overlay);
      showNotification('Failed to save to server. Please try again.', 'error');
    });
    */
  }, 2000);
}

// Initialize the Add Product feature once the document has loaded
document.addEventListener('DOMContentLoaded', function() {
  // Try to load products from localStorage first (for changes not saved to server)
  const savedProducts = localStorage.getItem('products');
  
  if (savedProducts) {
    // Use localStorage version (contains latest changes)
    refreshProductDisplay(JSON.parse(savedProducts));
  }
  
  // Add the "Add Product" button to the filter container
  const addProductBtn = document.createElement('button');
  addProductBtn.id = 'add-product-btn';
  addProductBtn.className = 'btn-primary';
  addProductBtn.textContent = 'Add New Product';
  
  // Insert button after filters are created
  setTimeout(() => {
    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
      filterContainer.appendChild(addProductBtn);
      
      // Add click event to show form
      addProductBtn.addEventListener('click', showAddProductForm);
    }
  }, 500);
  
  // Add Save to Server button
  setupSaveToServerButton();
});

// Add server save function to the window object to make it accessible
window.saveProductsToJsonFile = function() {
  // Get products from localStorage
  const products = JSON.parse(localStorage.getItem('products'));
  
  if (!products || products.length === 0) {
    showNotification('No products to save', 'info');
    return;
  }
  
  // Create a blob with the JSON data
  const jsonData = JSON.stringify(products, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'products.json';
  
  // Trigger download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  showNotification('Products JSON file downloaded', 'success');
};