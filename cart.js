document.addEventListener("DOMContentLoaded", () => {
    // Set up city name dynamically in the header
    const subdomain = window.location.hostname.split('.')[0]; // Extract subdomain
    const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase(); // Capitalize first letter
    document.getElementById("cityName").innerHTML = `<i class="fas fa-shopping-cart"></i> ${cityName} Doap `;
    
    // Update logo link
    const logoLink = document.querySelector(".header a");
    if (logoLink) {
        logoLink.href = `https://${subdomain}.doap.com/cart.html`; // Dynamically set link based on subdomain
        logoLink.title = `Call ${cityName} Doap!`; // Set hover text
    }

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
        case 'burlingame':
            phone = "(650)293-0880";
            break;
        case 'campbell':
            phone = "(408)645-6700";
            break;
        case 'castrovalley':
            phone = "(925)263-9209";
            break;
        case 'concord':
            phone = "(925)412-4880";
            break;
        case 'danville':
            phone = "(925)725-6920";
            break;
        case 'discoverybay':
            phone = "(925)891-7800";
            break;
        case 'dublin':
            phone = "(925)587-6777";
            break;
        case 'hillsborough':
            phone = "(650)293-0880";
            break;
        case 'livermore':
            phone = "(925)718-6181";
            break;
        case 'lafayette':
            phone = "(925)871-1333";
            break;
        case 'orinda':
            phone = "(925)891-7800";
            break;
        case 'pittsburg':
            phone = "(925)825-8555";
            break;
        case 'pleasanthill':
            phone = "(925)891-7800";
            break;
        case 'pleasanton':
            phone = "(925)587-6777";
            break;
        case 'sanramon':
            phone = "(925)365-6030";
            break;
        case 'walnutcreek':
            phone = "(925)464-2075";
            break;
        case 'sunol':
            phone = "(925)718-6181";
            break;
        default:
            phone = "(833)289-3627";  // Default phone number
    }

    // Update the title of the page with the city name and "Doap"
    document.title = `${agencyUserId.charAt(0).toUpperCase() + agencyUserId.slice(1)} Doap`;

    // Create a new div element to display the phone number below the "Delivering Organic Awesome Pot" text
    const phoneDiv = document.createElement('div');
    phoneDiv.style.textAlign = 'center';
    phoneDiv.style.marginTop = '10px';
    phoneDiv.style.fontSize = '18px';
    phoneDiv.style.fontWeight = 'bold';
    phoneDiv.innerHTML = `<a href="tel:${phone}" style="color: inherit; text-decoration: none;">${phone}</a>`;

    // Find the element with the class 'menu-title-text' and insert the phone number div after it
    const menuTitle = document.querySelector('.menu-title-text');
    if (menuTitle) {
        menuTitle.insertAdjacentElement('afterend', phoneDiv);
    }
}

// Run the function when the page loads
window.onload = setAgencyPhoneNumber;



document.addEventListener("DOMContentLoaded", () => {
    // Extract city or subdomain to determine the phone number
    const subdomain = window.location.hostname.split('.')[0]; // Get the subdomain
    const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase(); // Capitalize city name
    const cityPhoneMap = {
        alamo: "9255534710",
        antioch: "9258917800",
        burlingame: "6502930880",
        campbell: "4086456700",
        castrovalley: "9252639209",
        concord: "9254124880",
        danville: "9257256920",
        discoverybay: "9258917800",
        dublin: "9255876777",
        hillsborough: "6502930880",
        livermore: "9257186181",
        lafayette: "9258711333",
        orinda: "9258917800",
        pittsburg: "9258258555",
        pleasanthill: "9258917800",
        pleasanton: "9255876777",
        sanramon: "9253656030",
        walnutcreek: "9254642075",
        sunol: "9257186181",
    };

    const defaultPhone = "8332893627"; // Default phone number if no match is found
    const phone = cityPhoneMap[subdomain] || defaultPhone;

    // Update the city name in the header
    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.textContent = `${cityName} Doap`;
    }

    // Update the phone number link
    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.href = `tel:${phone}`; // Set the tel link
        phoneNumberElement.textContent = `Call us at (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`; // Format and set the text
    }
});




document.addEventListener("DOMContentLoaded", () => {
    const paymentMethodDropdown = document.getElementById("paymentMethod");
    const creditCardForm = document.getElementById("creditCardForm");
    const cryptoWallets = document.getElementById("cryptoWallets");
    const generalHelp = document.getElementById("generalHelp");

    // Function to toggle cart visibility based on items
    const toggleCartVisibility = () => {
        const cartSection = document.querySelector(".cart-section");
        const selectedItemsList = document.getElementById("selectedItemsList");
        const noItemsSelected = selectedItemsList.innerHTML.includes("No items selected yet.");

        // Show or hide the cart section
        if (noItemsSelected) {
            cartSection.style.display = "none"; // Hide the cart if empty
        } else {
            cartSection.style.display = "block"; // Show the cart if items are selected
        }
    };

    // Call toggleCartVisibility whenever the cart is updated
    cartForm.addEventListener("change", () => {
        updateCart();
        toggleCartVisibility();
    });

    // Initial check on page load
    toggleCartVisibility();



    // Function to handle showing the appropriate section
    const handlePaymentMethodChange = (selectedMethod) => {
        // Hide all sections initially
        creditCardForm.style.display = "none";
        cryptoWallets.style.display = "none";
        generalHelp.style.display = "none";

        // Show the appropriate section based on the selected payment method
        if (selectedMethod === "credit-card") {
            creditCardForm.style.display = "block";
        } else if (selectedMethod === "crypto") {
            cryptoWallets.style.display = "block";
        } else if (selectedMethod === "cash" || selectedMethod === "zelle" || selectedMethod === "venmo" || selectedMethod === "paypal") {
            generalHelp.style.display = "block";
        }
    };

    // Attach event listener for payment method changes
    paymentMethodDropdown.addEventListener("change", (event) => {
        handlePaymentMethodChange(event.target.value);
    });

    // Trigger the default behavior on page load (default is "cash")
    handlePaymentMethodChange(paymentMethodDropdown.value);
});

