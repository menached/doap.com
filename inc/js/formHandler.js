import { setCookie, getCookie } from './cookieManager.js';
import { subdomainData } from './data.js';
import { syncCookiesToSession } from './consentHandler.js';
import { getCartData, saveCartData } from './productSelectionHandler.js';
import { showNotification } from './main.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Synchronizing cookies to sessionStorage...");
    syncCookiesToSession(); // Ensure cookies populate sessionStorage

    console.log("Initializing customerData...");
    initializeCustomerData(); // Initialize only if no sessionStorage data exists

    console.log("Initializing siteData...");
    initializeSiteData();

    // Add event listeners for customer form fields to update session storage
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    const paymentMethodField = document.getElementById("paymentMethod");

    customerInputs.forEach(input => {
        input.addEventListener("input", updateCustomerDataInSession);
    });

    paymentMethodField.addEventListener("change", updateCustomerDataInSession);
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", handleCheckout);
    }

    validateFields(); // Validate fields on page load
});


document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkoutButton");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", handleCheckout);
        console.log("handleCheckout attached to checkoutButton");
    } else {
        console.error("Checkout button not found in DOM.");
    }

    validateFields(); // Run initial validation on page load
});


// Initialize customerData in sessionStorage
function initializeCustomerData() {
    // Check if customerData exists in localStorage
    if (!localStorage.getItem("customerData")) {
        const customerCookie = getCookie("customerData"); // Fallback to cookies
        if (customerCookie) {
            try {
                const parsedCustomerData = JSON.parse(decodeURIComponent(customerCookie));
                localStorage.setItem("customerData", JSON.stringify(parsedCustomerData)); // Save to localStorage
                console.log("Loaded customerData from cookies into localStorage:", parsedCustomerData);
                return; // Prevent further initialization
            } catch (error) {
                console.error("Failed to parse customerData from cookies:", error);
            }
        }

        // Set default data if no cookies or localStorage data exists
        const defaultCustomerData = {
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            specialInstructions: "",
            paymentMethod: "" // Initialize payment method as empty
        };
        localStorage.setItem("customerData", JSON.stringify(defaultCustomerData));
        console.warn("Default customerData set in localStorage.");
    } else {
        const existingCustomerData = JSON.parse(localStorage.getItem("customerData"));
        console.log("Existing customerData already in localStorage:", existingCustomerData);
    }
}

// Initialize siteData in sessionStorage
// Initialize siteData in sessionStorage
function initializeSiteData() {
    const hostname = window.location.hostname.split('.')[0].toLowerCase();

    // Check if siteData already exists in sessionStorage
    if (!sessionStorage.getItem("siteData")) {
        const siteData = subdomainData.find(entry => entry.subdomain === hostname);

        if (siteData) {
            // Store the siteData in sessionStorage
            sessionStorage.setItem("siteData", encodeURIComponent(JSON.stringify(siteData)));
            console.log("Site data initialized:", siteData);
        } else {
            // Default to an unknown site configuration
            console.warn(`Subdomain "${hostname}" not found in subdomainData. Using default siteData.`);
            const defaultSiteData = {
                subdomain: "unknown",
                city: "Unknown",
                phone: "N/A",
                minimumOrder: 0,
            };
            sessionStorage.setItem("siteData", encodeURIComponent(JSON.stringify(defaultSiteData)));
        }
    } else {
        // Log existing siteData from sessionStorage
        try {
            const existingSiteData = JSON.parse(decodeURIComponent(sessionStorage.getItem("siteData")));
            console.log("Existing siteData loaded from sessionStorage:", existingSiteData);
        } catch (error) {
            console.error("Failed to parse existing siteData from sessionStorage:", error);
        }
    }
}

function displayMinimumOrder() {
    const siteDataString = sessionStorage.getItem("siteData");

    if (siteDataString) {
        try {
            const siteData = JSON.parse(decodeURIComponent(siteDataString));
            const minimumOrderElement = document.getElementById("minimumOrder");
            if (minimumOrderElement) {
                minimumOrderElement.textContent = `$${siteData.minimumOrder.toFixed(2)}`;
                console.log("Minimum Order displayed:", siteData.minimumOrder);
            }
        } catch (error) {
            console.error("Error parsing siteData for display:", error);
        }
    } else {
        console.warn("Site data not found in sessionStorage.");
    }
}

