import { setCookie, getCookie } from "./cookieUtils.js";
import { cityMap } from "./data.js";
import { setSessionData, getSessionData } from "./sessionUtils.js";

window.addEventListener("DOMContentLoaded", () => {
    const hostname = window.location.hostname.split('.')[0].toLowerCase();
    const domainName = hostname === "localhost" || hostname === "www" ? "localhost" : hostname;
    const cityName = cityMap[domainName] || "Norcal";

    const sessionData = {
        hostname,
        domainName,
        cityName,
        subdomain: domainName === "default" ? "norcal" : domainName
    };

    const cartData = getSessionData("cartItems") || [];
    const customerInfo = getSessionData("customerInfo") || {};

    // Save sessionData, customerInfo, and cartData
    setSessionData("sessionData", sessionData);  // Global session info
    setSessionData("cartData", cartData);  // Cart data
    setSessionData("customerInfo", customerInfo);  // Customer-specific info

    setCookie("sessionData", JSON.stringify(sessionData), 7);  // Save sessionData to cookies
    setCookie("cartData", JSON.stringify(cartData), 7);  // Save cartData to cookies
    setCookie("customerInfo", JSON.stringify(customerInfo), 7);  // Save customerInfo to cookies

    console.log("Synchronized session and cookies:");
    console.log("Session Data:", sessionData);
    console.log("Cart Data:", cartData);
    console.log("Customer Info:", customerInfo);

    // Populate form fields with existing session data if available
    Object.keys(customerInfo).forEach(key => {
        const inputField = document.getElementById(key);
        if (inputField) {
            inputField.value = customerInfo[key];
        }
    });

    console.log("Populated form with customer info from session storage:", customerInfo);

    // Function to update customerInfo in session and cookies
    function updateCustomerInfo() {
        const updatedCustomerInfo = {
            name: document.getElementById("name")?.value || "",
            phone: document.getElementById("phone")?.value || "",
            email: document.getElementById("email")?.value || "",
            address: document.getElementById("address")?.value || "",
            city: document.getElementById("city")?.value || "",
            specialInstructions: document.getElementById("specialInstructions")?.value || "",
            paymentMethod: document.getElementById("paymentMethod")?.value || ""
        };

        console.log("Updating customer info:", updatedCustomerInfo);  // Check what data is being saved
        setSessionData("customerInfo", updatedCustomerInfo);

        const cookieConsent = getCookie("cookieconsent_status");
        if (cookieConsent === "allow") {
            setCookie("customerInfo", JSON.stringify(updatedCustomerInfo), 7);
            console.log("Updated customerInfo cookie:", document.cookie);
        }
    }

    // Initialize input listeners for customer info
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea, #paymentMethod");
    customerInputs.forEach(input => {
        input.addEventListener("input", updateCustomerInfo);
        input.addEventListener("change", updateCustomerInfo);  // For select dropdowns like payment method
    });
function syncCookiesToSession() {
    try {
        const cartData = getCookie("cartData");
        const sessionData = getCookie("sessionData");

        if (cartData) {
            sessionStorage.setItem("cartData", decodeURIComponent(cartData));
            console.log("Synchronized cart data from cookies to session.");
        }
        if (sessionData) {
            sessionStorage.setItem("sessionData", decodeURIComponent(sessionData));
            console.log("Synchronized customer data from cookies to session.");
        }
    } catch (error) {
        console.error("Error syncing cookies to session:", error);
    }
}
    console.log("Customer info input listeners initialized.")

    if (!navigator.cookieEnabled) {
        console.warn("Cookies are disabled or blocked. Please enable cookies for full functionality.");
    }

    // Log cart contents
    console.log("Cart Item Count:", cartData.length);
    cartData.forEach((item, index) => {
        console.log(`Item ${index + 1}: Name: ${item.name || "N/A"}, Quantity: ${item.qty || "1"}, Price: ${item.price || "0.00"}`);
    });
});

