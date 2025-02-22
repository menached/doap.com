import { weightBasedProducts } from './subdomainData.js';
//import { saveCartData } from './formHandler.js';
import { updateMinimumOrderMessage } from './formHandler.js';

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
                button.disabled = false;  // Allow re-clicking to add another
                button.textContent = "In Cart";
                button.classList.add("disabled");
                button.classList.add("clickable");  // Add a class for pointer cursor
                button.title = "Click to add another";  // Tooltip message
            } else {
                button.disabled = false;
                button.textContent = "Add to Cart";
                button.classList.remove("disabled");
                button.classList.remove("clickable");  // Remove pointer cursor
                button.title = "";  // Clear tooltip message
            }
        });
    }

    // Function to update cart display in cartsection.html
    function updateCartDisplay() {
        const cartData = getCartData();
        const selectedItemsList = document.getElementById("selectedItemsList");
        const totalElement = document.getElementById("total");
        let totalPrice = 0;

        selectedItemsList.innerHTML = ""; // Clear existing items

        // Loop through cart data to generate list items
        cartData.forEach((item) => {
            const linePrice = item.price * item.quantity;
            totalPrice += linePrice;

            // Create list item for each cart entry
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.marginBottom = "10px";

            // Add product details
            const productDetails = document.createElement("span");
            productDetails.textContent = `${item.name} ${item.weight || ''} $${linePrice.toFixed(2)}`;
            productDetails.style.flex = "1";
            li.appendChild(productDetails);

            // Add remove button with trashcan icon
            const removeButton = document.createElement("span");
            removeButton.innerHTML = `<i class="fas fa-trash-alt"></i>`; // Trashcan icon
            removeButton.className = "remove-item";
            removeButton.setAttribute("data-product-name", item.name);
            removeButton.style.color = "red";
            removeButton.style.cursor = "pointer";
            removeButton.style.marginLeft = "10px";
            li.appendChild(removeButton);

            // Append the list item to the selectedItemsList
            selectedItemsList.appendChild(li);
        });

        // Update total price
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Attach a single event listener to the parent container
    document.addEventListener("click", (event) => {
        // Check if the clicked element is the trash icon or its parent span
        if (event.target.matches(".remove-item, .remove-item i")) {
            const productName = event.target.closest(".remove-item").getAttribute("data-product-name");
            removeFromCart(productName);
        }
    });

    // Function to remove an item from the cart
    function removeFromCart(productName) {
        let cartData = getCartData();

        // Remove the item completely from the cart
        cartData = cartData.filter(item => item.name !== productName);

        saveCartData(cartData); // Save updated cart data
        updateCartDisplay(); // Refresh the cart UI
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

        // Retrieve product details from weightBasedProducts
        const productData = weightBasedProducts[productName];
        const thumbnail = productData?.thumbnail || ""; // Default to empty string if thumbnail is not defined

        // Ensure only one instance of the product exists in the cart
        const existingProductIndex = cartData.findIndex(
            (item) => item.name === productName && item.weight === weight
        );

        if (existingProductIndex !== -1) {
            // Increment quantity for existing entry
            cartData[existingProductIndex].quantity += quantity;
        } else {
            // Add new product
            cartData.push({
                name: productName,
                price: basePrice,
                quantity,
                weight,
                thumbnail, // Add the thumbnail property
            });
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
        updateMinimumOrderMessage(); // Update minimum order message
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