// Call this function after initializing siteData
document.addEventListener("DOMContentLoaded", () => {
    initializeSiteData();
    displayMinimumOrder();
});


// Update customerData in sessionStorage and cookies
function updateCustomerDataInStorage() {
    const customerData = {
        name: document.getElementById("name")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        email: document.getElementById("email")?.value || "",
        address: document.getElementById("address")?.value || "",
        city: document.getElementById("city")?.value || "",
        specialInstructions: document.getElementById("specialInstructions")?.value || "",
        paymentMethod: document.getElementById("paymentMethod")?.value || ""
    };

    localStorage.setItem("customerData", encodeURIComponent(JSON.stringify(customerData)));
    console.log("Customer data saved to localStorage:", customerData);
}

//function saveCartData(cartData) {
    //localStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    //console.log("Cart data saved to localStorage:", cartData);
//}


// Validate all fields, including payment method
function validateFields() {
    let customerData = {};
    let cartData = [];

    // Retrieve and decode customerData
    try {
        const customerDataString = localStorage.getItem("customerData");
        if (customerDataString) {
            customerData = JSON.parse(decodeURIComponent(customerDataString));
        }
    } catch (error) {
        console.error("Failed to parse customerData:", error);
    }

    // Retrieve and decode cartData
    try {
        const cartDataString = localStorage.getItem("cartData");
        if (cartDataString) {
            cartData = JSON.parse(decodeURIComponent(cartDataString));
        }
    } catch (error) {
        console.error("Failed to parse cartData:", error);
    }

    // Check if all required customer fields are filled
    const allRequiredFilled = customerData.name && customerData.phone && customerData.email &&
        customerData.address && customerData.city && customerData.paymentMethod;

    // Check if the cart has items
    const cartHasItems = cartData.length > 0;

    const cartContainer = document.querySelector("#cartContainer");
    const checkoutButton = document.getElementById("checkoutButton");

    if (allRequiredFilled && cartHasItems) {
        cartContainer.style.border = "2px solid #28a745"; // Green border if valid
        checkoutButton.disabled = false; // Enable checkout button
    } else {
        cartContainer.style.border = "1px dashed #ff0000"; // Red border if invalid
        checkoutButton.disabled = true; // Disable checkout button
    }

    console.log("Validation status:", {
        allRequiredFilled,
        cartHasItems,
        customerData,
        cartData,
    });
}

