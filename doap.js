import { subdomainData } from './subdomainData.js';

console.log("doap.js started loading");

document.addEventListener("DOMContentLoaded", () => {
    // Extract hostname and subdomain
    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();

    // Find the current subdomain data
    const currentSubdomainData = subdomainData.find(data => data.subdomain === domainName);

    // Default values if no subdomain match
    const cityName = currentSubdomainData ? currentSubdomainData.city : "Norcal Doap";
    const phoneNumber = currentSubdomainData ? currentSubdomainData.phone : "833-289-3627";
    const minimumOrder = currentSubdomainData ? currentSubdomainData.minimumOrder : 60;
    const servingCities = currentSubdomainData ? currentSubdomainData.servingCities.join(", ") : "All Northern California cities";
    const serviceZips = currentSubdomainData ? currentSubdomainData.serviceZips.join(", ") : "All ZIP codes";

    // Update page title and header
    document.title = `${cityName} Doap`;
    const mainH1 = document.querySelector("h1");
    if (mainH1) {
        mainH1.textContent = document.title;
    }

    // Update phone number
    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

    // Update link to subdomain cart
    const logoLink = document.querySelector(".header a");
    if (logoLink && currentSubdomainData) {
        logoLink.href = currentSubdomainData.url;
        logoLink.title = `Call ${cityName} Doap!`;
    }

    const headerLink = document.querySelector("h1 a");
    if (headerLink && currentSubdomainData) {
        headerLink.href = currentSubdomainData.url;
        headerLink.title = `Call ${cityName} Doap!`;
    }

    // Update city and ZIP info dynamically
    const servingCitiesElement = document.getElementById("servingCities");
    if (servingCitiesElement) {
        servingCitiesElement.textContent = `Serving Cities: ${servingCities}`;
    }

    const serviceZipsElement = document.getElementById("serviceZips");
    if (serviceZipsElement) {
        serviceZipsElement.textContent = `Serving ZIPs: ${serviceZips}`;
    }

    // ZIP Form logic
    const zipForm = document.querySelector("#zipForm");
    if (zipForm) {
        const input = zipForm.querySelector("input");
        const message = zipForm.querySelector(".message");

        zipForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const userInput = input.value.trim().toLowerCase();
            if (!userInput) {
                message.textContent = "Please enter a valid ZIP Code or city.";
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
                window.location.href = matchedURL;
            } else {
                message.textContent = "No matching location found. Please try again.";
            }
        });
    }
});

console.log("doap.js loaded successfully!");

