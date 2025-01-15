import { getCookie, setCookie } from './cookieManager.js';
import { subdomainData } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    // Function to update cart display in cartsection.html
    function updateCartDisplay() {
        const cartData = sessionStorage.getItem("cartData")
            ? JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData")))
            : []; // Default to an empty array if no cartData

        const siteData = sessionStorage.getItem("siteData")
            ? JSON.parse(decodeURIComponent(sessionStorage.getItem("siteData")))
            : { minimumOrder: 0 }; // Default siteData with minimumOrder 0 if not available

        const selectedItemsList = document.getElementById("selectedItemsList");
        const minOrderMessage = document.getElementById("minOrderMessage");

        let totalPrice = 0;

        // Ensure `minimumOrder` is a valid number
        const minimumOrderValue = parseFloat(siteData.minimumOrder) || 0;

        // Display message and reset total price if cart is empty
        if (cartData.length === 0) {
            selectedItemsList.innerHTML = `<li>No items selected yet.</li>`;
            minOrderMessage.textContent = `Minimum order is $${minimumOrderValue.toFixed(2)}.`; // Always show the correct value
            minOrderMessage.style.color = "red"; // Default to red when cart is empty
            document.getElementById("total").textContent = `$0.00`;
            return; // Exit early since the cart is empty
        }

        // Clear the list and calculate total price from cart items
        selectedItemsList.innerHTML = "";
        cartData.forEach((item) => {
            totalPrice += item.price * item.quantity;
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
                <span style="color: red; cursor: pointer;" class="remove-item" data-product-name="${item.name}">X</span>
            `;
            selectedItemsList.appendChild(li);
        });

        // Update total price and minimum order message
        document.getElementById("total").textContent = `$${totalPrice.toFixed(2)}`;
        minOrderMessage.textContent = `Minimum order is $${minimumOrderValue.toFixed(2)}.`;

        // Change color based on whether the total meets the minimum order
        if (totalPrice >= minimumOrderValue) {
            minOrderMessage.style.color = "black"; // Black if minimum order met
        } else {
            minOrderMessage.style.color = "red"; // Red if below minimum
        }

        // Add event listeners for remove buttons
        document.querySelectorAll(".remove-item").forEach(removeButton => {
            removeButton.addEventListener("click", (e) => {
                e.stopPropagation();
                const productName = removeButton.dataset.productName;
                removeItemFromCart(productName); // Remove item and update cart
            });
        });
    }

    // Function to remove an item from cart
    function removeItemFromCart(productName) {
        let cartData = JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData") || "[]"));
        cartData = cartData.filter(item => item.name !== productName);
        sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));

        if (getCookie("cookieconsent_status") === "allow") {
            setCookie("cartData", encodeURIComponent(JSON.stringify(cartData)), 7);
        }

        console.log(`Removed ${productName} from cart.`);
        updateCartDisplay();
        highlightCartItems();
    }

    // Highlight products that are in the cart
    function highlightCartItems() {
        const cartData = sessionStorage.getItem("cartData")
            ? JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData")))
            : [];

        const productItems = document.querySelectorAll(".product");
        productItems.forEach(item => {
            const productName = item.querySelector(".item-title").textContent.trim();
            const cartItem = cartData.find(cartItem => cartItem.name === productName);

            if (cartItem) {
                item.classList.add("in-cart");  // Add highlight class if in cart
            } else {
                item.classList.remove("in-cart");  // Remove highlight class if not in cart
            }
        });
    }

    // Listen only to "Add to Cart" button clicks
    function attachAddToCartListeners() {
        addToCartButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent event bubbling
                const product = button.closest(".product"); // Get the closest product container
                const productName = product.querySelector(".item-title").textContent.trim();
                const price = parseFloat(button.dataset.price);
                const quantityInput = product.querySelector(".item-quantity input");
                const selectedQuantity = quantityInput ? parseInt(quantityInput.value) : 1;

                let cartData = sessionStorage.getItem("cartData")
                    ? JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData")))
                    : [];

                const existingProductIndex = cartData.findIndex(item => item.name === productName);
                if (existingProductIndex !== -1) {
                    cartData[existingProductIndex].quantity += selectedQuantity;  // Increment quantity
                    console.log(`Incremented quantity for ${productName} to ${cartData[existingProductIndex].quantity}`);
                } else {
                    const selectedProduct = {
                        name: productName,
                        price: price,
                        quantity: selectedQuantity
                    };
                    cartData.push(selectedProduct);
                    console.log(`Added new product to cart:`, selectedProduct);
                }

                sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));

                if (getCookie("cookieconsent_status") === "allow") {
                    setCookie("cartData", encodeURIComponent(JSON.stringify(cartData)), 7);
                }

                updateCartDisplay();
                highlightCartItems();  // Apply highlights after updating the cart
            });
        });
    }

    function restoreHighlightsOnLoad() {
        if (sessionStorage.getItem("cartData")) {
            highlightCartItems();
        } else if (getCookie("cartData")) {
            const cartDataFromCookie = JSON.parse(decodeURIComponent(getCookie("cartData")));
            sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartDataFromCookie)));
            highlightCartItems();
        }
    }

    // Initial cart display and product highlight
    restoreHighlightsOnLoad();
    updateCartDisplay();
    attachAddToCartListeners();  // Attach "Add to Cart" button listeners
});

