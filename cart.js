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

    // Update the cart dynamically
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

    // Tab switching logic
    const applyTabListeners = () => {
        const tabs = document.querySelectorAll(".tab");
        const tabContents = document.querySelectorAll(".tab-content");

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // Remove active class from all tabs and tab contents
                tabs.forEach(t => t.classList.remove("active"));
                tabContents.forEach(content => content.classList.remove("active"));

                // Add active class to clicked tab and corresponding tab content
                tab.classList.add("active");
                document.getElementById(tab.dataset.tab).classList.add("active");
            });
        });
    };

    // Apply tab listeners
    applyTabListeners();

    // Handle cart updates
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
                const [itemName, itemCost] = item.value.split('|');
                return { name: itemName, quantity, price: parseFloat(itemCost) };
            });

            const name = document.getElementById("name").value.trim();
            const city = document.getElementById("city").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();
            const address = document.getElementById("address").value.trim();
            const total = totalDisplay.textContent;
            const paymentMethod = document.getElementById("paymentMethod").value;

            if (!items.length) throw new Error("No items selected!");
            if (!name || !city || !phone || !email || !address) throw new Error("All fields must be filled out!");
            if (!paymentMethod) throw new Error("Payment method is required!");

            const payload = {
                items,
                name,
                city,
                phone,
                email,
                address,
                total,
                paymentMethod,
                city: cityName // Add city to match Lambda's expected structure
            };

            // Ensure the payload is a valid JSON string
            console.log("Payload being sent:", JSON.stringify(payload));

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



// Place this in cart.js
function setAgencyPhoneNumber() {
    const host = window.location.hostname;
    let agencyUserId = '';
    let phone = "(833)289-3627";  // Default phone number

    if (host.includes('.doobiefinder.com')) {
        agencyUserId = host.replace('.doobiefinder.com', '');
    } else if (host.includes('.doap.com')) {
        agencyUserId = host.replace('.doap.com', '');
    } else if (host.includes('.dooberz.com')) {
        agencyUserId = host.replace('.dooberz.com', '');
    }

    // Set phone number based on the agency
    switch (agencyUserId) {
        case 'alamo':
            phone = "925-553-4710";
            break;
        case 'antioch':
            phone = "(925)891-7800";
            break;
        // Add other cases here...
        default:
            phone = "(833)289-3627";  // Default phone number
    }

    // Update the title of the page with the phone number
    document.title = `Call us at ${phone}`;
}

// Run the function when the page loads
window.onload = setAgencyPhoneNumber;

