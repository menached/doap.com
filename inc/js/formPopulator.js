// formPopulator.js
import { getCookie } from './cookieManager.js';
import { getSessionData } from './sessionManager.js';

let formPopulated = false;  // Prevents double population

export function populateFormFromStorage() {
    if (formPopulated) {
        console.warn("Form is already populated. Skipping...");
        return;
    }
    formPopulated = true;

    const customerDataString = sessionStorage.getItem("customerData");
    let customerData = {};

    try {
        customerData = customerDataString ? JSON.parse(decodeURIComponent(customerDataString)) : {};
    } catch (error) {
        console.error("Failed to parse customerData:", error, customerDataString);
        customerData = {};  // Fallback to empty object in case of error
    }

    Object.keys(customerData).forEach((key) => {
        const inputField = document.getElementById(key);
        if (inputField) inputField.value = customerData[key];
        console.log(`Populated ${key} with value: ${customerData[key]}`);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(tc => tc.classList.remove("active"));

            // Add active class to clicked tab and its content
            tab.classList.add("active");
            const targetContent = document.getElementById(tab.dataset.tab);
            if (targetContent) targetContent.classList.add("active");
        });
    });
});


// categoryTabs.js
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



document.addEventListener("DOMContentLoaded", () => {
    console.log("populateFormFromStorage() running...");
    populateFormFromStorage();  // Ensure this runs
});

