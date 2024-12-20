import { subdomainData } from './subdomainData.js';

console.log("doap.js started loading");

document.addEventListener("DOMContentLoaded", () => {
    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();

    const currentSubdomainData = subdomainData.find(data => data.subdomain === domainName);

    let cityName = currentSubdomainData ? currentSubdomainData.city : "Norcal Doap";
    const phoneNumber = currentSubdomainData ? currentSubdomainData.phone : "833-289-3627";
    const minimumOrder = currentSubdomainData ? currentSubdomainData.minimumOrder : 60;

    document.title = `${cityName} Doap`;

    const mainH1 = document.querySelector("h1");
    if (mainH1) {
        mainH1.textContent = document.title;
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
});

console.log("doap.js loaded successfully!");

