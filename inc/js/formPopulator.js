// formPopulator.js
import { getCookie } from './cookieManager.js';
import { getSessionData } from './sessionManager.js';

export function populateFormFromStorage() {
    const useCookies = getCookie("cookieconsent_status") === "allow";
    const customerData = useCookies ? JSON.parse(decodeURIComponent(getCookie("customerData") || "{}")) : getSessionData("customerData") || {};
    const cartData = useCookies ? JSON.parse(decodeURIComponent(getCookie("cartData") || "[]")) : getSessionData("cartData") || [];
    const siteData = useCookies ? JSON.parse(decodeURIComponent(getCookie("siteData") || "{}")) : getSessionData("siteData") || {};

    Object.keys(customerData).forEach((key) => {
        const inputField = document.getElementById(key);
        if (inputField) inputField.value = customerData[key];
    });

    console.group("Populated Data:");
    console.log("Customer Data:", customerData);
    console.log("Cart Data:", cartData);
    console.log("Site Data:", siteData);
    console.groupEnd();
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

