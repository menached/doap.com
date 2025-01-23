import { weightBasedProducts } from './subdomainData.js';

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    // Function to retrieve cart data from sessionStorage
    function getCartData() {
        try {
            return sessionStorage.getItem("cartData")
                ? JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData")))
                : [];
        } catch (error) {
            console.error("Failed to parse cartData:", error);
            return [];
        }
    }

    // Function to save cart data to sessionStorage
    function saveCartData(cartData) {
        sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    }

    // Function to update button states based on cart data
    function updateButtonState() {
        const cartData = getCartData();

        addToCartButtons.forEach(button => {
            const productName = button.getAttribute("data-product-name");
            const isInCart = cartData.some(item => item.name === productName);

            if (isInCart) {
                button.disabled = true;
                button.textContent = "In Cart"; // Optional: Change button text
                button.classList.add("disabled"); // Add a disabled styling class
            } else {
                button.disabled = false;
                button.textContent = "Add to Cart";
                button.classList.remove("disabled");
            }
        });
    }

    // Function to update cart display in cartsection.html
    function updateCartDisplay() {
        const cartData = getCartData();
        console.log("Cart Data during display update:", cartData); // Debugging cart data

        const selectedItemsList = document.getElementById("selectedItemsList");
        const totalElement = document.getElementById("total");
        let totalPrice = 0;

        // Clear existing cart items
        selectedItemsList.innerHTML = "";

        // Populate cart items
        cartData.forEach(item => {
            totalPrice += item.price * item.quantity; // Calculate total price
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - ${item.weight || ''} $${item.price.toFixed(2)}
                <span class="remove-item" data-product-name="${item.name}" style="color: red; cursor: pointer;">Remove</span>
            `;
            selectedItemsList.appendChild(li);
        });

        // Update total price in the UI
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Function to add an item to the cart
    function addToCart(button) {
        const product = button.closest(".product");
        const productName = button.getAttribute("data-product-name");
        const price = parseFloat(button.getAttribute("data-price"));
        const quantityElement = product.querySelector(".quantity");
        const quantity = quantityElement ? parseInt(quantityElement.value, 10) : 1;
        const weight = quantityElement?.selectedOptions[0]?.textContent.split(" - ")[0] || ""; // Extract weight from dropdown

        let cartData = getCartData();

        // Ensure only one instance of the product exists in the cart
        const existingProductIndex = cartData.findIndex(
            item => item.name === productName && item.weight === weight
        );
        if (existingProductIndex !== -1) {
            // Update quantity of the existing product
            cartData[existingProductIndex].quantity += quantity;
        } else {
            // Add new product with weight
            cartData.push({ name: productName, price, quantity, weight });
        }

        console.log("Cart Data after addition:", cartData); // Debugging cart data

        saveCartData(cartData); // Save updated cart data
        updateButtonState(); // Update button states
        updateCartDisplay(); // Update cart UI
    }

    // Function to remove an item from the cart
    function removeFromCart(productName) {
        let cartData = getCartData();

        // Remove the item completely from the cart
        cartData = cartData.filter(item => item.name !== productName);

        saveCartData(cartData); // Save updated cart data
        updateButtonState(); // Update button states
        updateCartDisplay(); // Update cart UI
    }

    // Attach event listeners to "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.removeEventListener("click", handleAddToCart);
        button.addEventListener("click", handleAddToCart);
    });

    // Wrapper function to handle adding to cart
    function handleAddToCart(event) {
        const button = event.currentTarget;
        addToCart(button);
    }

    // Attach event listener to dynamically handle "Remove from Cart" buttons
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const productName = e.target.getAttribute("data-product-name");
            removeFromCart(productName); // Remove the item from the cart
        }
    });

    // Function to render product quantity options for weight-based products
    function renderProductQuantityOptions(productName, quantityElement, basePriceElement, addToCartButton) {
        const productData = weightBasedProducts[productName];
        if (productData && productData.weights) {
            const weights = productData.weights;

            // Clear existing options
            quantityElement.innerHTML = "";

            // Populate dropdown options from weightBasedProducts
            for (const [key, value] of Object.entries(weights)) {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = `${value.label} - $${value.price}`;
                option.setAttribute("data-price", value.price);
                quantityElement.appendChild(option);
            }

            // Attach change event listener to update the price
            quantityElement.addEventListener("change", () => {
                const selectedValue = quantityElement.value;
                const selectedPrice = weights[selectedValue]?.price || basePriceElement.dataset.basePrice;

                // Update displayed price
                basePriceElement.textContent = `$${selectedPrice}`;
                basePriceElement.setAttribute("data-base-price", selectedPrice);

                // Update Add to Cart button data
                if (addToCartButton) {
                    addToCartButton.setAttribute("data-price", selectedPrice);
                }
            });
        } else {
            console.warn(`No weight-based options found for product: ${productName}`);
        }
    }

    // Initialize dropdowns and buttons on page load
    const productElements = document.querySelectorAll(".product");

    productElements.forEach(product => {
        const productName = product.querySelector(".item-title").textContent.trim();
        const quantityElement = product.querySelector(".quantity");
        const basePriceElement = product.querySelector(".item-price");
        const addToCartButton = product.querySelector(".add-to-cart-button");

        if (quantityElement && basePriceElement && addToCartButton) {
            renderProductQuantityOptions(productName, quantityElement, basePriceElement, addToCartButton);
        }
    });

    // Initialize button states and cart UI
    updateButtonState();
    updateCartDisplay();
});

