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

    // Perform initial validation on page load
    validateFields();

    // Attach event listener to checkout button
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", handleCheckout);
    }
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
function initializeSiteData() {
    if (!sessionStorage.getItem("siteData")) {
        const hostname = window.location.hostname.split('.')[0].toLowerCase();
        const siteData = subdomainData.find(entry => entry.subdomain === hostname);

        if (siteData) {
            sessionStorage.setItem("siteData", encodeURIComponent(JSON.stringify(siteData)));
            console.log("siteData set in sessionStorage:", siteData);
        } else {
            console.warn(`Subdomain "${hostname}" not found in subdomainData. Setting default siteData.`);
            sessionStorage.setItem("siteData", encodeURIComponent(JSON.stringify({
                subdomain: "unknown",
                city: "Unknown",
                phone: "N/A",
                minimumOrder: 0
            })));
        }
    } else {
        const existingSiteData = JSON.parse(decodeURIComponent(sessionStorage.getItem("siteData")));
        console.log("Existing siteData already in sessionStorage:", existingSiteData);
    }
}

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

    // Save to localStorage for persistence across tabs and sessions
    localStorage.setItem("customerData", JSON.stringify(customerData));
    console.log("Updated customerData in localStorage:", customerData);

    // Optionally save to cookies if consent is given
    if (getCookie("cookieconsent_status") === "allow") {
        setCookie("customerData", customerData, 7);
        console.log("Updated customerData in cookies:", customerData);
    }
}



//function updateCustomerDataInStorage() {
    //const customerData = {
        //name: document.getElementById("name")?.value || "",
        //phone: document.getElementById("phone")?.value || "",
        //email: document.getElementById("email")?.value || "",
        //address: document.getElementById("address")?.value || "",
        //city: document.getElementById("city")?.value || "",
        //specialInstructions: document.getElementById("specialInstructions")?.value || "",
        //paymentMethod: document.getElementById("paymentMethod")?.value || ""
    //};

    //// Save to localStorage for persistence across tabs and sessions
    //localStorage.setItem("customerData", JSON.stringify(customerData));
    //console.log("Updated customerData in localStorage:", customerData);

    //// Optionally save to cookies if required
    //if (getCookie("cookieconsent_status") === "allow") {
        //setCookie("customerData", customerData, 7);
        //console.log("Updated customerData in cookies:", customerData);
    //}
//}

// Validate all fields, including payment method
function validateFields() {
    const customerData = JSON.parse(decodeURIComponent(sessionStorage.getItem("customerData") || "{}"));
    const allRequiredFilled = customerData.name && customerData.phone && customerData.email &&
        customerData.address && customerData.city && customerData.paymentMethod;

    const cartContainer = document.querySelector("#cartContainer");
    const checkoutButton = document.getElementById("checkoutButton");

    if (allRequiredFilled) {
        cartContainer.style.border = "2px solid #28a745"; // Green border if valid
        checkoutButton.disabled = false; // Enable checkout button
    } else {
        cartContainer.style.border = "1px dashed #ff0000"; // Red border if invalid
        checkoutButton.disabled = true; // Disable checkout button
    }
}

// Handle the checkout process
async function handleCheckout(event) {
    event.preventDefault();

    // Retrieve customer data from localStorage
    const customerData = JSON.parse(localStorage.getItem("customerData") || "{}");
    console.log("Customer Data from localStorage:", customerData);

    // Validate required fields
    const allRequiredFieldsFilled = customerData.name && customerData.phone && customerData.email &&
        customerData.address && customerData.city;

    const cartData = getCartData();
    const cartHasItems = cartData && cartData.length > 0;

    console.log("All Required Fields Filled:", allRequiredFieldsFilled);
    console.log("Cart Has Items:", cartHasItems);

    if (!allRequiredFieldsFilled || !cartHasItems) {
        showNotification("Please fill out all required fields and ensure the cart has items.");
        return;
    }

    // Prepare order payload
    const total = document.getElementById("total").textContent.replace("$", "");
    const orderPayload = {
        ...customerData,
        items: cartData,
        total,
    };

    console.log("Submitting Order Payload:", orderPayload);

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
            console.error("Error response from API:", result);
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

