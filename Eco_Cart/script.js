// Improved product loading and display
fetch('products.json')
  .then(res => {
    if (!res.ok) throw new Error('Failed to load JSON');
    return res.json();
  })
  .then(productsArray => {
    const container = document.getElementById('products-container');
    const categories = {};
    
    // Group products by category
    productsArray.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    
    // Render each category
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
        
        // Create card HTML with improved structure
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
    
    // Add filter functionality
    setupFilters(categories);
  })
  .catch(err => {
    console.error('Error loading JSON:', err);
    document.getElementById('products-container').innerHTML = `
      <div class="error-message">
        <p>Sorry, we couldn't load the product data. Please try again later.</p>
        <p>Error: ${err.message}</p>
      </div>
    `;
  });

// Helper function to get color based on rating
function getRatingColor(rating) {
  if (rating >= 0 && rating <= 2) return '#ff4d4d';
  if (rating > 2 && rating <= 4) return '#ff9e44';
  if (rating > 4 && rating <= 6) return '#ffdf4d';
  if (rating > 6 && rating <= 8) return '#9ce97f';
  return '#4caf50';
}

// Helper function to generate star rating display
function getRatingStars(rating) {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Helper function to format list properties
function formatListProperty(property) {
  if (!property) return 'None';
  if (Array.isArray(property)) {
    return property.length > 0 ? property.join(', ') : 'None';
  }
  return property;
}

// Setup category and feature filters
function setupFilters(categories) {
  let filterContainer = document.getElementById('filter-container');
  
  // If the filter container doesn't exist, create it
  if (!filterContainer) {
    filterContainer = document.createElement('div');
    filterContainer.id = 'filter-container';
    document.getElementById('products-container').parentNode.insertBefore(
      filterContainer,
      document.getElementById('products-container')
    );
  }

  // Preserve the "Add Product" button if it exists
  const addProductButton = document.getElementById('add-product-btn');
  if (addProductButton) {
    filterContainer.removeChild(addProductButton);
  }

  // Clear existing filters
  filterContainer.innerHTML = '';

  // Create category filter
  const categoryFilter = document.createElement('div');
  categoryFilter.className = 'filter-section';
  categoryFilter.innerHTML = `
    <h3>Filter by Category</h3>
    <div class="filter-options">
      <label><input type="radio" name="category" value="all" checked> All Categories</label>
      ${Object.keys(categories).map(category => 
        `<label><input type="radio" name="category" value="${category}"> ${category}</label>`
      ).join('')}
    </div>
  `;

  // Create feature filters
  const featureFilter = document.createElement('div');
  featureFilter.className = 'filter-section';
  featureFilter.innerHTML = `
    <h3>Filter by Features</h3>
    <div class="filter-options">
      <label><input type="checkbox" name="cruelty_free"> Cruelty Free</label>
      <label><input type="checkbox" name="vegan"> Vegan</label>
      <label>
        <input type="checkbox" name="high_rated"> 
        High Rated (8+)
      </label>
    </div>
  `;

  // Add sorting options
  const sortingOptions = document.createElement('div');
  sortingOptions.className = 'filter-section';
  sortingOptions.innerHTML = `
    <h3>Sort Products</h3>
    <div class="filter-options">
      <select id="sort-select">
        <option value="default" selected>Default</option>
        <option value="rating-desc">Rating (High to Low)</option>
        <option value="rating-asc">Rating (Low to High)</option>
        <option value="name-asc">Name (A to Z)</option>
        <option value="name-desc">Name (Z to A)</option>
      </select>
    </div>
  `;

  // Append filters to the container
  filterContainer.appendChild(categoryFilter);
  filterContainer.appendChild(featureFilter);
  filterContainer.appendChild(sortingOptions);

  // Re-add the "Add Product" button
  if (addProductButton) {
    filterContainer.appendChild(addProductButton);
  }

  // Add event listeners for filters
  document.querySelectorAll('#filter-container input, #sort-select').forEach(input => {
    input.addEventListener('change', applyFilters);
  });
}

// Apply all filters and sorting
function applyFilters() {
  const selectedCategory = document.querySelector('input[name="category"]:checked').value;
  const crueltyfreeFilter = document.querySelector('input[name="cruelty_free"]').checked;
  const veganFilter = document.querySelector('input[name="vegan"]').checked;
  const highRatedFilter = document.querySelector('input[name="high_rated"]').checked;
  const sortOption = document.getElementById('sort-select').value;
  
  // Show/hide sections based on category selection
  document.querySelectorAll('.category-section').forEach(section => {
    const categoryName = section.querySelector('h2').textContent;
    section.style.display = (selectedCategory === 'all' || selectedCategory === categoryName) ? 'block' : 'none';
  });
  
  // Filter and sort products
  document.querySelectorAll('.product-card').forEach(card => {
    let shouldShow = true;
    
    // Apply feature filters
    if (crueltyfreeFilter && !card.innerHTML.includes('tag-cruelty-free')) shouldShow = false;
    if (veganFilter && !card.innerHTML.includes('tag-vegan')) shouldShow = false;
    
    // Apply rating filter
    if (highRatedFilter) {
      const ratingText = card.querySelector('.rating-score').textContent;
      const rating = parseFloat(ratingText);
      if (rating < 8) shouldShow = false;
    }
    
    card.style.display = shouldShow ? 'block' : 'none';
  });
  
  // Apply sorting
  const productSections = document.querySelectorAll('.category-section');
  productSections.forEach(section => {
    const products = Array.from(section.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
      if (sortOption === 'rating-desc' || sortOption === 'rating-asc') {
        const ratingA = parseFloat(a.querySelector('.rating-score').textContent);
        const ratingB = parseFloat(b.querySelector('.rating-score').textContent);
        return sortOption === 'rating-desc' ? ratingB - ratingA : ratingA - ratingB;
      } else {
        const nameA = a.querySelector('.product-name').textContent;
        const nameB = b.querySelector('.product-name').textContent;
        return sortOption === 'name-asc' ? 
          nameA.localeCompare(nameB) : 
          nameB.localeCompare(nameA);
      }
    });
    
    const productGrid = section.querySelector('.product-grid');
    productGrid.innerHTML = '';
    products.forEach(product => productGrid.appendChild(product));
  });
}

// Add custom fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);