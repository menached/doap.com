document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkoutButton");
    const cartForm = document.getElementById("cartForm");
    const totalDisplay = document.getElementById("total");

    if (!checkoutButton || !cartForm || !totalDisplay) {
        console.error("Required DOM elements not found!");
        return;
    }

    checkoutButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default form submission
        submitCart();
    });

    cartForm.addEventListener("change", () => {
        const itemElements = cartForm.querySelectorAll('input[name="item"]');
        const items = Array.from(itemElements)
            .filter(el => el.checked)
            .map(el => parseFloat(el.value.split("|")[1]));
        const total = items.reduce((sum, price) => sum + price, 0);
        totalDisplay.textContent = `$${total}`;
    });

    async function submitCart() {
        try {
            const itemElements = cartForm.querySelectorAll('input[name="item"]');
            const items = Array.from(itemElements)
                .filter(el => el.checked)
                .map(el => el.value.split("|")[0]);

            if (items.length === 0) {
                throw new Error("No items selected.");
            }

            const email = document.getElementById("email").value;
            if (!email) {
                throw new Error("Email is required.");
            }

            const address = document.getElementById("address").value;
            if (!address) {
                throw new Error("Address is required.");
            }

            const total = totalDisplay.textContent;

            const data = { items, email, address, total };

            const response = await fetch(
                "https://eft3wrtpad.execute-api.us-west-2.amazonaws.com/prod/checkout",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                alert("Order submitted successfully!");
            } else {
                const errorText = await response.text();
                console.error("Error submitting order:", errorText);
                alert("Error submitting order.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        }
    }
});

