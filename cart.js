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

    cartForm.addEventListener("change", () => {
        const itemElements = cartForm.querySelectorAll('input[name="item"]');
        const total = Array.from(itemElements)
            .filter(el => el.checked)
            .reduce((sum, el) => sum + parseFloat(el.value.split('|')[1]), 0);
        totalDisplay.textContent = `$${total}`;

        // Update the cart dynamically with item name and cost
        const checkedItems = Array.from(cartForm.querySelectorAll('input[name="item"]:checked'));
        selectedItemsList.innerHTML = checkedItems.length
            ? checkedItems.map(item => {
                const [itemName, itemCost] = item.value.split('|');
                return `<li>${itemName} - $${itemCost}</li>`;
              }).join('')
            : '<li>No items selected yet.</li>';
    });

    // Handle form submission
    checkoutButton.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const checkedItems = cartForm.querySelectorAll('input[name="item"]:checked');
            const items = Array.from(checkedItems).map(item => item.value.split('|')[0]);

            if (items.length === 0) throw new Error("No items selected!");

            const email = document.getElementById("email").value.trim();
            const address = document.getElementById("address").value.trim();
            const total = totalDisplay.textContent;

            if (!email) throw new Error("Email is required!");
            if (!address) throw new Error("Address is required!");

            const payload = {
                items,
                email,
                address,
                total,
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

