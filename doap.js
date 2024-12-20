import { subdomainData } from './subdomainData.js';

console.log("doap.js started loading");

// Function to process subdomainData in chunks asynchronously
const processSubdomainData = (data, chunkSize, processCallback, completeCallback) => {
    let index = 0;

    function processChunk() {
        const end = Math.min(index + chunkSize, data.length);

        for (let i = index; i < end; i++) {
            const item = data[i];
            processCallback(item);
        }

        index = end;

        if (index < data.length) {
            setTimeout(processChunk, 0); // Schedule the next chunk
        } else if (completeCallback) {
            completeCallback();
        }
    }

    processChunk();
};

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

    // Process subdomainData asynchronously for additional operations (example: rendering to DOM)
    processSubdomainData(
        subdomainData,
        5, // Process 5 items per chunk
        (item) => {
            console.log(`Processing subdomain: ${item.subdomain}, City: ${item.city}`);
            
            // Example: Dynamically render data to DOM
            const container = document.getElementById("dataContainer");
            if (container) {
                const element = document.createElement("div");
                element.textContent = `Subdomain: ${item.subdomain}, City: ${item.city}`;
                container.appendChild(element);
            }
        },
        () => {
            console.log("Finished processing subdomain data.");
        }
    );

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

