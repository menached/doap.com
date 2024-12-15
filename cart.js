document.addEventListener("DOMContentLoaded", () => {
    const subdomain = window.location.hostname.split('.')[0]; // Extract subdomain
    const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase(); // Capitalize first letter
    document.getElementById("cityName").innerHTML = `<i class="fas fa-shopping-cart"></i> ${cityName} Doap Shopping Cart`;

    const cartForm = document.getElementById("cartForm");
    const totalDisplay = document.getElementById("total");
    const checkoutButton = document.getElementById("checkoutButton");

    if (!cartForm || !totalDisplay || !checkoutButton) {
        console.error("Required DOM elements not found!");
        return;
    }

    // Calculate total price
    cartForm.addEventListener("change", () => {
        const itemElements = cartForm.querySelectorAll('input[name="item"]');
        const total = Array.from(itemElements)
            .filter(el => el.checked)
            .reduce((sum, el) => sum + parseFloat(el.value.split('|')[1]), 0);
        totalDisplay.textContent = `$${total}`;
    });

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
});

