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
    const agencyPhoneNumbers = {
        danville: "(925) 725-6920",
        alamo: "(925) 553-4710",
        antioch: "(925) 891-7800",
        burlingame: "(650) 293-0880",
        campbell: "(408) 645-6700",
        castrovalley: "(925) 263-9209",
        concord: "(925) 412-4880",
        dublin: "(925) 587-6777",
        hillsborough: "(650) 293-0880",
        livermore: "(925) 718-6181",
        lafayette: "(925) 871-1333",
        orinda: "(925) 891-7800",
        pittsburg: "(925) 825-8555",
        pleasanthill: "(925) 891-7800",
        pleasanton: "(925) 587-6777",
        sanramon: "(925) 365-6030",
        walnutcreek: "(925) 464-2075",
        sunol: "(925) 718-6181",
        default: "(833) 289-3627" // Fallback phone number
    };

});

