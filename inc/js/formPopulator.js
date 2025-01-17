// formPopulator.js

import { getCookie } from './cookieManager.js';
import { getSessionData } from './sessionManager.js';
import { syncCookiesToSession } from './consentHandler.js';

let formPopulated = false;  // Prevents double population

export function populateFormFromStorage() {
    if (formPopulated) {
        console.warn("Form is already populated. Skipping...");
        return;
    }

    formPopulated = true;

    let customerData = {};
    try {
        const customerDataString = sessionStorage.getItem("customerData");
        if (customerDataString) {
            customerData = JSON.parse(decodeURIComponent(customerDataString));
            console.log("Loaded customerData from sessionStorage:", customerData);
        } else {
            console.warn("customerData not found in sessionStorage. Checking cookies...");
            const customerCookie = getCookie("customerData");
            if (customerCookie) {
                customerData = JSON.parse(decodeURIComponent(customerCookie));
                console.log("Loaded customerData from cookies:", customerData);
                // Save to sessionStorage for future use
                sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(customerData)));
            }
        }
    } catch (error) {
        console.error("Failed to parse customerData:", error);
        customerData = {}; // Fallback to empty object
    }

    // Populate the form fields with the data
    Object.keys(customerData).forEach((key) => {
        const inputField = document.getElementById(key);
        if (inputField) {
            inputField.value = customerData[key];
            console.log(`Populated ${key} with value: ${customerData[key]}`);
        } else {
            console.warn(`Input field for key "${key}" not found.`);
        }
    });

    console.log("Form population completed.");
}


// Initialize tabs for categories
function initializeTabs() {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(tc => tc.classList.remove("active"));

            // Add active class to the selected tab and corresponding content
            tab.classList.add("active");
            tabContents[index].classList.add("active");
        });
    });
}

// Export for use in main.js
export { initializeTabs };

// Add DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
    console.log("Synchronizing cookies to sessionStorage...");
    syncCookiesToSession();

    console.log("populateFormFromStorage() running...");
    populateFormFromStorage();

    console.log("initializeTabs() running...");
    initializeTabs();
});

