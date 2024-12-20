// Consolidated table for subdomain data
import { subdomainData } from './subdomainData.js';
console.log("doap.js started loading");
document.addEventListener("DOMContentLoaded", () => {


    // Extract the subdomain
    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();

    // Get city data based on subdomain
    const currentSubdomainData = subdomainData.find(data => data.subdomain === domainName);
    
    let cityName = currentSubdomainData ? currentSubdomainData.city : "Norcal Doap";
    const phoneNumber = currentSubdomainData ? currentSubdomainData.phone : "833-289-3627";
    const minimumOrder = currentSubdomainData ? currentSubdomainData.minimumOrder : 60;
    const defaultDescription = `${cityName} DOAP Delivers Organic Awesome Pot to ${cityName} and surrounding cities 9-9 daily.`;

    // Update the page title
    document.title = `${cityName} Doap`;

    // Match H1 to Page Title
    const mainH1 = document.querySelector("h1");
    if (mainH1) {
        mainH1.textContent = document.title;
    }

    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.textContent = cityName;
    }

    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

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

    // ZIP Form Logic
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

            let matchedURL = null;
            for (const data of subdomainData) {
                if (!isNaN(userInput) && data.zip?.includes(parseInt(userInput))) {
                    matchedURL = data.url;
                    break;
                } else if (data.city.toLowerCase() === userInput) {
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

