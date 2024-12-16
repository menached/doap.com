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
        } else if (
            ["cash", "zelle", "venmo", "paypal"].includes(selectedMethod)
        ) {
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

    // Apply tab listeners
    applyTabListeners();

    console.log("Tab and cart logic applied!");
});

