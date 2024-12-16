document.addEventListener("DOMContentLoaded", () => {
    // Subdomain and city name logic
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase();

    // Initial default capitalization for single-word names
    let cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase();

    // Map of subdomains to full city names
    const cityMap = {
        pleasanthill: "Pleasant Hill",
        walnutcreek: "Walnut Creek",
        castrovalley: "Castro Valley",
        sanramon: "San Ramon",
        discoverybay: "Discovery Bay",
        // Add other two-word city names or overrides here
    };

    // Check if the subdomain exists in the city map
    if (cityMap[subdomain]) {
        cityName = cityMap[subdomain];
    }

    // Dynamically update city name in the header
    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.textContent = `${cityName} Doap`;
    }

    // Optionally update the document title
    document.title = `${cityName} Doap`;

    console.log(`City Name: ${cityName}`);

    const defaultDescription = `${cityName} DOAP Delivers Organic Awesome Pot to ${cityName} and surrounding cities 9-9 daily.`;

    // Update the page title
    //document.title = `${cityName} Doap`;


    // Update the header area without the shopping cart icon
    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.textContent = `${cityName} Doap`;
    }

    // Update logo link
    const logoLink = document.querySelector(".header a");
    if (logoLink) {
        logoLink.href = `https://${subdomain}.doap.com/cart.html`;
        logoLink.title = `Call ${cityName} Doap!`;
    }

    // Set up Open Graph and Twitter meta tags
    const ogMetaTags = [
        { property: "og:title", content: `${cityName} Doap - Call us today!` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `https://${hostname}/cart.html` },
        { property: "og:description", content: defaultDescription },
        { property: "og:image", content: `https://${subdomain}.doap.com/${subdomain}doapbanner.webp` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: `https://${subdomain}.doap.com/${subdomain}doapbanner.png` },
        { name: "twitter:title", content: `${cityName} Doap - Call us today!` },
        { name: "twitter:description", content: defaultDescription },
        { name: "twitter:site", content: "@danvilledoap" }
    ];

    // Remove existing meta tags
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(tag => tag.remove());

    // Append new meta tags
    ogMetaTags.forEach(tagData => {
        const tag = document.createElement("meta");
        Object.keys(tagData).forEach(key => {
            tag.setAttribute(key, tagData[key]);
        });
        document.head.appendChild(tag);
        console.log("Added meta tag:", tagData.property || tagData.name);
    });

    console.log("Open Graph and Twitter meta tags added successfully!");

    // Payment method handling
    const paymentMethodDropdown = document.getElementById("paymentMethod");
    const creditCardForm = document.getElementById("creditCardForm");
    const cryptoWallets = document.getElementById("cryptoWallets");
    const generalHelp = document.getElementById("generalHelp");

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
        } else if (["cash"].includes(selectedMethod)) {
        generalHelp.style.display = "block";
        // Update the message for "Cash" payment method
        generalHelp.innerHTML = `
            <h3 style="display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fas fa-phone-alt"></i> Cash on Delivery</span>
                <i class="fas fa-question-circle" style="color: green; cursor: pointer;" title="Need more help? Click here!"></i>
            </h3>
            <p>After placing your order, please check your email for further instructions on how to track your order. 
            Feel free to call us at <strong>(833) 289-3627</strong> for assistance. We're standing by to help!</p>
        `;
    } else if (["zelle", "venmo", "paypal"].includes(selectedMethod)) {
            generalHelp.style.display = "block";
            // Update the message for other payment methods.
            generalHelp.innerHTML = `
                <h3 style="display: flex; justify-content: space-between; align-items: center;">
                    <span><i class="fas fa-phone-alt"></i> Need Assistance?</span>
                    <i class="fas fa-question-circle" style="color: green; cursor: pointer;" title="Need more help? Click here!"></i>
                </h3>
                <p>After placing your order, please check your email for further instructions on how to complete your payment. 
                Feel free to call us at <strong>(833) 289-3627</strong> for assistance. We're standing by to help!</p>
            `;
            }
    };

    if (paymentMethodDropdown) {
        paymentMethodDropdown.addEventListener("change", (event) => {
            handlePaymentMethodChange(event.target.value);
        });

        // Trigger default behavior on page load
        handlePaymentMethodChange(paymentMethodDropdown.value);
    }

    console.log("Payment method logic applied!");

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
                const targetTab = document.getElementById(tab.dataset.tab);
                if (targetTab) {
                    targetTab.classList.add("active");
                }
            });
        });
    };

    applyTabListeners();
    console.log("Tab logic applied successfully!");

    // Cart update logic
    const cartForm = document.getElementById("cartForm");
    const totalDisplay = document.getElementById("total");
    const selectedItemsList = document.getElementById("selectedItemsList");

    const updateCart = () => {
        const itemElements = cartForm.querySelectorAll('input[name="item"]');
        let total = 0;

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

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const valueToRemove = button.getAttribute("data-value");
                const itemToUncheck = cartForm.querySelector(`input[name="item"][value="${valueToRemove}"]`);
                if (itemToUncheck) {
                    itemToUncheck.checked = false;
                    cartForm.dispatchEvent(new Event("change"));
                }
            });
        });
    };

    // Event listeners for cart updates
    if (cartForm) {
        cartForm.addEventListener("change", updateCart);
        cartForm.addEventListener("input", (event) => {
            if (event.target.classList.contains("quantity")) {
                updateCart();
            }
        });
    }

    console.log("Cart logic applied successfully!");

    // Remove "Call us at" from the phone number
    const phone = document.querySelector(".phone-number");
    if (phone) {
        phone.textContent = phone.textContent.replace(/Call us at\s*/, '');
    }


    // Checkout button logic
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton && cartForm) {
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
                if (!name || !city || !phone || !email || !address) {
                    throw new Error("All fields must be filled out!");
                }
                if (!paymentMethod) throw new Error("Payment method is required!");

                const payload = { items, name, city, phone, email, address, total, paymentMethod };

                console.log("Payload being sent:", payload);

                const response = await fetch("https://eft3wrtpad.execute-api.us-west-2.amazonaws.com/prod/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error from API:", errorText);
                    throw new Error("Failed to submit order.");
                }

                alert("Order submitted successfully!");
            } catch (error) {
                console.error("Error during checkout:", error);
                alert(error.message);
            }
        });
    }
});

