document.addEventListener("DOMContentLoaded", () => {
    // Mapping of subdomains to city names
    const subdomainToCityName = {
        alamo: "Alamo",
        antioch: "Antioch",
        burlingame: "Burlingame",
        campbell: "Campbell",
        castrovalley: "Castro Valley",
        concord: "Concord",
        danville: "Danville",
        dublin: "Dublin",
        hillsborough: "Hillsborough",
        livermore: "Livermore",
        lafayette: "Lafayette",
        orinda: "Orinda",
        pittsburg: "Pittsburg",
        pleasanthill: "Pleasant Hill",
        pleasanton: "Pleasanton",
        sanramon: "San Ramon",
        walnutcreek: "Walnut Creek",
        sunol: "Sunol",
        default: "Default City" // Fallback city name
    };

    // Extract the subdomain from the hostname
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0].toLowerCase();

    // Debugging: Check the extracted hostname and subdomain
    console.log("Hostname:", hostname);
    console.log("Subdomain:", subdomain);

    // Get the city name from the mapping
    const cityName = subdomainToCityName[subdomain] || subdomainToCityName.default;

    // Debugging: Verify the resolved city name
    console.log(`Resolved cityName: ${cityName} from subdomain: ${subdomain}`);

    // Update the city name in the UI
    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.textContent = `${cityName} Doap`; // Set the city name in the header
        console.log("City name updated in the UI.");
    } else {
        console.warn("Element with ID 'cityName' not found!");
    }

    // Update the page title
    document.title = `${cityName} Doap`;
    console.log(`Page title updated to: ${document.title}`);
});



document.addEventListener("DOMContentLoaded", () => {
    // Subdomain and city name logic
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase();
    const defaultDescription = `${cityName} DOAP Delivers Organic Awesome Pot to ${cityName} and surrounding cities 9-9 daily.`;

    // Update the page title
    document.title = `${cityName} Doap`;


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
        } else if (["cash", "zelle", "venmo", "paypal"].includes(selectedMethod)) {
            generalHelp.style.display = "block";
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

