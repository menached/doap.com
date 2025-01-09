// Updated cart.js to dynamically update the cityName in the header and handle cart interactions effectively

let cartForm;

console.log("shop.js started loading");
const productTitle = '';

// Ensure DOM content is fully loaded before applying listeners
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");

    // Set cityName dynamically using cityMap from inline logic (no import)
    const cityMap = {
        pleasanthill: "Pleasant Hill", walnutcreek: "Walnut Creek", castrovalley: "Castro Valley",
        sanramon: "San Ramon", discoverybay: "Discovery Bay", alamo: "Alamo", antioch: "Antioch",
        dublin: "Dublin", lafayette: "Lafayette", pleasanton: "Pleasanton", danville: "Danville",
        concord: "Concord", livermore: "Livermore", orinda: "Orinda"
    };

    const cityNameElement = document.getElementById("cityName");
    const hostname = window.location.hostname.split('.')[0].toLowerCase();
    let cityName = cityMap[hostname] || "Doap";

    if (hostname === 'www' || hostname === 'doap.com') {
        cityName = "Doap";
    } else if (hostname === 'localhost') {
        cityName = "Localhost Doap";
    } else {
        cityName += " Doap"; // Append "Doap" to the city name if not default.
    }

    if (cityNameElement) {
        cityNameElement.textContent = cityName;
    } else {
        console.error("cityName element not found.");
    }

    // Log the image source when a product image is clicked
    document.querySelectorAll('.item img').forEach(img => {
        img.addEventListener('click', function () {
            const imgSrc = this.src;  // Get the image source
            console.log("Image src:", imgSrc);
        });
    });

    // Tab switching logic
    const applyTabListeners = () => {
        const tabs = document.querySelectorAll(".tab");
        const tabContents = document.querySelectorAll(".tab-content");

        if (tabs.length === 0) {
            console.warn("No tabs found.");
            return;
        }

        tabs.forEach(tab => {
            tab.addEventListener("click", function () {
                tabs.forEach(t => t.classList.remove("active"));
                tabContents.forEach(content => content.classList.remove("active"));
                this.classList.add("active");
                const targetTab = document.getElementById(this.dataset.tab);
                if (targetTab) {
                    targetTab.classList.add("active");
                }
            });
        });
    };

    applyTabListeners();
    console.log("Tab logic applied successfully!");

    // Handle checkbox clicks to add items to cart
    document.querySelectorAll('label.item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const itemLabel = this.closest('.item');
            const productName = this.value.split('|')[0];
            const price = parseFloat(this.value.split('|')[1]) || 0;
            const quantityInput = itemLabel.querySelector('.quantity');
            const quantity = parseInt(quantityInput?.value, 10) || 1;

            if (this.checked) {
                console.log(`Added ${productName} to cart.`);
                addItemToCart(productName, price, quantity);
                itemLabel.classList.add("selected"); // Add highlighted border
            } else {
                console.log(`Removed ${productName} from cart.`);
                removeItemFromCart(productName);
                itemLabel.classList.remove("selected");
            }
        });
    });

    // Add item to cart
    function addItemToCart(productName, price, quantity) {
        let cartData = JSON.parse(sessionStorage.getItem("cartData")) || [];
        const existingItem = cartData.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartData.push({ name: productName, price, quantity });
        }

        console.log("Updated cart data:", cartData);
        sessionStorage.setItem("cartData", JSON.stringify(cartData));
        updateCartUI(cartData);
    }

    // Remove item from cart
    function removeItemFromCart(productName) {
        let cartData = JSON.parse(sessionStorage.getItem("cartData")) || [];
        cartData = cartData.filter(item => item.name !== productName);
        sessionStorage.setItem("cartData", JSON.stringify(cartData));
        updateCartUI(cartData);
    }

    // Function to update cart UI based on sessionStorage or cookies
    const updateCartUI = (cartData) => {
        if (!Array.isArray(cartData)) {
            console.error("cartData is not an array:", cartData);
            cartData = []; // Fallback to empty array to avoid breaking map function
        }

        const selectedItemsList = document.getElementById("selectedItemsList");
        const totalDisplay = document.getElementById("total");
        let total = 0;

        const cartItemsHTML = cartData.map(item => {
            const cost = item.price * item.quantity;
            total += cost;
            return `<li>${item.name} (x${item.quantity}) - $${cost.toFixed(2)}
                <span class="remove-item" data-product-name="${item.name}">x</span></li>`;
        }).join("");

        selectedItemsList.innerHTML = cartItemsHTML || '<li>No items selected yet.</li>';
        totalDisplay.textContent = `$${total.toFixed(2)}`;

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

        // Use event delegation to handle remove buttons more efficiently
        selectedItemsList.addEventListener("click", function (event) {
            if (event.target.classList.contains("remove-item")) {
                const productName = event.target.getAttribute("data-product-name");
                removeItemFromCart(productName);
                console.log(`Removed ${productName} from cart.`);
                updateCartUI(JSON.parse(sessionStorage.getItem("cartData"))); // Ensure UI reflects latest cart data
            }
        });
    };

    // Load initial cart data from sessionStorage or cookies on page load
    let initialCartData = JSON.parse(sessionStorage.getItem("cartData"));
    if (!Array.isArray(initialCartData)) {
        const cookieData = document.cookie.split('; ').find(row => row.startsWith('cartData='));
        initialCartData = cookieData ? JSON.parse(decodeURIComponent(cookieData.split('=')[1])) : [];
    }
    sessionStorage.setItem("cartData", JSON.stringify(initialCartData)); // Sync with sessionStorage
    updateCartUI(initialCartData);

    // Ensure form is present and add form change listeners if necessary
    cartForm = document.getElementById("cartForm");
    if (cartForm) {
        console.log("Cart form element:", cartForm);
        console.log(`Number of child nodes: ${cartForm.childNodes.length}`);
        console.log("Number of input elements in cart form:", cartForm.querySelectorAll('input').length);
        console.log("Cart form event listeners added.");
    } else {
        console.error("cartForm is not found in the DOM.");
    }

    console.log("Cart logic applied successfully!");
});

