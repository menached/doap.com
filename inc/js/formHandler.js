import { setCookie, getCookie } from './cookieManager.js';
import { subdomainData } from './data.js';
import { syncCookiesToSession } from './consentHandler.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Synchronizing cookies to sessionStorage...");
    syncCookiesToSession(); // Ensure cookies populate sessionStorage

    console.log("Initializing customerData...");
    initializeCustomerData(); // Initialize only if no sessionStorage data exists

    console.log("Initializing siteData...");
    initializeSiteData();

    // Add event listeners for customer form fields to update session storage
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    customerInputs.forEach(input => {
        input.addEventListener("input", updateCustomerDataInSession);
    });
});

// Initialize customerData in sessionStorage
function initializeCustomerData() {
    if (!sessionStorage.getItem("customerData")) {
        const customerCookie = getCookie("customerData");
        if (customerCookie) {
            try {
                const parsedCustomerData = JSON.parse(decodeURIComponent(customerCookie));
                sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(parsedCustomerData)));
                console.log("Loaded customerData from cookies into sessionStorage:", parsedCustomerData);
                return; // Prevent further initialization
            } catch (error) {
                console.error("Failed to parse customerData from cookies:", error);
            }
        }

        // Set default data if no cookies or session data exists
        const defaultCustomerData = {
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            specialInstructions: ""
        };
        sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(defaultCustomerData)));
        console.warn("Default customerData set in sessionStorage.");
    } else {
        const existingCustomerData = JSON.parse(decodeURIComponent(sessionStorage.getItem("customerData")));
        console.log("Existing customerData already in sessionStorage:", existingCustomerData);
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
function updateCustomerDataInSession() {
    const customerData = {
        name: document.getElementById("name")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        email: document.getElementById("email")?.value || "",
        address: document.getElementById("address")?.value || "",
        city: document.getElementById("city")?.value || "",
        specialInstructions: document.getElementById("specialInstructions")?.value || ""
    };

    sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(customerData)));
    console.log("Updated customerData in sessionStorage:", JSON.parse(decodeURIComponent(sessionStorage.getItem("customerData"))));

    if (getCookie("cookieconsent_status") === "allow") {
        console.log("Cookies before sync:", document.cookie);
        setCookie("customerData", customerData, 7);
        console.log("Updated customerData in cookies:", customerData);
    }
    console.log("SessionStorage after cookie sync:", JSON.parse(decodeURIComponent(sessionStorage.getItem("customerData"))));
}

// Update customer info dynamically
function updateCustomerInfo() {
    const customerData = {
        name: document.getElementById("name")?.value.trim() || "",
        phone: document.getElementById("phone")?.value.trim() || "",
        email: document.getElementById("email")?.value.trim() || "",
        address: document.getElementById("address")?.value.trim() || "",
        city: document.getElementById("city")?.value.trim() || "",
        specialInstructions: document.getElementById("specialInstructions")?.value.trim() || ""
    };

    // Check if all required fields (except specialInstructions) are filled
    const allRequiredFilled = customerData.name && customerData.phone && customerData.email && customerData.address && customerData.city;

    const cartContainer = document.querySelector("#cartContainer");
    if (allRequiredFilled) {
        cartContainer.style.border = "2px solid #28a745";  // Green border if valid
    } else {
        cartContainer.style.border = "2px solid #ff0000";  // Red border if invalid
    }

    // Update session and cookies
    sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(customerData)));

    if (getCookie("cookieconsent_status") === "allow") {
        console.log("Cookies before sync:", document.cookie);
        setCookie("customerData", customerData, 7);
        console.log("Updated customerData in cookies:", customerData);
    }
    console.log("SessionStorage after cookie sync:", JSON.parse(decodeURIComponent(sessionStorage.getItem("customerData"))));
}

