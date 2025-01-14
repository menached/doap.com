// consentHandler.js
import { setCookie, getCookie, deleteCookie } from './cookieManager.js';
import { enableAnalyticsAndAds } from './analytics.js';

export function initCookieConsent() {
    window.addEventListener("load", () => {
        if (typeof window.cookieconsent === "undefined") {
            console.error("CookieConsent library not loaded.");
            return;
        }

        window.cookieconsent.initialise({
            palette: {
                popup: { background: "#000" },
                button: { background: "#f1d600" }
            },
            type: "opt-in",
            content: {
                message: "We use cookies to enhance your experience.",
                dismiss: "Got it!",
                allow: "Allow Cookies",
                deny: "Decline",
                link: "Learn more",
                href: "/privacy-policy"
            },
            onInitialise: (status) => {
                console.log(`Cookie consent ${status.toUpperCase()} on page load (onInitialise).`);
                initializeCartData();
                initializeCustomerData(); // Ensure customerData is synced
            },
            onStatusChange: (status) => {
                console.log(`Cookies ${status.toUpperCase()} by user (onStatusChange).`);
                initializeCartData();
                initializeCustomerData(); // Re-initialize customerData sync if needed
            }
        });
    });
}

// Function to initialize cartData
function initializeCartData() {
    let cartData = sessionStorage.getItem("cartData") ? JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData"))) : null;

    if (!cartData || !Array.isArray(cartData)) {
        console.warn("No cartData found. Initializing empty cart.");
        cartData = []; // Initialize as empty array if missing or invalid
        sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    } else {
        console.log("Existing cartData found in sessionStorage:", cartData);
    }

    // Sync cartData to cookies if allowed
    if (getCookie("cookieconsent_status") === "allow") {
        setCookie("cartData", encodeURIComponent(JSON.stringify(cartData)), 7); // 7-day expiry
        console.log("cartData synchronized to cookie:", cartData);
    }
}

// Function to initialize customerData
function initializeCustomerData() {
    let customerData = null;

    // Check sessionStorage first
    customerData = sessionStorage.getItem("customerData")
        ? JSON.parse(decodeURIComponent(sessionStorage.getItem("customerData")))
        : null;

    if (customerData && typeof customerData === "object" && !Array.isArray(customerData)) {
        console.log("Existing customerData found in sessionStorage:", customerData);
    } else {
        // If sessionStorage is empty, check cookies
        const customerDataCookie = getCookie("customerData");
        if (customerDataCookie) {
            customerData = JSON.parse(decodeURIComponent(customerDataCookie));
            console.log("Loaded customerData from cookies into sessionStorage:", customerData);
            sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(customerData)));
        } else {
            // If neither sessionStorage nor cookie contains data, initialize default values
            console.warn("No customerData found. Initializing default customerData.");
            customerData = {
                name: "",
                phone: "",
                email: "",
                address: "",
                city: "",
                specialInstructions: ""
            };
            sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(customerData)));
        }
    }

    // Sync to cookies if consent is "allow"
    if (getCookie("cookieconsent_status") === "allow") {
        setCookie("customerData", encodeURIComponent(JSON.stringify(customerData)), 7);
        console.log("customerData synchronized to cookie:", customerData);
    }
}

