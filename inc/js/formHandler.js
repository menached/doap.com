import { setCookie, getCookie } from './cookieManager.js';
import { subdomainData } from './data.js';
import { syncCookiesToSession } from './consentHandler.js';
import { getCartData, saveCartData } from './productSelectionHandler.js';
import { showNotification } from './main.js';
import { validateFields } from './main.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Synchronizing cookies to sessionStorage...");
    syncCookiesToSession(); // Ensure cookies populate sessionStorage

    console.log("Initializing customerData...");
    initializeCustomerData(); // Initialize only if no sessionStorage data exists

    console.log("Initializing siteData...");
    initializeSiteData();
    updateMinimumOrderMessage(); // Update the minimum order message


    // Add event listeners for customer form fields to update session storage
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    const paymentMethodField = document.getElementById("paymentMethod");

    customerInputs.forEach(input => {
        input.addEventListener("input", updateCustomerDataInSession);
    });

    if (paymentMethodField) {
        paymentMethodField.addEventListener("change", updateCustomerDataInSession);
    }
    
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", handleCheckout);
    }


        // Validate on customer input changes
    customerInputs.forEach((input) => {
        input.addEventListener("input", validateFields);
    });

    // Validate on payment method change
    if (paymentMethodField) {
        paymentMethodField.addEventListener("change", validateFields);
    }

    // Validate on cart total changes
    const totalElement = document.getElementById("total");
    const observer = new MutationObserver(() => {
        validateFields(); // Revalidate when cart total changes
    });

    if (totalElement) {
        observer.observe(totalElement, { childList: true, subtree: true });
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
function initializeSiteData() {
    const hostname = window.location.hostname.split('.')[0].toLowerCase();

    // First, check if siteData exists in sessionStorage
    let siteDataString = sessionStorage.getItem("siteData");

    if (!siteDataString) {
        // If not found, check in localStorage
        siteDataString = localStorage.getItem("siteData");

        if (!siteDataString) {
            // If not found in localStorage, look up from `subdomainData`
            const siteData = subdomainData.find(entry => entry.subdomain === hostname);

            if (siteData) {
                siteDataString = JSON.stringify(siteData);

                // Save to both sessionStorage and localStorage for future use
                sessionStorage.setItem("siteData", encodeURIComponent(siteDataString));
                localStorage.setItem("siteData", siteDataString);
                console.log("Initialized siteData from subdomainData:", siteData);
            } else {
                // Default siteData if subdomain is not found
                const defaultSiteData = {
                    subdomain: "unknown",
                    city: "Unknown",
                    phone: "N/A",
                    minimumOrder: 0,
                };
                siteDataString = JSON.stringify(defaultSiteData);

                sessionStorage.setItem("siteData", encodeURIComponent(siteDataString));
                localStorage.setItem("siteData", siteDataString);
                console.warn(`Subdomain "${hostname}" not found. Using default siteData.`);
            }
        } else {
            // If found in localStorage, move it to sessionStorage
            sessionStorage.setItem("siteData", encodeURIComponent(siteDataString));
            console.log("Loaded siteData from localStorage into sessionStorage.");
        }
    } else {
        console.log("Existing siteData already in sessionStorage:", JSON.parse(decodeURIComponent(siteDataString)));
    }
}


function displayMinimumOrder() {
    const siteDataString = sessionStorage.getItem("siteData") || localStorage.getItem("siteData");

    if (siteDataString) {
        try {
            const siteData = JSON.parse(decodeURIComponent(siteDataString));
            const minimumOrderElement = document.getElementById("minimumOrder");
            if (minimumOrderElement) {
                minimumOrderElement.textContent = `Minimum order is $${siteData.minimumOrder.toFixed(2)}`;
                console.log("Displayed Minimum Order:", siteData.minimumOrder);
            } else {
                console.warn("#minimumOrder element not found.");
            }
        } catch (error) {
            console.error("Failed to parse siteData for minimum order display:", error);
        }
    } else {
        console.warn("siteData not found in storage.");
    }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeSiteData(); // Ensure siteData is initialized
    displayMinimumOrder();
    updateMinimumOrderMessage(); // Update the minimum order message
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

// Handle the checkout process
async function handleCheckout(event) {
    event.preventDefault(); // Prevent default form submission

    let customerData = {};
    let cartData = [];

    // 1. Load customerData from localStorage
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

    // 2. Load cartData from localStorage
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

    // 3. Validate required fields
    const allRequiredFieldsFilled = Boolean(
        customerData.name &&
        customerData.phone &&
        customerData.email &&
        customerData.address &&
        customerData.city &&
        customerData.paymentMethod
    );

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

    // 4. Build the base payload
    const total = document.getElementById("total").textContent.replace("$", "");
    const orderPayload = {
        ...customerData,  // includes name, phone, email, address, city, paymentMethod, etc.
        items: cartData,
        total,
    };

    // 5. If payment method is credit-card, attach the CC fields
    if (customerData.paymentMethod === "credit-card") {
        const cardNumber = document.getElementById("cardNumber")?.value || "";
        const expiryDate = document.getElementById("expiryDate")?.value || "";
        const cvv = document.getElementById("cvv")?.value || "";
        const cardZip = document.getElementById("cardZip")?.value || "";
        const nameOnCard = document.getElementById("nameOnCard")?.value || "";

        orderPayload.creditCard = {
            cardNumber,
            expiryDate,
            cvv,
            cardZip,
            nameOnCard,
        };
    }

    // 6. Log and submit the final payload
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

            const cardNumberInput = document.getElementById("cardNumber");
            const cvvInput = document.getElementById("cvv");

            if (cardNumberInput) cardNumberInput.value = "";
            if (cvvInput)        cvvInput.value = "";

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




export function updateMinimumOrderMessage() {
    const minOrderMessageElement = document.getElementById("minOrderMessage");
    const siteDataString = sessionStorage.getItem("siteData") || localStorage.getItem("siteData");
    const totalElement = document.getElementById("total");

    if (siteDataString && totalElement) {
        try {
            const siteData = JSON.parse(decodeURIComponent(siteDataString));
            const minimumOrder = siteData.minimumOrder || 0; // Default to $0 if not found
            const cartTotal = parseFloat(totalElement.textContent.replace("$", "")) || 0;

            if (minOrderMessageElement) {
                if (cartTotal >= minimumOrder) {
                    // Minimum order met
                    minOrderMessageElement.textContent = `Minimum order of $${minimumOrder.toFixed(2)} met.`;
                    minOrderMessageElement.style.color = "green";
                } else {
                    // Minimum order not met
                    const amountNeeded = (minimumOrder - cartTotal).toFixed(2);
                    minOrderMessageElement.textContent = `Minimum order is $${minimumOrder.toFixed(2)}. Add $${amountNeeded} more to meet it.`;
                    minOrderMessageElement.style.color = "red";
                }

                console.log("Updated minimum order message:", { minimumOrder, cartTotal });
            } else {
                console.warn("Element with ID #minOrderMessage not found.");
            }
        } catch (error) {
            console.error("Failed to parse siteData for minimum order message:", error);
        }
    } else {
        console.warn("siteData or totalElement not found in storage. Default message will remain.");
    }
}





function updateCityPlaceholder() {
    const cityInput = document.getElementById("city");
    const siteDataString = sessionStorage.getItem("siteData") || localStorage.getItem("siteData");

    if (siteDataString && cityInput) {
        try {
            const siteData = JSON.parse(decodeURIComponent(siteDataString));
            if (siteData.city) {
                cityInput.setAttribute("placeholder", siteData.city); // Set placeholder to the subdomain city name
                console.log("Updated city input placeholder to:", siteData.city);

                // Trigger validation
                validateFields();
            } else {
                console.warn("City value not found in siteData. Placeholder remains as 'City'.");
            }
        } catch (error) {
            console.error("Failed to parse siteData for city placeholder:", error);
        }
    } else {
        console.warn("siteData not found in storage or city input element is missing.");
    }
}

