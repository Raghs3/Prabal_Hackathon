// Load products from mock data
const products = [
    {
      id: 1,
      name: "Eco-Friendly Bottle",
      brand: "GreenLife",
      materials: ["Recycled Plastic"],
      rating: 4.5,
      ecoScore: 90
    },
    {
      id: 2,
      name: "Plastic Bag",
      brand: "CheapStuff",
      materials: ["Non-Recyclable Plastic"],
      rating: 2.0,
      ecoScore: 20
    },
    {
      id: 3,
      name: "Organic Cotton T-Shirt",
      brand: "SustainaWear",
      materials: ["Organic Cotton"],
      rating: 4.8,
      ecoScore: 95
    }
  ];
  
  const productList = document.getElementById("product-list");
  const searchBar = document.getElementById("search-bar");
  const searchBtn = document.getElementById("search-btn");
  
  // Function to render products
  function renderProducts(productsToRender) {
    productList.innerHTML = ""; // Clear the product list
    productsToRender.forEach(product => {
      const productCard = `
        <div class="col-md-4 my-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${product.brand}</h6>
              <p class="card-text">
                Materials: ${product.materials.join(", ")}<br>
                Rating: ${product.rating} / 5<br>
                Eco-Score: ${product.ecoScore} / 100
              </p>
              ${product.ecoScore < 50 ? '<span class="badge bg-danger">Not Eco-Friendly</span>' : '<span class="badge bg-success">Eco-Friendly</span>'}
            </div>
          </div>
        </div>
      `;
      productList.insertAdjacentHTML("beforeend", productCard);
    });
  }
  
  // Search functionality
  function searchProducts() {
    const query = searchBar.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  }
  
  // Event Listeners
  searchBtn.addEventListener("click", searchProducts);
  searchBar.addEventListener("keyup", searchProducts);
  
  // Initial render
  renderProducts(products);