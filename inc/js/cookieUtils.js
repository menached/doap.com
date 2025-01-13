// cookieUtils.js

export function setCookie(name, value, days) {
    if (JSON.stringify(value) === "{}") {
        console.warn(`Skipped setting ${name} cookie: value is empty.`);
        return;
    }
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax;`;
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;
}

export function populateFormFromCookiesOrSession() {
    let customerInfo, cartData, sessionData;

    if (getCookie("cookieconsent_status") === "allow") {
        customerInfo = getCookie("customerInfo") ? JSON.parse(decodeURIComponent(getCookie("customerInfo"))) : {};
        cartData = getCookie("cartData") ? JSON.parse(decodeURIComponent(getCookie("cartData"))) : [];
        sessionData = getCookie("sessionData") ? JSON.parse(decodeURIComponent(getCookie("sessionData"))) : {};
    } else {
        customerInfo = sessionStorage.getItem("customerInfo") ? JSON.parse(decodeURIComponent(sessionStorage.getItem("customerInfo"))) : {};
        cartData = sessionStorage.getItem("cartData") ? JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData"))) : [];
        sessionData = sessionStorage.getItem("sessionData") ? JSON.parse(decodeURIComponent(sessionStorage.getItem("sessionData"))) : {};
    }

    console.log("Populating form from:", getCookie("cookieconsent_status") === "allow" ? "cookies" : "session storage");

    // Populate form fields with customerInfo
    Object.keys(customerInfo).forEach((key) => {
        const inputField = document.getElementById(key);
        if (inputField) {
            inputField.value = customerInfo[key];
        }
    });

    return { customerInfo, cartData, sessionData };
}

// cookieConsent.js
window.addEventListener("load", function () {
    window.cookieconsent.initialise({
        palette: {
            popup: { background: "#000" },
            button: { background: "#f1d600" }
        },
        type: "opt-in",
        content: {
            message: "We use cookies to enhance your experience.",
            dismiss: "Got it!",
            allow: "Allow Cookies",
            deny: "Decline",
            link: "Learn more",
            href: "/privacy-policy"
        },
        onInitialise: function (status) {
            if (status === 'allow') {
                enableAnalyticsAndAds();
                switchToCookies();
            } else {
                syncCookiesToSession();
                deleteAllCookies();
            }
        },
        onStatusChange: function (status) {
            if (status === 'allow') {
                enableAnalyticsAndAds();
                switchToCookies();
            } else {
                console.warn("User declined cookies. Syncing cookies to session and deleting cookies.");
                syncCookiesToSession();
                deleteAllCookies();
            }
        }
    });

    // Populate form fields on load based on cookies or session storage
    const { customerInfo, cartData, sessionData } = populateFormFromCookiesOrSession();
    if (Object.keys(customerInfo).length > 0 || cartData.length > 0 || Object.keys(sessionData).length > 0) {
        console.group("Populated Data After Initialization:");
        console.log("Customer Info:", customerInfo);
        console.log("Cart Data:", cartData);
        console.log("Session Data:", sessionData);
        console.groupEnd();
    } else {
        console.warn("No data available to populate form on page load.");
    }


    //console.group("Populated Data After Initialization:");
    //console.log("Customer Info:", customerInfo);
    //console.log("Cart Data:", cartData);
    //console.log("Session Data:", sessionData);
    //console.groupEnd();
});

// Function to sync cookies to session storage before deletion
function syncCookiesToSession() {
    try {
        const customerInfo = getCookie("customerInfo");
        const sessionData = getCookie("sessionData");

        if (customerInfo && JSON.parse(decodeURIComponent(customerInfo)).name) {
            sessionStorage.setItem("customerInfo", decodeURIComponent(customerInfo));
            console.log("Synchronized customer info from cookies to session.");
        } else {
            console.warn("Customer info cookie is empty or missing. Skipping sync.");
        }

        if (sessionData) {
            sessionStorage.setItem("sessionData", decodeURIComponent(sessionData));
            console.log("Synchronized session data from cookies to session.");
        }
    } catch (error) {
        console.error("Error syncing cookies to session:", error);
    }
}
