import { handlePaymentMethodChange, initializeFormListeners } from './formHandlers.js';
import { loadCartDataFromSession, initializeCartListeners, updateCartUI } from './cartHandlers.js';
import { getCookie } from './utils.js';
//import { saveSessionData } from './formUtils.js';  // Explicit import to ensure availability in formHandlers.js
import { saveSessionData } from './payments.js';  // Explicit import to ensure availability in formHandlers.js

window.addEventListener("DOMContentLoaded", () => {
    initializeFormListeners(saveSessionData);  // Pass saveSessionData explicitly to formHandlers.js
    initializeCartListeners();  // Initialize cart listeners

    const customerFormFields = ["name", "phone", "email", "address", "city", "specialInstructions", "paymentMethod"];

    // Attach saveSessionData to input events
    customerFormFields.forEach(fieldId => {
        const inputField = document.getElementById(fieldId);
        if (inputField) {
            inputField.addEventListener("input", () => {
                saveSessionData();
                console.log(`Session data saved for input field: ${fieldId}`);
            });
        }
    });

    // Attach saveSessionData to payment method changes
    const paymentMethodDropdown = document.getElementById("paymentMethod");
    if (paymentMethodDropdown) {
        paymentMethodDropdown.addEventListener("change", (event) => {
            handlePaymentMethodChange(event.target.value);
            saveSessionData();
            console.log("Session data saved after payment method change.");
        });
    }

    const consentStatus = getCookie("cookieconsent_status");
    if (consentStatus === "deny") {
        loadCartDataFromSession();
    }

    // Attach saveSessionData to cart-related events explicitly for persistence
    document.addEventListener("cartUpdated", () => {
        saveSessionData();
        console.log("Cart data saved after update event.");
    });

    // Attach saveSessionData to form-specific events
    document.addEventListener("formUpdated", () => {
        saveSessionData();
        console.log("Form data saved after form update event.");
    });
});

