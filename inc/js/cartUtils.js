export function updateCartUI(cartData) {
    console.log("Updating cart UI with cartData:", cartData);

    if (!Array.isArray(cartData)) {
        console.error("Invalid cart data format. Expected an array but received:", cartData);
        cartData = []; // Reset to an empty array if the format is incorrect
    }

    const selectedItemsList = document.getElementById("selectedItemsList");
    if (!selectedItemsList) {
        console.error("Selected items list element not found.");
        return;
    }

    const totalDisplay = document.getElementById("total");
    let total = 0;

    const cartItemsHTML = cartData.map(item => {
        const cost = item.price * item.quantity;
        total += cost;

        const backgroundColor = cartData.length === 1 ? 'background-color: #81b622; color: #000;' : '';

        return `<li style="${backgroundColor}">${item.name} (x${item.quantity}) - $${cost.toFixed(2)}
            <span class="remove-item" data-product-name="${item.name}">x</span></li>`;
    }).join("");

    selectedItemsList.innerHTML = cartItemsHTML || '<li>No items selected yet.</li>';

    if (totalDisplay) {
        totalDisplay.textContent = `$${total.toFixed(2)}`;
    } else {
        console.error("Total display element not found.");
    }

    console.log(`Updated Cart UI: Total Value - $${total.toFixed(2)}, Items:`, cartData);

    const minOrderMessage = document.getElementById("minOrderMessage");
    const MINIMUM_ORDER_AMOUNT = 20;

    if (minOrderMessage) {
        if (total === 0) {
            minOrderMessage.textContent = `Minimum order is $${MINIMUM_ORDER_AMOUNT}.`;
            minOrderMessage.style.color = "black";
        } else if (total > 0 && total < MINIMUM_ORDER_AMOUNT) {
            minOrderMessage.textContent = `Minimum order is $${MINIMUM_ORDER_AMOUNT}.`;
            minOrderMessage.style.color = "red";
        } else {
            minOrderMessage.textContent = "Free 1hr delivery!";
            minOrderMessage.style.color = "green";
        }
    }

    // Ensure remove buttons work and cart UI updates
    const handleRemoveItemEvent = (e) => {
        if (e.target.classList.contains("remove-item")) {
            const productName = e.target.getAttribute("data-product-name");
            console.log(`Removing ${productName} from cart.`);
            removeItemFromCart(productName);

            const cartData = sessionStorage.getItem("cartData");
            try {
                const parsedCartData = cartData ? JSON.parse(decodeURIComponent(cartData)) : [];
                updateCartUI(parsedCartData);
            } catch (error) {
                console.error("Failed to parse cart data during removal:", error);
                updateCartUI([]);
            }
        }
    };

    selectedItemsList.removeEventListener("click", handleRemoveItemEvent);
    selectedItemsList.addEventListener("click", handleRemoveItemEvent);
}





export function loadCustomerAndCartData() {
    let customerData = loadFromCookiesOrSession("sessionData");
    let cartData = loadFromCookiesOrSession("cartData");

    // Populate form fields with customer data if available
    if (customerData) {
        Object.keys(customerData).forEach(key => {
            const inputField = document.getElementById(key);
            if (inputField) {
                inputField.value = customerData[key];
            } else {
                console.warn(`Input field with id '${key}' not found.`);
            }
        });
    } else {
        console.log("No customer data found.");
    }

    // Update cart data
    if (Array.isArray(cartData) && cartData.length > 0) {
        console.log("Updating session storage with current cart data:", cartData);
        sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
        updateCartUI(cartData);  // Update the UI with the current cart data
    } else {
        console.log("No cart data found. Initializing an empty cart.");
        cartData = [];
        sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
        updateCartUI(cartData);  // Reset UI with no items
    }
}

// Helper function to load data from cookies or sessionStorage
function loadFromCookiesOrSession(key) {
    let data;

    // Try loading from cookies first
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
    if (cookieValue) {
        try {
            data = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
            console.log(`${key} loaded from cookies:`, data);
        } catch (error) {
            console.error(`Error parsing ${key} from cookies:`, error);
        }
    }

    // Fallback to session storage if cookies don't have data
    if (!data) {
        const sessionData = sessionStorage.getItem(key);
        if (sessionData) {
            try {
                data = JSON.parse(decodeURIComponent(sessionData));
                console.log(`${key} loaded from session storage:`, data);
            } catch (error) {
                console.error(`Error parsing ${key} from session storage:`, error);
            }
        }
    }

    return data;
}




export function addItemToCart(productName, price, quantity) {
    console.log(`Adding item to cart: ${productName}, Price: ${price}, Quantity: ${quantity}`);
    let cartData = sessionStorage.getItem("cartData");
    try {
        cartData = cartData ? JSON.parse(decodeURIComponent(cartData)) : [];
    } catch (error) {
        console.error("Failed to parse cart data from sessionStorage:", error);
        cartData = [];
    }

    const existingItem = cartData.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += quantity;
        console.log(`Updated quantity for ${productName}: ${existingItem.quantity}`);
    } else {
        cartData.push({ name: productName, price, quantity });
        console.log(`Added new item to cart: ${productName}`);
    }

    sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    console.log("Cart data after adding item:", cartData);

    // Update sessionData with updated cart info for consistency
    let sessionData = sessionStorage.getItem("sessionData");
    try {
        sessionData = sessionData ? JSON.parse(decodeURIComponent(sessionData)) : {};
    } catch (error) {
        console.error("Failed to parse sessionData:", error);
        sessionData = {};
    }
    sessionData.cartData = cartData;
    sessionStorage.setItem("sessionData", encodeURIComponent(JSON.stringify(sessionData)));
    console.log("Updated sessionData with cart info:", sessionData);

    updateCartUI(cartData);

    // Debug: Verify session storage persists across reloads
    const sessionCartCheck = sessionStorage.getItem("cartData");
    if (sessionCartCheck) {
        console.log("Session storage cart data after add:", JSON.parse(decodeURIComponent(sessionCartCheck)));
    } else {
        console.error("Session storage cart data is missing after add!");
    }
}





window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event triggered: Initializing customer and cart data loading.");
    loadCustomerAndCartData(); // Load customer and cart data when the page loads

    // Check if sessionStorage is cleared externally by any plugin or script
    setInterval(() => {
        const currentCartData = sessionStorage.getItem("cartData");
        if (!currentCartData) {
            console.warn("Session storage cartData is empty during page session. It may have been cleared externally.");
        }
    }, 5000); // Check every 5 seconds

    // Track external influences that reset sessionStorage
    window.addEventListener("storage", (event) => {
        if (event.key === "cartData") {
            console.log("Session storage cartData changed externally:", JSON.parse(decodeURIComponent(event.newValue || "[]")));
        }
    });

    // Ensure this function is called after adding items
    document.querySelectorAll('label.item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const itemLabel = this.closest('.item');
            const productName = this.value.split('|')[0];
            const price = parseFloat(this.value.split('|')[1]) || 0;
            const quantityInput = itemLabel.querySelector('.quantity');
            const quantity = parseInt(quantityInput?.value, 10) || 1;

            if (this.checked) {
                addItemToCart(productName, price, quantity);
            } else {
                console.log(`Removing ${productName} from cart.`);
                removeItemFromCart(productName);
            }
        });
    });
});


