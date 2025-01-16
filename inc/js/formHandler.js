// formHandler.js
import { subdomainData } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
    // Set default customerData in sessionStorage
    if (!sessionStorage.getItem("customerData")) {
        sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify({
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            specialInstructions: ""
        })));
        console.warn("Default customerData set in sessionStorage.");
    } else {
        const existingCustomerData = JSON.parse(decodeURIComponent(sessionStorage.getItem("customerData")));
        console.log("Existing customerData already in sessionStorage:", existingCustomerData);
    }

    // Set siteData in sessionStorage based on subdomain
    const hostname = window.location.hostname.split('.')[0].toLowerCase();
    const siteData = subdomainData.find(entry => entry.subdomain === hostname);

    if (siteData) {
        sessionStorage.setItem("siteData", encodeURIComponent(JSON.stringify(siteData)));
        //console.log("siteData set in sessionStorage:", siteData);
    } else {
        console.warn(`Subdomain "${hostname}" not found in subdomainData. Setting default siteData.`);
        sessionStorage.setItem("siteData", encodeURIComponent(JSON.stringify({
            subdomain: "unknown",
            city: "Unknown",
            phone: "N/A",
            minimumOrder: 0
        })));
    }

    // Add event listeners for customer form fields to update session storage
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    customerInputs.forEach(input => {
        input.addEventListener("input", updateCustomerDataInSession);
    });

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
        console.log("Updated customerData in sessionStorage:", customerData);
    }
});




window.addEventListener("DOMContentLoaded", () => {
    // Existing code for updating city name, phone number, etc.
    
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea, #paymentMethod");
    customerInputs.forEach(input => {
        input.addEventListener("input", updateCustomerInfo);
        input.addEventListener("change", updateCustomerInfo);  // For select dropdowns
    });

    function updateCustomerInfo() {
        const customerData = {
            name: document.getElementById("name")?.value.trim() || "",
            phone: document.getElementById("phone")?.value.trim() || "",
            email: document.getElementById("email")?.value.trim() || "",
            address: document.getElementById("address")?.value.trim() || "",
            city: document.getElementById("city")?.value.trim() || "",
            specialInstructions: document.getElementById("specialInstructions")?.value.trim() || ""  // Optional
        };

        // Check if all required fields (except specialInstructions) are filled
        const allRequiredFilled = customerData.name && customerData.phone && customerData.email && customerData.address && customerData.city;

        const formContainer = document.querySelector(".customer-info");
        if (allRequiredFilled) {
            formContainer.style.border = "2px solid #28a745";  // Green border if valid
        } else {
            formContainer.style.border = "2px solid #ff0000";  // Red border if invalid
        }

        setSessionData("customerData", customerData);

        if (getCookie("cookieconsent_status") === "allow") {
            setCookie("customerData", JSON.stringify(customerData), 7);
        }
    }
});

