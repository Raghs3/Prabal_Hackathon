fetch('products.json') // Change to your actual file name
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
      const section = document.createElement('div');
      section.className = 'category-section';

      const heading = document.createElement('h2');
      heading.textContent = categoryName;
      section.appendChild(heading);

      // Render each product card
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product';

        card.innerHTML = `
          <div class="product-front">
            <div class="name"><strong>${product.name}</strong></div>
            <div class="brand">${product.brand}</div>
            <img src="placeholder.jpg" alt="${product.name}" width="150">
            <div class="rating">⭐ ${product.rating}/10</div>
          </div>  

          <div class="product-back">
            <div class="materials"><strong>Materials:</strong> ${product.materials}</div>
            <div class="certifications"><strong>Certifications:</strong> ${product.certifications.join(', ') || 'None'}</div>
            <div class="packaging"><strong>Packaging:</strong> ${product.packaging || 'N/A'}</div>
            <div class="brand_ethics"><strong>Brand Ethics:</strong> ${product.brand_ethics.join(', ') || 'N/A'}</div>
            <div class="manufacturing"><strong>Manufacturing:</strong> ${Array.isArray(product.manufacturing) ? 'N/A' : product.manufacturing}</div>
            <div class="end_of_life"><strong>End of Life:</strong> ${product.end_of_life}</div>
            <div class="cruelty_free"><strong>Cruelty Free:</strong> ${product.cruelty_free ? 'Yes' : 'No'}</div>
            <div class="vegan"><strong>Vegan:</strong> ${product.vegan ? 'Yes' : 'No'}</div>
          </div>  
        `;  

        const front = card.querySelector("card");
        
        


        section.appendChild(card);
      });  

      container.appendChild(section);
    });  
  })  
  .catch(err => {
    console.error('Error loading JSON:', err);  
  });  


