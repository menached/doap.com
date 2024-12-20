import { subdomainData } from './subdomainData.js';

console.log("doap.js started loading");

document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const cartDisplay = document.getElementById("cartItems");
    const totalDisplay = document.getElementById("cartTotal");
    const paymentMethods = document.querySelectorAll("input[name='paymentMethod']");
    const paymentMessage = document.getElementById("paymentMessage");

    // 1. Update Title, Phone, and Minimum Order
    const hostname = window.location.hostname;
    let domainName = hostname.split('.')[0].toLowerCase();

    if (hostname === "www.doap.com" || hostname === "doap.com") {
        document.title = "Directory Of Agencies & Providers";
        const mainH1 = document.querySelector("h1");
        if (mainH1) mainH1.style.display = "none";

        const minOrderElement = document.getElementById("minimumOrder");
        if (minOrderElement) minOrderElement.textContent = "Minimum Order: $60";
    } else {
        const currentSubdomainData = subdomainData.find(data => data.subdomain === domainName);
        const cityName = currentSubdomainData ? currentSubdomainData.city : "Norcal Doap";
        const phoneNumber = currentSubdomainData ? currentSubdomainData.phone : "833-289-3627";
        const minimumOrder = currentSubdomainData ? currentSubdomainData.minimumOrder : 60;

        document.title = `${cityName} Doap`;
        const phoneNumberElement = document.querySelector(".phone-number");
        if (phoneNumberElement) {
            phoneNumberElement.textContent = phoneNumber;
            phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
        }

        const minOrderElement = document.getElementById("minimumOrder");
        if (minOrderElement) minOrderElement.textContent = `Minimum Order: $${minimumOrder}`;
    }

    // 2. Tabs Functionality
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(tc => tc.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    // 3. Render the Cart
    const renderCart = () => {
        if (cartDisplay && totalDisplay) {
            cartDisplay.innerHTML = cart
                .map(
                    (item, index) => `
                    <div class="cart-item">
                        <span>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                `
                )
                .join("");

            const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
        }
    };

    // 4. Add to Cart
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productElement = e.target.closest(".product-item");
            const name = productElement.querySelector(".product-name").textContent;
            const price = parseFloat(productElement.querySelector(".product-price").dataset.price);
            const quantity = parseInt(productElement.querySelector(".product-quantity").value, 10);

            cart.push({ name, price, quantity });
            renderCart();
        }
    });

    // 5. Remove from Cart
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = parseInt(e.target.dataset.index, 10);
            cart.splice(index, 1);
            renderCart();
        }
    });

    // 6. Payment Method Handling
    if (paymentMethods && paymentMessage) {
        const paymentDetails = {
            "credit-card": "Enter your credit card details at checkout.",
            "cash": "Please have the exact cash amount ready for delivery.",
            "crypto": "Send your payment to the wallet address provided during checkout.",
            "zelle": "Send your payment via Zelle to info@doap.com.",
            "venmo": "Send your payment via Venmo to @Doap-Payments.",
            "paypal": "Send your payment via PayPal to paypal@doap.com.",
        };

        paymentMethods.forEach((method) => {
            method.addEventListener("change", (event) => {
                const selectedMethod = event.target.value;
                const message = paymentDetails[selectedMethod] || "Please select a valid payment method.";
                paymentMessage.textContent = message;
            });
        });
    }

    // 7. ZIP Form Logic
    const zipForm = document.querySelector("#zipForm");
    if (zipForm) {
        const input = zipForm.querySelector("input");
        const message = zipForm.querySelector(".message");

        zipForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const userInput = input.value.trim().toLowerCase();
            if (!userInput) {
                message.textContent = "Please enter a valid ZIP Code or city.";
                message.style.display = "block";
                return;
            }

            const match = subdomainData.find(data =>
                data.servingCities.some(city => city.toLowerCase() === userInput) ||
                data.serviceZips.includes(parseInt(userInput, 10))
            );

            if (match) {
                window.location.href = match.url;
            } else {
                message.textContent = "No matching location found. Please try again.";
            }
        });
    } else {
        console.error("ZIP form not found on the page.");
    }
});

console.log("doap.js loaded successfully!");

