// Function to upload a JSON file and update the database
function setupFileUploader() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.style.display = 'none';
    fileInput.id = 'json-file-input';
    document.body.appendChild(fileInput);
    
    // File upload handling
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const products = JSON.parse(e.target.result);
          
          // Validate that it's an array of products
          if (!Array.isArray(products)) {
            showNotification('Invalid JSON file format. Expected array of products.', 'error');
            return;
          }
          
          // Save products to localStorage
          localStorage.setItem('products', JSON.stringify(products));
          
          // Refresh the display
          refreshProductDisplay(products);
          
          showNotification('Products imported successfully!', 'success');
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          showNotification('Failed to import products. Invalid JSON format.', 'error');
        }
      };
      
      reader.readAsText(file);
    });
    
    return fileInput;
  }
  
  // Function to create database management UI
  function createDatabaseManagementUI() {
    // Create a floating action button for database management
    const dbButton = document.createElement('button');
    dbButton.className = 'database-mgmt-btn';
    dbButton.innerHTML = '<span>🗃️</span>';
    dbButton.title = 'Database Management';
    
    // Create dropdown menu for database actions
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'db-dropdown-menu';
    dropdownMenu.innerHTML = `
      <button id="import-db-btn" class="db-action-btn">
        <span>📥</span> Import Database
      </button>
      <button id="export-db-btn" class="db-action-btn">
        <span>📤</span> Export Database
      </button>
      <button id="reset-db-btn" class="db-action-btn">
        <span>🔄</span> Reset to Original
      </button>
    `;
    
    // Add to DOM
    document.body.appendChild(dbButton);
    document.body.appendChild(dropdownMenu);
    
    // Toggle dropdown menu
    dbButton.addEventListener('click', () => {
      dropdownMenu.classList.toggle('show');
    });
    
    // Hide dropdown when clicking elsewhere
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.database-mgmt-btn') && 
          !event.target.closest('.db-dropdown-menu')) {
        dropdownMenu.classList.remove('show');
      }
    });
    
    // Setup file uploader
    const fileInput = setupFileUploader();
    
    // Import database action
    document.getElementById('import-db-btn').addEventListener('click', () => {
      fileInput.click();
      dropdownMenu.classList.remove('show');
    });
    
    // Export database action
    document.getElementById('export-db-btn').addEventListener('click', () => {
      const products = localStorage.getItem('products') ? 
        JSON.parse(localStorage.getItem('products')) : [];
      
      if (products.length === 0) {
        fetch('products.json')
          .then(response => response.json())
          .then(originalProducts => {
            saveProductsToFile(originalProducts);
          })
          .catch(error => {
            showNotification('Error exporting database', 'error');
          });
      } else {
        saveProductsToFile(products);
      }
      
      dropdownMenu.classList.remove('show');
    });
    
    // Reset database action
    document.getElementById('reset-db-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the database to its original state? All your changes will be lost.')) {
        // Remove from localStorage
        localStorage.removeItem('products');
        
        // Reload original database
        fetch('products.json')
          .then(response => response.json())
          .then(originalProducts => {
            refreshProductDisplay(originalProducts);
            showNotification('Database reset to original state', 'success');
          })
          .catch(error => {
            showNotification('Error resetting database', 'error');
          });
      }
      
      dropdownMenu.classList.remove('show');
    });
  }
  
  // Initialize all database management features
  document.addEventListener('DOMContentLoaded', function() {
    // Only run once all other scripts have loaded
    setTimeout(() => {
      createDatabaseManagementUI();
    }, 1000);
  });