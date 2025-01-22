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
                ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
                <span class="remove-item" data-product-name="${item.name}" style="color: red; cursor: pointer;">Remove</span>
            `;
            selectedItemsList.appendChild(li);
        });

        // Update total price in the UI
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Function to add an item to the cart
    // Function to add an item to the cart
    function addToCart(button) {
        const product = button.closest(".product");
        const productName = button.getAttribute("data-product-name");
        const price = parseFloat(button.getAttribute("data-price"));
        const quantityInput = product.querySelector(".quantity");
        const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

        let cartData = getCartData();

        // Ensure only one instance of the product exists in the cart
        const existingProductIndex = cartData.findIndex(item => item.name === productName);
        if (existingProductIndex !== -1) {
            // Update quantity of the existing product
            cartData[existingProductIndex].quantity += quantity;
        } else {
            // Add new product
            cartData.push({ name: productName, price, quantity });
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

    // Initialize button states and cart UI on page load
    updateButtonState();
    updateCartDisplay();
});

