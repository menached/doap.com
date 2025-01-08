//let cityName;
const defaultPhoneNumber = "833-289-3627";

const cityMap = {
    pleasanthill: "Pleasant Hill", walnutcreek: "Walnut Creek", castrovalley: "Castro Valley",
    sanramon: "San Ramon", discoverybay: "Discovery Bay", alamo: "Alamo", antioch: "Antioch",
    dublin: "Dublin", lafayette: "Lafayette", pleasanton: "Pleasanton", danville: "Danville",
    concord: "Concord", livermore: "Livermore", orinda: "Orinda"
};

const phoneMap = {
    pleasanthill: "925-891-7800", walnutcreek: "925-464-2075", castrovalley: "925-263-9209",
    sanramon: "925-365-6030", discoverybay: "925-891-7800", alamo: "925-553-4710",
    antioch: "925-891-7800", dublin: "925-587-6777", lafayette: "925-871-1333",
    pleasanton: "925-587-6777", danville: "925-725-6920", concord: "925-412-4880",
    livermore: "925-718-6181", orinda: "925-891-7800"
};

// Extract subdomain from the current hostname
//let domainName = window.location.hostname.split('.')[0];

// Extract the subdomain and set defaults
const hostname = window.location.hostname;
const domainName = hostname.split('.')[0].toLowerCase();
let cityName = cityMap[domainName] || domainName.charAt(0).toUpperCase() + domainName.slice(1);
    
console.log(`Hostname: ${hostname}, DomainName: ${domainName}, CityName ${cityName}`);

// Handle special case for the main domain (www.doap.com or doap.com)
if (hostname === "www.doap.com" || hostname === "doap.com") {
    cityName = "Directory Of Agencies & Providers";
    document.title = "Norcal DOAP";

    // Hide all interactive sections for directory view
    const sectionsToHide = [".tab", ".tab-content", ".cart-section", ".payment-section", ".customer-info"];
    sectionsToHide.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => element.style.display = "none");
    });

    console.log("Tabs, cart, and payment methods are hidden for www and doap.com.");
} else {
    document.title = `${cityName} Doap`;
}


console.log(domainName)
// Update phone number dynamically
const phoneNumber = phoneMap[domainName] || defaultPhoneNumber;
const phoneNumberElement = document.querySelector(".phone-number");
if (phoneNumberElement) {
    phoneNumberElement.textContent = phoneNumber;
    phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
}

// Update logo and header links with subdomain-specific links
const logoLink = document.querySelector(".header a");
const headerLink = document.querySelector("h1 a");
if (logoLink) {
    logoLink.href = `https://${domainName}.doap.com/simple.php`;
    logoLink.title = `Call ${cityName} Doap!`;
}
if (headerLink) {
    headerLink.href = `https://${domainName}.doap.com/simple.php`;
    headerLink.title = `Call ${cityName} Doap!`;
}

