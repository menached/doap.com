document.addEventListener("DOMContentLoaded", () => {
    console.log("cart.js started loading");

    // Subdomain and city-based configurations
    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();

    const areaMinimum = {
        alamo: 40, walnutcreek: 50, concord: 50, sanramon: 40, dublin: 40, 
        lafayette: 50, livermore: 50, orinda: 60, pleasanthill: 60
    };
    const MINIMUM_ORDER_AMOUNT = areaMinimum[domainName] || 60;

    const phoneMap = {
        alamo: "925-553-4710", walnutcreek: "925-464-2075", 
        concord: "925-412-4880", sanramon: "925-365-6030"
    };
    const phoneNumber = phoneMap[domainName] || "833-289-3627";

    const cityName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
    document.title = `${cityName} Doap`;

    // Update phone number in the header
    const phoneElement = document.querySelector(".phone-number");
    if (phoneElement) {
        phoneElement.textContent = phoneNumber;
        phoneElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

    // Payment Method Handling
    const paymentMethodDropdown = document.getElementById("paymentMethod");
    const creditCardForm = document.getElementById("creditCardForm");
    const cryptoWallets = document.getElementById("cryptoWallets");
    const generalHelp = document.getElementById("generalHelp");

    const handlePaymentMethodChange = (selectedMethod) => {
        creditCardForm.style.display = "none";
        cryptoWallets.style.display = "none";
        generalHelp.style.display = "none";

        if (selectedMethod === "credit-card") creditCardForm.style.display = "block";
        if (selectedMethod === "crypto") cryptoWallets.style.display = "block";
        if (["cash", "zelle", "venmo", "paypal", "cashapp"].includes(selectedMethod)) {
            generalHelp.style.display = "block";
        }
    };

    if (paymentMethodDropdown) {
        paymentMethodDropdown.addEventListener("change", (event) => {
            handlePaymentMethodChange(event.target.value);
        });
    }

    // Cart Logic
    const cartForm = document.getElementById("cartForm");
    const totalDisplay = document.getElementById("total");
    const selectedItemsList = document.getElementById("selectedItemsList");

    const updateCart = () => {
        const itemElements = cartForm.querySelectorAll('input[name="item"]:checked');
        let total = 0;

        const cartItems = Array.from(itemElements).map(item => {
            const quantityInput = item.closest(".item").querySelector(".quantity");
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const [itemName, itemCost] = item.value.split('|');
            const cost = parseFloat(itemCost) * quantity;

            total += cost;
            return `<li>${itemName} (x${quantity}) - $${cost.toFixed(2)}</li>`;
        });

        selectedItemsList.innerHTML = cartItems.length 
            ? cartItems.join("")
            : '<li>No items selected yet.</li>';
        totalDisplay.textContent = `$${total.toFixed(2)}`;
    };

    if (cartForm) {
        cartForm.addEventListener("change", updateCart);
        cartForm.addEventListener("input", updateCart);
    }

    // Order Submission
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const items = Array.from(cartForm.querySelectorAll('input[name="item"]:checked')).map(item => {
                const quantityInput = item.closest(".item").querySelector(".quantity");
                const quantity = parseInt(quantityInput.value, 10) || 1;
                const [itemName, itemCost] = item.value.split('|');
                return { name: itemName, quantity, price: parseFloat(itemCost) };
            });

            const name = document.getElementById("name").value.trim();
            const city = document.getElementById("city").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();
            const address = document.getElementById("address").value.trim();
            const paymentMethod = document.getElementById("paymentMethod").value;
            const total = parseFloat(totalDisplay.textContent.replace('$', ''));

            if (!items.length) return alert("No items selected!");
            if (total < MINIMUM_ORDER_AMOUNT) return alert(`Minimum order is $${MINIMUM_ORDER_AMOUNT}.`);

            const payload = { items, name, city, phone, email, address, total, paymentMethod };
            console.log("Submitting payload:", payload);

            try {
                const response = await fetch("https://eft3wrtpad.execute-api.us-west-2.amazonaws.com/prod/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                alert("Order submitted successfully!");
            } catch (error) {
                console.error("Error submitting order:", error);
                alert("Failed to submit the order. Please try again.");
            }
        });
    }

    console.log("cart.js loaded completely");
});