// Handle the checkout process
async function handleCheckout(event) {
    event.preventDefault(); // Prevent default form submission

    let customerData = {};
    let cartData = [];

    try {
        const customerDataString = localStorage.getItem("customerData");
        if (customerDataString) {
            customerData = JSON.parse(decodeURIComponent(customerDataString));
        }
    } catch (error) {
        console.error("Failed to retrieve customerData:", error);
        showNotification("Error retrieving customer data. Please refresh and try again.");
        return;
    }

    try {
        const cartDataString = localStorage.getItem("cartData");
        if (cartDataString) {
            cartData = JSON.parse(decodeURIComponent(cartDataString));
        }
    } catch (error) {
        console.error("Failed to retrieve cartData:", error);
        showNotification("Error retrieving cart data. Please refresh and try again.");
        return;
    }

    const allRequiredFieldsFilled = customerData.name && customerData.phone && customerData.email &&
        customerData.address && customerData.city && customerData.paymentMethod;

    const cartHasItems = cartData.length > 0;

    if (!allRequiredFieldsFilled || !cartHasItems) {
        showNotification("Please fill out all required fields and ensure the cart has items.");
        console.log("Validation failed:", {
            allRequiredFieldsFilled,
            cartHasItems,
            customerData,
            cartData,
        });
        return;
    }

    const total = document.getElementById("total").textContent.replace("$", "");
    const orderPayload = {
        ...customerData,
        items: cartData,
        total,
    };

    console.log("Submitting order payload:", orderPayload);

    try {
        const response = await fetch("https://eft3wrtpad.execute-api.us-west-2.amazonaws.com/prod/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
        });

        const result = await response.json();
        if (response.ok) {
            showNotification("Order submitted successfully!");
            console.log("API Response:", result);
        } else {
            console.error("API Error:", result);
            showNotification("Failed to submit order. Please try again.");
        }
    } catch (error) {
        console.error("Network error:", error);
        showNotification("An error occurred while submitting the order.");
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const paymentMethodSelect = document.getElementById("paymentMethod");
    const sections = {
        "credit-card": document.getElementById("creditCardForm"),
        crypto: document.getElementById("cryptoWallets"),
        generalHelp: document.getElementById("generalHelp"), // Example for a default help section
    };

    // Hide all sections initially
    function hideAllSections() {
        Object.values(sections).forEach((section) => {
            if (section) {
                section.style.display = "none";
            }
        });
    }

    // Show the relevant section
    function showSection(sectionId) {
        if (sections[sectionId]) {
            sections[sectionId].style.display = "block";
        }
    }

    // Handle dropdown change event
    paymentMethodSelect.addEventListener("change", (event) => {
        const selectedValue = event.target.value;

        hideAllSections(); // Hide all sections
        if (selectedValue) {
            showSection(selectedValue); // Show only the relevant section
        }
    });

    // Initialize by hiding all sections
    hideAllSections();
});




document.addEventListener("DOMContentLoaded", () => {
    const paymentMethodSelect = document.getElementById("paymentMethod");
    const creditCardForm = document.getElementById("creditCardForm");
    const cryptoWallets = document.getElementById("cryptoWallets");
    const generalHelp = document.getElementById("generalHelp");
    const CODHelp = document.getElementById("CODHelp");

    // Function to reset and hide all sections
    function hideAllSections() {
        creditCardForm.style.display = "none";
        cryptoWallets.style.display = "none";
        generalHelp.style.display = "none";
        CODHelp.style.display = "none";
    }

    // Function to show the appropriate section based on the selected payment method
    function updateAccordionVisibility() {
        hideAllSections(); // Ensure all sections are hidden first
        const selectedMethod = paymentMethodSelect.value;

        if (selectedMethod === "credit-card") {
            creditCardForm.style.display = "block";
        } else if (selectedMethod === "crypto") {
            cryptoWallets.style.display = "block";
        } else if (selectedMethod === "cash") {
            CODHelp.style.display = "block"; // Show Cash On Delivery panel
        } else if (
            selectedMethod === "zelle" ||
            selectedMethod === "cashapp" ||
            selectedMethod === "venmo" ||
            selectedMethod === "paypal"
        ) {
            generalHelp.style.display = "block";
        } else {
            console.warn("No valid payment method selected.");
        }
    }

    // Load the saved method from sessionStorage before initializing visibility
    const savedMethod = sessionStorage.getItem("selectedPaymentMethod");
    if (savedMethod) {
        paymentMethodSelect.value = savedMethod; // Apply saved selection
    }

    // Initialize visibility on page load
    updateAccordionVisibility();

    // Update visibility when the payment method is changed
    paymentMethodSelect.addEventListener("change", () => {
        sessionStorage.setItem("selectedPaymentMethod", paymentMethodSelect.value);
        updateAccordionVisibility();
    });
});





export function updateCustomerDataInSession() {
    const customerData = {
        name: document.getElementById("name")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        email: document.getElementById("email")?.value || "",
        address: document.getElementById("address")?.value || "",
        city: document.getElementById("city")?.value || "",
        specialInstructions: document.getElementById("specialInstructions")?.value || "",
        paymentMethod: document.getElementById("paymentMethod")?.value || ""
    };

    // Save to localStorage for persistence
    localStorage.setItem("customerData", JSON.stringify(customerData));
    console.log("Updated customerData in localStorage:", customerData);
}

