// Configuration: Map subdomains to minimum order amounts, city names, and phone numbers
export const defaultPhoneNumber = "833-289-3627";

export const areaMinimum = {
    alamo: 40, burlingame: 120, campbell: 120, concord: 50, danville: 40, dublin: 40,
    lafayette: 50, livermore: 50, orinda: 60, pittsburg: 75, pleasanthill: 60,
    sanramon: 40, walnutcreek: 50
};

export const cityMap = {
    pleasanthill: "Pleasant Hill", walnutcreek: "Walnut Creek", castrovalley: "Castro Valley",
    sanramon: "San Ramon", discoverybay: "Discovery Bay", alamo: "Alamo", antioch: "Antioch",
    dublin: "Dublin", lafayette: "Lafayette", pleasanton: "Pleasanton", danville: "Danville",
    concord: "Concord", livermore: "Livermore", orinda: "Orinda"
};

export const phoneMap = {
    pleasanthill: "925-891-7800", walnutcreek: "925-464-2075", castrovalley: "925-263-9209",
    sanramon: "925-365-6030", discoverybay: "925-891-7800", alamo: "925-553-4710",
    antioch: "925-891-7800", dublin: "925-587-6777", lafayette: "925-871-1333",
    pleasanton: "925-587-6777", danville: "925-725-6920", concord: "925-412-4880",
    livermore: "925-718-6181", orinda: "925-891-7800"
};

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=None; Secure`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

window.addEventListener("DOMContentLoaded", () => {
    const hostname = window.location.hostname.split('.')[0].toLowerCase();
    const domainName = hostname === "www" || hostname === "doap" ? "default" : hostname;
    const cityName = cityMap[domainName] || "Norcal";

    console.log(`Subdomain: ${domainName}, City detected: ${cityName}`);

    const cityInputElement = document.getElementById("city");
    if (cityInputElement) {
        cityInputElement.value = cityName;
        console.log(`City input value set to: ${cityInputElement.value}`);
    } else {
        console.error("City input element not found.");
    }

    setCookie("hostname", hostname, 7);
    setCookie("domainName", domainName, 7);
    setCookie("cityName", cityName, 7);

    // Update phone number dynamically
    const phoneNumberElement = document.querySelector(".phone-number");
    const phoneNumber = phoneMap[domainName] || defaultPhoneNumber;
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    } else {
        console.error("Phone number element not found.");
    }

    // Update header and logo links
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

    // Load values from cookies and verify
    const cookieCityName = getCookie("cityName");
    if (cookieCityName) {
        console.log(`City from cookies: ${cookieCityName}`);
    } else {
        console.warn("City cookie not found.");
    }
});

