console.log("doap.js started loading");
document.addEventListener("DOMContentLoaded", () => {

    // Map subdomains to minimum order amounts
    const areaMinimum = {
        alamo: 40,
        burlingame: 120,
        campbell: 120,
        concord: 50,
        danville: 40,
        dublin: 40,
        lafayette: 50,
        livermore: 50,
        orinda: 60,
        pittsburg: 75,
        pleasanthill: 60,
        sanramon: 40,
        walnutcreek: 50
    };

    // Extract the subdomain
    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();
    const cityNameElement = document.getElementById("cityName");


    // Default cityName for single-word subdomains
    let cityName = domainName.charAt(0).toUpperCase() + domainName.slice(1).toLowerCase();

    // Map of subdomains to full city names
    const cityMap = {
        pleasanthill: "Pleasant Hill",
        walnutcreek: "Walnut Creek",
        castrovalley: "Castro Valley",
        sanramon: "San Ramon",
        discoverybay: "Discovery Bay",
        alamo: "Alamo",
        burlingame: "Burlingame",
        antioch: "Antioch",
        dublin: "Dublin",
        lafayette: "Lafayette",
        pleasanton: "Pleasanton",
        danville: "Danville",
        concord: "Concord",
        livermore: "Livermore",
        orinda: "Orinda"
    };

    // Map of subdomains to phone numbers
    const phoneMap = {
        pleasanthill: "925-891-7800",
        walnutcreek: "925-464-2075",
        castrovalley: "925-263-9209",
        sanramon: "925-365-6030",
        discoverybay: "925-891-7800",
        alamo: "925-553-4710",
        burlingame: "650-293-0880",
        antioch: "925-891-7800",
        dublin: "925-587-6777",
        lafayette: "925-871-1333",
        pleasanton: "925-587-6777",
        danville: "925-725-6920",
        concord: "925-412-4880",
        livermore: "925-718-6181",
        orinda: "925-891-7800"
    };

    // Update cityName if the domain exists in the map
    if (cityMap[domainName]) {
        cityName = cityMap[domainName];
    } else if (hostname === "www.doap.com" || hostname === "doap.com") {
        cityName = "Norcal Doap";
        // Hide all tabs and their contents
        const tabs = document.querySelectorAll(".tab, .tab-content");
        tabs.forEach(tab => tab.style.display = "none");
    }

    // Get the phone number based on the subdomain, default to the general number
    const defaultPhoneNumber = "833-289-3627";
    const phoneNumber = phoneMap[domainName] || defaultPhoneNumber;

    const defaultDescription = `${cityName} DOAP Delivers Organic Awesome Pot to ${cityName} and surrounding cities 9-9 daily.`;

    // Update the page title
    document.title = `${cityName} Doap`;

    // Match H1 to Page Title
    const mainH1 = document.querySelector("h1");
    if (mainH1) {
        mainH1.textContent = document.title;
    }
    
    if (cityNameElement) {
        if (hostname === "www.doap.com" || hostname === "doap.com") {
            // Set the site heading explicitly to "Doap"
            cityNameElement.textContent = "Doap";
            console.log("Updated site heading to 'Doap' for www.doap.com.");
        } else {
            console.log("Preserved city name:", cityNameElement.textContent);
        }
    } else {
        console.warn("Element with id 'cityName' not found.");
    }
    // Update the phone number dynamically in the header
    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

    // Update logo link
    const logoLink = document.querySelector(".header a");
    if (logoLink) {
        logoLink.href = `https://${domainName}.doap.com/cart.php`;
        logoLink.title = `Call ${cityName} Doap!`;
    }
    
    // Update header text
    const headerLink = document.querySelector("h1 a");
    if (headerLink) {
        headerLink.href = `https://${domainName}.doap.com/cart.php`;
        headerLink.title = `Call ${cityName} Doap!`;
    }
});


document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing ZIP form...");

    const zipData = [
        { zip: [94507], city: ["Alamo", "Blackhawk", "Tassajara"], url: "https://alamo.doap.com/cart.php" },
        { zip: [94568], city: ["Dublin"], url: "https://dublin.doap.com/cart.php" },
        // Add more entries as needed
    ];

    // Select the form from footer.html
    const zipForm = document.querySelector("#zipForm");
    if (!zipForm) {
        console.error("ZIP form not found!");
        return;
    }

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
    for (const data of zipData) {
        // Check if the input is a number (ZIP Code) or a string (City)
        if (!isNaN(userInput)) {
            if (data.zip.includes(parseInt(userInput))) {
                matchedURL = data.url;
                break;
            }
        } else if (data.city.some(city => city.toLowerCase() === userInput)) {
            matchedURL = data.url;
            break;
        }
    }


});

console.log("Hovered:", this.querySelector('.thumbnail').getAttribute('alt'));
console.log("Image src:", imgSrc);
console.log("cart.js loaded completely");
