document.addEventListener("DOMContentLoaded", () => {
    // Set up city name dynamically in the header
    const subdomain = window.location.hostname.split('.')[0]; // Extract subdomain
    const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase(); // Capitalize first letter
    document.getElementById("cityName").innerHTML = `<i class="fas fa-shopping-cart"></i> ${cityName} Doap Shopping Cart`;

    const cartForm = document.getElementById("cartForm");
    const totalDisplay = document.getElementById("total");
    const checkoutButton = document.getElementById("checkoutButton");
    const selectedItemsList = document.getElementById("selectedItemsList");

    if (!cartForm || !totalDisplay || !checkoutButton) {
        console.error("Required DOM elements not found!");
        return;
    }

    const updateCart = () => {
        const itemElements = cartForm.querySelectorAll('input[name="item"]');
        let total = 0;

        // Update cart dynamically
        const cartItems = Array.from(itemElements)
            .filter(el => el.checked)
            .map(item => {
                const quantityInput = item.closest(".item").querySelector(".quantity");
                const quantity = parseInt(quantityInput.value, 10) || 1;
                const [itemName, itemCost] = item.value.split('|');
                const cost = parseFloat(itemCost) * quantity;

                total += cost;

                return `<li>${itemName} (x${quantity}) - $${cost.toFixed(2)} 
                    <span class="remove-item" data-value="${item.value}">x</span></li>`;
            });

        selectedItemsList.innerHTML = cartItems.length
            ? cartItems.join("")
            : '<li>No items selected yet.</li>';

        totalDisplay.textContent = `$${total.toFixed(2)}`;

        // Add remove functionality to each "x"
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const valueToRemove = button.getAttribute("data-value");
                const itemToUncheck = cartForm.querySelector(`input[name="item"][value="${valueToRemove}"]`);
                if (itemToUncheck) {
                    itemToUncheck.checked = false;
                    cartForm.dispatchEvent(new Event("change")); // Trigger change to update cart
                }
            });
        });
    };

    // Handle changes in cart (checkboxes or quantity)
    cartForm.addEventListener("change", () => {
        updateCart();
    });

    // Handle quantity input
    cartForm.addEventListener("input", (event) => {
        if (event.target.classList.contains("quantity")) {
            updateCart();
        }
    });

    // Handle form submission
    checkoutButton.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const checkedItems = cartForm.querySelectorAll('input[name="item"]:checked');
            const items = Array.from(checkedItems).map(item => {
                const quantityInput = item.closest(".item").querySelector(".quantity");
                const quantity = parseInt(quantityInput.value, 10) || 1;
                const [itemName] = item.value.split('|');
                return { name: itemName, quantity };
            });

            if (items.length === 0) throw new Error("No items selected!");

            const email = document.getElementById("email").value.trim();
            const address = document.getElementById("address").value.trim();
            const total = totalDisplay.textContent;
            const paymentMethod = document.getElementById("paymentMethod").value;

            if (!email) throw new Error("Email is required!");
            if (!address) throw new Error("Address is required!");
            if (!paymentMethod) throw new Error("Payment method is required!");

            const payload = {
                items,
                email,
                address,
                total,
                paymentMethod,
                city: cityName // Add city to match Lambda's expected structure
            };

            const response = await fetch("https://eft3wrtpad.execute-api.us-west-2.amazonaws.com/prod/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Order submitted successfully!");
            } else {
                const error = await response.text();
                console.error("Error submitting order:", error);
                alert("Failed to submit order.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        }
    });

    // Tab switching logic
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });
});

