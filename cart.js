document.addEventListener("DOMContentLoaded", () => {
    // Subdomain and city name logic
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase();
    const defaultDescription = `${cityName} DOAP Delivers Organic Awesome Pot to ${cityName} and surrounding cities 9-9 daily.`;

    // Update city name in header
    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.innerHTML = `<i class="fas fa-shopping-cart"></i> ${cityName} Doap `;
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

    // Update phone number dynamically
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

    const defaultPhone = "8332893627";
    const phone = cityPhoneMap[subdomain] || defaultPhone;

    const phoneDiv = document.createElement('div');
    phoneDiv.style.textAlign = 'center';
    phoneDiv.style.marginTop = '10px';
    phoneDiv.style.fontSize = '18px';
    phoneDiv.style.fontWeight = 'bold';
    phoneDiv.innerHTML = `<a href="tel:${phone}" style="color: inherit; text-decoration: none;">Call us at (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}</a>`;

    const menuTitle = document.querySelector('.menu-title-text');
    if (menuTitle) {
        menuTitle.insertAdjacentElement('afterend', phoneDiv);
    }

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
    cartForm.addEventListener("change", updateCart);
    cartForm.addEventListener("input", (event) => {
        if (event.target.classList.contains("quantity")) {
            updateCart();
        }
    });

    // Apply tab listeners
    applyTabListeners();

    console.log("Tab and cart logic applied!");
});

