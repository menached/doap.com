// main.js
import { initCookieConsent } from './consentHandler.js';
import { populateFormFromStorage } from './formPopulator.js';
import { subdomainData } from './subdomainData.js';

document.addEventListener("DOMContentLoaded", () => {
    initCookieConsent();
    populateFormFromStorage();

    const cartContainer = document.getElementById("cartContainer");

    function getMinimumOrder() {
        const subdomain = window.location.hostname.split('.')[0].toLowerCase();
        const areaData = subdomainData.find(entry => entry.subdomain === subdomain);
        return areaData?.minimumOrder || 0;  // Default to 0 if not found
    }

    function getCartTotal() {
        const totalElement = document.getElementById("total");
        return parseFloat(totalElement.textContent.replace("$", "")) || 0;
    }

    function isCustomerInfoComplete() {
        // Gather all fields
        const customerInfo = {
            name: document.getElementById("name")?.value || "",
            phone: document.getElementById("phone")?.value || "",
            email: document.getElementById("email")?.value || "",
            address: document.getElementById("address")?.value || "",
            city: document.getElementById("city")?.value || "",
            specialInstructions: document.getElementById("specialInstructions")?.value || "",
        };

        // Define which fields are “required”
        const requiredFields = ["name", "phone", "email", "address", "city"];

        // Count filled required fields
        const filledRequiredCount = requiredFields
            .filter(field => customerInfo[field].trim() !== "").length;

        const totalRequired = requiredFields.length;

        return {
            allFilled: filledRequiredCount === totalRequired,
            partiallyFilled: filledRequiredCount > 0 && filledRequiredCount < totalRequired,
        };
    }

    function updateCartBorderColor() {
        const cartTotal = getCartTotal();
        const minimumOrder = getMinimumOrder();
        const meetsMinimumOrder = cartTotal >= minimumOrder;
        const { allFilled, partiallyFilled } = isCustomerInfoComplete();

        if (!allFilled && cartTotal === 0) {
            cartContainer.style.borderColor = "#FF0000";  // Red: No fields and no cart data
        } else if (!allFilled && partiallyFilled) {
            cartContainer.style.borderColor = "#FFCC00";  // Yellow: Some fields filled but not all
        } else if (allFilled && meetsMinimumOrder) {
            cartContainer.style.borderColor = "#00FF00";  // Green: All fields filled and meets minimum
        } else {
            cartContainer.style.borderColor = "#FF0000";  // Red: If the form is blank and cart total is still good
        }

        console.log(`Customer Info Complete: ${allFilled}, Partially Filled: ${partiallyFilled}, Cart Total: $${cartTotal}, Minimum: $${minimumOrder}`);
    }

    // Listen for changes in customer info inputs
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    customerInputs.forEach(input => {
        input.addEventListener("input", updateCartBorderColor);
    });

    // Listen for cart total changes
    const totalElement = document.getElementById("total");
    const observer = new MutationObserver(() => {
        updateCartBorderColor();  // Trigger when the cart total changes
    });

    if (totalElement) {
        observer.observe(totalElement, { childList: true, subtree: true });
    }

    // Initial check on page load
    updateCartBorderColor();

    console.group("Debug Info");
    console.log("Minimum Order:", getMinimumOrder());
    console.log("Initial Cart Total:", getCartTotal());
    console.groupEnd();
});


export function getCityDataFromHostname() {
    const hostname = window.location.hostname.split('.')[0].toLowerCase();
    return subdomainData.find(entry => entry.subdomain === hostname) || {};
}

