import { weightBasedProducts } from './subdomainData.js';
//import { saveCartData } from './formHandler.js';

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    // Function to retrieve cart data from sessionStorage
    function getCartData() {
        try {
            return localStorage.getItem("cartData")
                ? JSON.parse(decodeURIComponent(localStorage.getItem("cartData")))
                : [];
        } catch (error) {
            console.error("Failed to parse cartData:", error);
            return [];
        }
    }

    // Function to save cart data to sessionStorage
    //function saveCartData(cartData) {
        //localStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    //}

    // Function to update button states based on cart data
    function updateButtonState() {
        const cartData = getCartData();

        document.querySelectorAll(".add-to-cart-button").forEach((button) => {
            const productName = button.getAttribute("data-product-name");
            const isInCart = cartData.some((item) => item.name === productName);

            if (isInCart) {
                button.disabled = true;
                button.textContent = "In Cart";
                button.classList.add("disabled");
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
        const selectedItemsList = document.getElementById("selectedItemsList");
        const totalElement = document.getElementById("total");
        let totalPrice = 0;

        // Clear existing cart items
        selectedItemsList.innerHTML = "";

        // Populate cart items
        cartData.forEach((item) => {
            const linePrice = item.price * item.quantity; // Correct line item price
            totalPrice += linePrice; // Add to total price

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - ${item.weight || ''} $${item.price.toFixed(2)} x ${item.quantity} = $${linePrice.toFixed(2)}
                <span class="remove-item" data-product-name="${item.name}" style="color: red; cursor: pointer;">Remove</span>
            `;
            selectedItemsList.appendChild(li);
        });

        // Update total price in the UI
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;

        // Update minimum order message
        updateMinimumOrderMessage(); // Ensure the message reflects the updated cart total
    }

    // Function to add an item to the cart
    function addToCart(button) {
        const product = button.closest(".product");
        const productName = button.getAttribute("data-product-name");
        const basePrice = parseFloat(button.getAttribute("data-price")); // Per-unit price
        const quantityElement = product.querySelector(".quantity");
        let quantity = 1; // Default quantity
        let weight = ""; // Default weight for non-dropdown products

        if (quantityElement) {
            if (quantityElement.tagName.toLowerCase() === "select") {
                // For dropdown-based products (sold by weight)
                weight = quantityElement.selectedOptions[0]?.textContent.split(" - ")[0] || "";
            } else {
                // For quantity-based products (sold in units)
                quantity = parseInt(quantityElement.value, 10) || 1; // Ensure quantity is at least 1
            }
        }

        let cartData = getCartData();

        // Ensure only one instance of the product exists in the cart
        const existingProductIndex = cartData.findIndex(
            (item) => item.name === productName && item.weight === weight
        );

        if (existingProductIndex !== -1) {
            // Increment quantity for existing entry
            cartData[existingProductIndex].quantity += quantity;
        } else {
            // Add new product
            cartData.push({ name: productName, price: basePrice, quantity, weight });
        }

        console.log("Cart Data after addition:", cartData);

        saveCartData(cartData); // Save updated cart data
        updateButtonState(); // Update button states
        updateCartDisplay(); // Update cart UI
        updateMinimumOrderMessage(); // Update minimum order message
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
                option.value = key; // Use key for identification only
                option.textContent = `${value.label} - $${value.price}`;
                option.setAttribute("data-price", value.price); // Per-unit price
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


function updateCustomerDataInStorage() {
    const customerData = {
        name: document.getElementById("name")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        email: document.getElementById("email")?.value || "",
        address: document.getElementById("address")?.value || "",
        city: document.getElementById("city")?.value || "",
        specialInstructions: document.getElementById("specialInstructions")?.value || "",
        paymentMethod: document.getElementById("paymentMethod")?.value || ""
    };

    // Save to localStorage for persistence across tabs and sessions
    localStorage.setItem("customerData", JSON.stringify(customerData));
    console.log("Updated customerData in localStorage:", customerData);

    // Optionally save to cookies if consent is given
    if (getCookie("cookieconsent_status") === "allow") {
        setCookie("customerData", customerData, 7);
        console.log("Updated customerData in cookies:", customerData);
    }
}


document.querySelectorAll("#customerForm input, #customerForm textarea").forEach((input) => {
    input.addEventListener("input", updateCustomerDataInStorage);
});


export function getCartData() {
    try {
        return localStorage.getItem("cartData")
            ? JSON.parse(decodeURIComponent(localStorage.getItem("cartData")))
            : [];
    } catch (error) {
        console.error("Failed to parse cartData:", error);
        return [];
    }
}


export function saveCartData(cartData) {
    localStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    console.log("Cart data saved to localStorage:", cartData);
}

