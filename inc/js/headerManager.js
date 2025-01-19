// headerManager.js
import { subdomainData } from './data.js'; // Import subdomainData from data.js

console.log(subdomainData); // Logs the complete array of subdomain data

document.addEventListener("DOMContentLoaded", () => {
    const cityNameElement = document.getElementById("cityName");
    const phoneNumberElement = document.querySelector(".phone-number");
    const hostname = window.location.hostname.split('.')[0].toLowerCase();

    // Get the city data based on the subdomain
    const cityData = subdomainData.find(entry => entry.subdomain === hostname);
    if (cityData) {
        cityNameElement.textContent = `${cityData.city} Doap`;
        phoneNumberElement.textContent = cityData.phone;
        phoneNumberElement.href = `tel:${cityData.phone.replace(/-/g, '')}`;
        console.log(`Minimum Order for ${cityData.city}: $${cityData.minimumOrder}`);

        // Set the browser tab title
        document.title = `${cityData.city} Doap`;
        console.log(`Tab title set to: "${document.title}"`);
    } else {
        console.warn("Subdomain not found in data.");

        // Set a default tab title if subdomain is not found
        document.title = "Doap";
        console.log(`Tab title set to default: "${document.title}"`);
    }

    console.group("Session and Cookie Status");

    // Log session storage data
    const sessionDataKeys = ["siteData", "customerData"];
    sessionDataKeys.forEach((key) => {
        const sessionValue = sessionStorage.getItem(key);
        if (sessionValue) {
            console.log(`${key} (sessionStorage):`, JSON.parse(decodeURIComponent(sessionValue)));
        } else {
            console.warn(`${key} not found in sessionStorage.`);
        }
    });

    // Log cookies
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = decodeURIComponent(value || "");
        return acc;
    }, {});
    //console.log("Cookies:", cookies);

    console.groupEnd(); // Close the console group
});

