import { subdomainData } from './subdomainData.js';

console.log("doap.js started loading");

document.addEventListener("DOMContentLoaded", () => {
    // Extract hostname and determine subdomain
    const hostname = window.location.hostname;
    let domainName = hostname.split('.')[0].toLowerCase();

    // Handle root domain and www subdomain
    if (hostname === "www.doap.com" || hostname === "doap.com") {
        document.title = "Directory Of Agencies & Providers";
        const mainH1 = document.querySelector("h1");
        if (mainH1) {
            mainH1.style.display = "none"; // Hide the h1 for these domains
        }

        // Ensure the minimum order is displayed for root domains
        const minOrderElement = document.getElementById("minimumOrder");
        if (minOrderElement) {
            minOrderElement.textContent = "Minimum Order: $60"; // Default minimum for root
        }

        return; // Stop further processing for root domains
    }

    // Handle other subdomains
    if (domainName === "www") {
        domainName = "default"; // Replace 'default' with the appropriate subdomain handling
    }

    // Find the current subdomain data
    const currentSubdomainData = subdomainData.find(data => data.subdomain === domainName);

    // Default values if no subdomain match
    const cityName = currentSubdomainData ? currentSubdomainData.city : "Norcal Doap";
    const phoneNumber = currentSubdomainData ? currentSubdomainData.phone : "833-289-3627";
    const minimumOrder = currentSubdomainData ? currentSubdomainData.minimumOrder : 60;

    // Update page title and header
    document.title = `${cityName} Doap`;
    const mainH1 = document.querySelector("h1");
    if (mainH1 && currentSubdomainData) {
        mainH1.textContent = document.title;
    } else if (mainH1) {
        mainH1.style.display = "none"; // Hide the h1 if no valid subdomain data
    }

    // Update phone number
    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

    // Display the minimum order amount
    const minOrderElement = document.getElementById("minimumOrder");
    if (minOrderElement) {
        minOrderElement.textContent = `Minimum Order: $${minimumOrder}`;
        console.log(`Updated minimum order to: $${minimumOrder}`);
    }

    // ZIP Form logic
    const zipForm = document.querySelector("#zipForm");
    if (zipForm) {
        const input = zipForm.querySelector("input");
        const message = zipForm.querySelector(".message");

        zipForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const userInput = input.value.trim().toLowerCase();
            console.log(`ZIP form submitted with input: ${userInput}`);

            if (!userInput) {
                message.textContent = "Please enter a valid ZIP Code or city.";
                message.style.display = "block";
                return;
            }

            // Find matching subdomain by city or ZIP code
            let matchedURL = null;
            for (const data of subdomainData) {
                const matchesCity = data.servingCities.some(city => city.toLowerCase() === userInput);
                const matchesZip = data.serviceZips.includes(parseInt(userInput, 10));

                if (matchesCity || matchesZip) {
                    matchedURL = data.url;
                    break;
                }
            }

            if (matchedURL) {
                console.log(`Matched URL: ${matchedURL}`);
                window.location.href = matchedURL;
            } else {
                message.textContent = "No matching location found. Please try again.";
                message.style.display = "block";
            }
        });
    } else {
        console.error("ZIP form not found on the page.");
    }

    // Cart functionality
    const cart = [];
    const cartDisplay = document.getElementById("cartItems");
    const totalDisplay = document.getElementById("cartTotal");

    // Render the cart
    const renderCart = () => {
        if (cartDisplay && totalDisplay) {
            cartDisplay.innerHTML = cart
                .map(
                    (item, index) => `
                        <div class="cart-item">
                            <span>${item.name} - $${item.price.toFixed(2)}</span>
                            <button class="remove-btn" data-index="${index}">Remove</button>
                        </div>
                    `
                )
                .join("");

            const total = cart.reduce((acc, item) => acc + item.price, 0);
            totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
        }
    };

    // Add to Cart
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productElement = e.target.closest(".product-item");
            const name = productElement.querySelector(".product-name").textContent;
            const price = parseFloat(productElement.querySelector(".product-price").dataset.price);

            cart.push({ name, price });
            renderCart();
            console.log("Cart updated:", cart);
        }
    });

    // Remove from Cart
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = parseInt(e.target.dataset.index, 10);
            cart.splice(index, 1);
            renderCart();
            console.log("Cart updated:", cart);
        }
    });

    // Payment method selection
    const paymentMethods = document.querySelectorAll("input[name='paymentMethod']");
    const paymentMessage = document.getElementById("paymentMessage");

    // Payment method messages
    const paymentDetails = {
        "credit-card": "Enter your credit card details at checkout.",
        "cash": "Please have the exact cash amount ready for delivery.",
        "crypto": "Send your payment to the wallet address provided during checkout.",
        "zelle": "Send your payment via Zelle to info@doap.com.",
        "venmo": "Send your payment via Venmo to @Doap-Payments.",
        "paypal": "Send your payment via PayPal to paypal@doap.com.",
    };

    // Add event listeners to all payment method radio buttons
    paymentMethods.forEach((method) => {
        method.addEventListener("change", (event) => {
            const selectedMethod = event.target.value;
            const message = paymentDetails[selectedMethod] || "Please select a valid payment method.";
            paymentMessage.textContent = message;
        });
    });
});

console.log("doap.js loaded successfully!");

