document.addEventListener("DOMContentLoaded", () => {
    console.log("doap.js started loading");

    // Constants and Elements
    const cartForm = document.getElementById("cartForm");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const minOrderMessage = document.getElementById("minOrderMessage");
    const MINIMUM_ORDER = 50;

    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    const paymentMethodDropdown = document.getElementById("paymentMethod");
    const creditCardForm = document.getElementById("creditCardForm");
    const cryptoWallets = document.getElementById("cryptoWallets");
    const generalHelp = document.getElementById("generalHelp");

    const checkoutButton = document.getElementById("checkoutButton");

    // Tab Switching
    const initializeTabs = () => {
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // Remove active classes
                tabs.forEach(t => t.classList.remove("active"));
                tabContents.forEach(tc => tc.classList.remove("active"));

                // Add active class to clicked tab and corresponding content
                tab.classList.add("active");
                const targetTab = document.getElementById(tab.dataset.tab);
                if (targetTab) targetTab.classList.add("active");
            });
        });
        console.log("Tabs initialized successfully!");
    };

    // Cart Logic
    const updateCart = () => {
        const selectedItems = cartForm.querySelectorAll('button.add-to-cart');
        let total = 0;

        const items = Array.from(selectedItems).map(item => {
            const productItem = item.closest(".product-item");
            const name = productItem.querySelector(".product-name").textContent;
            const price = parseFloat(productItem.querySelector(".product-price").dataset.price);
            const quantity = parseInt(productItem.querySelector(".product-quantity").value, 10) || 1;

            total += price * quantity;

            return `<li>${name} (x${quantity}) - $${(price * quantity).toFixed(2)}</li>`;
        });

        cartItems.innerHTML = items.length ? items.join("") : "<li>No items selected yet.</li>";
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        if (total < MINIMUM_ORDER) {
            minOrderMessage.textContent = `Minimum order is $${MINIMUM_ORDER}.`;
            minOrderMessage.style.color = "red";
        } else {
            minOrderMessage.textContent = "You're eligible for delivery!";
            minOrderMessage.style.color = "green";
        }
    };

    const initializeCart = () => {
        cartForm.addEventListener("click", event => {
            if (event.target.classList.contains("add-to-cart")) {
                event.preventDefault();
                updateCart();
            }
        });

        updateCart();
        console.log("Cart initialized successfully!");
    };

    // Payment Method Logic
    const handlePaymentMethodChange = method => {
        creditCardForm.style.display = "none";
        cryptoWallets.style.display = "none";
        generalHelp.style.display = "none";

        if (method === "credit-card") creditCardForm.style.display = "block";
        if (method === "crypto") cryptoWallets.style.display = "block";
        if (["cash", "zelle", "venmo", "paypal", "cashapp"].includes(method)) generalHelp.style.display = "block";
    };

    const initializePaymentMethods = () => {
        paymentMethodDropdown.addEventListener("change", event => {
            handlePaymentMethodChange(event.target.value);
        });

        handlePaymentMethodChange(paymentMethodDropdown.value);
        console.log("Payment methods initialized successfully!");
    };

    // Checkout Logic
    const initializeCheckout = () => {
        if (checkoutButton) {
            checkoutButton.addEventListener("click", async event => {
                event.preventDefault();

                try {
                    const selectedItems = cartForm.querySelectorAll('button.add-to-cart');
                    const items = Array.from(selectedItems).map(item => {
                        const productItem = item.closest(".product-item");
                        const name = productItem.querySelector(".product-name").textContent;
                        const price = parseFloat(productItem.querySelector(".product-price").dataset.price);
                        const quantity = parseInt(productItem.querySelector(".product-quantity").value, 10) || 1;

                        return { name, price, quantity };
                    });

                    const name = document.getElementById("name").value.trim();
                    const city = document.getElementById("city").value.trim();
                    const phone = document.getElementById("phone").value.trim();
                    const email = document.getElementById("email").value.trim();
                    const address = document.getElementById("address").value.trim();
                    const total = cartTotal.textContent.replace("Total: $", "").trim();
                    const paymentMethod = paymentMethodDropdown.value;
                    const specialInstructions = document.getElementById("specialInstructions").value.trim();

                    if (!name || !city || !phone || !email || !address || items.length === 0) {
                        throw new Error("All fields must be filled and at least one item must be selected!");
                    }

                    const payload = {
                        items,
                        name,
                        city,
                        phone,
                        email,
                        address,
                        total: parseFloat(total),
                        paymentMethod,
                        specialInstructions // Include special instructions
                    };

                    console.log("Payload:", payload);

                    const response = await fetch("https://your-api-gateway-url/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Failed to submit order: ${errorText}`);
                    }

                    alert("Order submitted successfully!");
                } catch (error) {
                    console.error("Error during checkout:", error);
                    alert(error.message);
                }
            });
        }

        console.log("Checkout initialized successfully!");
    };

    // Initialize Features
    initializeTabs();
    initializeCart();
    initializePaymentMethods();
    initializeCheckout();

    console.log("doap.js loaded completely");
});

