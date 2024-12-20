document.addEventListener("DOMContentLoaded", () => {
  // Fetch the JSON data
  fetch('products.json')
    .then(response => response.json())
    .then(data => renderProducts(data.categories));

  // Function to render the product categories and items
  function renderProducts(categories) {
    const container = document.getElementById("product-container");

    categories.forEach(category => {
      // Create a wrapper for the category
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "tab-content";
      categoryDiv.id = category.id;

      // Add a category title
      const categoryTitle = document.createElement("h2");
      categoryTitle.textContent = category.name;
      categoryDiv.appendChild(categoryTitle);

      // Create an item list for the category
      const itemList = document.createElement("div");
      itemList.className = "item-list";

      // Add items to the category
      category.items.forEach(item => {
        const itemLabel = document.createElement("label");
        itemLabel.className = "item";

        itemLabel.innerHTML = `
          <input type="checkbox" name="item" value="${item.title}|${item.price}">
          <img src="${item.image}" alt="${item.title}">
          <div class="item-details">
            <p class="item-title">${item.title}</p>
            <div class="item-quantity">
              <label for="quantity-${item.id}">Qty:</label>
              <input type="number" id="quantity-${item.id}" class="quantity" min="1" max="99" value="1">
            </div>
            <p class="item-price">$${item.price.toFixed(2)}</p>
          </div>
        `;
        itemList.appendChild(itemLabel);
      });

      // Append the item list to the category
      categoryDiv.appendChild(itemList);

      // Append the category to the main container
      container.appendChild(categoryDiv);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Fetch data from the JSON file
  fetch('products.json')
    .then(response => response.json())
    .then(data => renderCategories(data.categories));

  function renderCategories(categories) {
    const container = document.getElementById("product-container");

    categories.forEach(category => {
      // Create tab content for the category
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "tab-content";
      categoryDiv.id = category.id;

      // Add items to the category
      const itemList = document.createElement("div");
      itemList.className = "item-list";

      category.items.forEach(item => {
        const itemLabel = document.createElement("label");
        itemLabel.className = "item";

        itemLabel.innerHTML = `
          <input type="checkbox" name="item" value="${item.title}|${item.price}">
          <img src="${item.image}" alt="${item.title}">
          <div class="item-details">
            <p class="item-title">${item.title}</p>
            <div class="item-quantity">
              <label for="quantity-${item.id}">Qty:</label>
              <input type="number" id="quantity-${item.id}" class="quantity" min="1" max="99" value="1">
            </div>
            <p class="item-price">$${item.price.toFixed(2)}</p>
          </div>
        `;
        itemList.appendChild(itemLabel);
      });

      categoryDiv.appendChild(itemList);
      container.appendChild(categoryDiv);
    });
  }
});

