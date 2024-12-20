import { subdomainData } from './subdomainData.js';

console.log("doap.js started loading");

document.addEventListener("DOMContentLoaded", () => {
    // Extract hostname and determine subdomain
    const hostname = window.location.hostname;
    let domainName = hostname.split('.')[0].toLowerCase();

    // Handle root domain and www subdomain
    if (hostname === "www.doap.com" || hostname === "doap.com") {
        document.title = "Directory Of Agencies & Providers";
        const mainH1 = document.querySelector("h1");
        if (mainH1) {
            mainH1.style.display = "none"; // Hide the h1 for these domains
        }
        // Allow form functionality to proceed
    } else {
        // Handle other subdomains
        if (domainName === "www") {
            domainName = "default"; // Replace 'default' with the appropriate subdomain handling
        }

        // Find the current subdomain data
        const currentSubdomainData = subdomainData.find(data => data.subdomain === domainName);

        // Default values if no subdomain match
        const cityName = currentSubdomainData ? currentSubdomainData.city : "Norcal Doap";
        const phoneNumber = currentSubdomainData ? currentSubdomainData.phone : "833-289-3627";

        // Update page title and header
        document.title = `${cityName} Doap`;
        const mainH1 = document.querySelector("h1");
        if (mainH1 && currentSubdomainData) {
            mainH1.textContent = document.title;
        } else if (mainH1) {
            mainH1.style.display = "none"; // Hide the h1 if no valid subdomain data
        }

        // Update phone number
        const phoneNumberElement = document.querySelector(".phone-number");
        if (phoneNumberElement) {
            phoneNumberElement.textContent = phoneNumber;
            phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
        }
    }

    // ZIP Form logic
    const zipForm = document.querySelector("#zipForm");
    if (zipForm) {
        const input = zipForm.querySelector("input");
        const message = zipForm.querySelector(".message");

        zipForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const userInput = input.value.trim().toLowerCase();
            console.log(`ZIP form submitted with input: ${userInput}`);

            if (!userInput) {
                message.textContent = "Please enter a valid ZIP Code or city.";
                message.style.display = "block";
                return;
            }

            // Find matching subdomain by city or ZIP code
            let matchedURL = null;
            for (const data of subdomainData) {
                const matchesCity = data.servingCities.some(city => city.toLowerCase() === userInput);
                const matchesZip = data.serviceZips.includes(parseInt(userInput, 10));

                if (matchesCity || matchesZip) {
                    matchedURL = data.url;
                    break;
                }
            }

            if (matchedURL) {
                console.log(`Matched URL: ${matchedURL}`);
                window.location.href = matchedURL;
            } else {
                message.textContent = "No matching location found. Please try again.";
                message.style.display = "block";
            }
        });
    } else {
        console.error("ZIP form not found on the page.");
    }
});

console.log("doap.js loaded successfully!");

