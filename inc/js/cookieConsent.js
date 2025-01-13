// cookieConsent.js
// Function to initialize cookie consent and handle consent status
// Ensure this script runs without module imports in browsers without ES module support.
// Define the global function if it hasn't been already.

if (typeof populateFormFromCookiesOrSession !== "function") {
    window.populateFormFromCookiesOrSession = function () {
        let customerInfo = getCookie("customerInfo") ? JSON.parse(decodeURIComponent(getCookie("customerInfo"))) : {};
        let cartData = getCookie("cartData") ? JSON.parse(decodeURIComponent(getCookie("cartData"))) : [];
        let sessionData = getCookie("sessionData") ? JSON.parse(decodeURIComponent(getCookie("sessionData"))) : {};

        console.log("Populating form from cookies:");

        // Populate form fields with customerInfo
        Object.keys(customerInfo).forEach((key) => {
            const inputField = document.getElementById(key);
            if (inputField) {
                inputField.value = customerInfo[key];
            }
        });

        return { customerInfo, cartData, sessionData };
    };
}

window.addEventListener("load", function () {
    const consentStatus = getCookie("cookieconsent_status");

    if (consentStatus === "allow") {
        console.log("Cookies allowed. Populating form and data from cookies.");
        window.populateFormFromCookiesOrSession();  // Read cookies directly.
        enableAnalyticsAndAds();
    } else {
        console.log("Cookies not allowed. Falling back to session data.");
        syncCookiesToSession();  // Sync cookies to session as fallback.
    }

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
                console.log("Consent status: allowed.");
                enableAnalyticsAndAds();
                switchToCookies(); // Sync session to cookies
                window.populateFormFromCookiesOrSession(); // Ensure form fields are filled on status change.
            } else {
                console.warn("Consent declined. Using session data.");
                syncCookiesToSession();
                deleteAllCookies();
            }
        },
        onStatusChange: function (status) {
            if (status === 'allow') {
                console.log("User changed consent to allow.");
                enableAnalyticsAndAds();
                switchToCookies();
                window.populateFormFromCookiesOrSession(); // Ensure cookies populate after status change.
            } else {
                console.warn("User changed consent to decline.");
                syncCookiesToSession();
                deleteAllCookies();
            }
        }
    });

    // Populate form fields on load based on cookies or session storage
    const { customerInfo, cartData, sessionData } = window.populateFormFromCookiesOrSession();
    console.group("Populated Data After Initialization:");
    console.log("Customer Info:", customerInfo);
    console.log("Cart Data:", cartData);
    console.log("Session Data:", sessionData);
    console.groupEnd();
});

// Function to sync cookies to session storage before deletion
function syncCookiesToSession() {
    try {
        const cartData = getCookie("cartData");
        const sessionData = getCookie("sessionData");
        const customerInfo = getCookie("customerInfo");

        if (cartData) {
            sessionStorage.setItem("cartData", decodeURIComponent(cartData));
            console.log("Synchronized cart data from cookies to session.");
        }
        if (sessionData) {
            sessionStorage.setItem("sessionData", decodeURIComponent(sessionData));
            console.log("Synchronized session data from cookies to session.");
        }
        if (customerInfo) {
            sessionStorage.setItem("customerInfo", decodeURIComponent(customerInfo));
            console.log("Synchronized customer info from cookies to session.");
        }
    } catch (error) {
        console.error("Error syncing cookies to session:", error);
    }
}

// Function to delete all relevant cookies (but keep session data intact)
function deleteAllCookies() {
    const cookiesToDelete = ["cartData", "sessionData", "cookieconsent_status", "customerInfo"];
    cookiesToDelete.forEach(cookie => {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;`;
    });
    console.log("All cookies have been deleted. Session data remains intact as a backup.");

    // Print existing session data
    const sessionCartData = sessionStorage.getItem("cartData");
    const sessionCustomerData = sessionStorage.getItem("customerInfo");

    console.group("Synchronized Data Overview");

    // Log session storage keys and values
    console.group("Session Storage Data:");
    Object.keys(sessionStorage).forEach((key) => {
        console.log(`${key}:`, isValidJSON(sessionStorage.getItem(key)) ? JSON.parse(decodeURIComponent(sessionStorage.getItem(key))) : sessionStorage.getItem(key));
    });
    console.groupEnd();

    // Log cookie keys and values
    console.group("Cookie Data:");
    document.cookie.split("; ").forEach((cookie) => {
        const [key, value] = cookie.split("=");
        console.log(`${key}:`, isValidJSON(decodeURIComponent(value)) ? JSON.parse(decodeURIComponent(value)) : decodeURIComponent(value));
    });
    console.groupEnd();

    console.groupEnd();
}

// Helper function to check if a string is valid JSON
function isValidJSON(value) {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to load third-party analytics and ads only if cookies are allowed
function enableAnalyticsAndAds() {
    console.log("User consented to cookies. Loading third-party scripts...");
    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-VP7XRHB9TQ";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    gaScript.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-VP7XRHB9TQ'); // Your Google Analytics 4 ID
    };
}

function switchToCookies() {
    try {
        let existingCartData = [];
        const cookieCartData = document.cookie.split('; ').find(row => row.startsWith('cartData='));

        // Load existing cart data from cookies if available
        if (cookieCartData) {
            existingCartData = JSON.parse(decodeURIComponent(cookieCartData.split('=')[1])) || [];
            console.log("Existing cart data from cookies:", existingCartData);
        }

        const sessionCartData = sessionStorage.getItem("cartData");
        let mergedCartData = existingCartData;

        //// Merge session cart data if available
        //if (sessionCartData) {
            //const newCartData = JSON.parse(decodeURIComponent(sessionCartData));
            //mergedCartData = mergeCartDataByProductName(existingCartData, newCartData);
            //console.log("Synchronized cart data between session and cookies:", mergedCartData);

            //// Sync the merged cart data to both cookies and sessionStorage
            //const encodedCartData = encodeURIComponent(JSON.stringify(mergedCartData));
            //if (encodedCartData.length <= 4000) { // Prevent large cookie size
                //document.cookie = `cartData=${encodedCartData}; path=/; SameSite=None; Secure; max-age=604800`;
                //sessionStorage.setItem("cartData", encodedCartData);
            //} else {
                //console.warn("Cart data exceeds cookie size limit. Only sessionStorage will be updated.");
                //sessionStorage.setItem("cartData", encodedCartData);
            //}
        //}

        // Merge session cart data if available and not empty
        if (sessionCartData && JSON.parse(decodeURIComponent(sessionCartData)).length > 0) {
            const newCartData = JSON.parse(decodeURIComponent(sessionCartData));
            mergedCartData = mergeCartDataByProductName(existingCartData, newCartData);
            console.log("Synchronized cart data between session and cookies:", mergedCartData);
        } else {
            console.log("No session cart data. Using cart data from cookies only.");
        }

        // Sync the merged cart data to both cookies and sessionStorage
        const encodedCartData = encodeURIComponent(JSON.stringify(mergedCartData));
        if (encodedCartData.length <= 4000) { // Prevent large cookie size
            document.cookie = `cartData=${encodedCartData}; path=/; SameSite=None; Secure; max-age=604800`;
            sessionStorage.setItem("cartData", encodedCartData);
        } else {
            console.warn("Cart data exceeds cookie size limit. Only sessionStorage will be updated.");
            sessionStorage.setItem("cartData", encodedCartData);
        }


        // Retrieve sessionData explicitly
        const sessionData = sessionStorage.getItem("sessionData")
            ? JSON.parse(decodeURIComponent(sessionStorage.getItem("sessionData")))
            : null;

        if (sessionData) {
            const encodedSessionData = encodeURIComponent(JSON.stringify(sessionData));
            document.cookie = `sessionData=${encodedSessionData}; path=/; SameSite=None; Secure; max-age=604800`;
            sessionStorage.setItem("sessionData", encodedSessionData);
            console.log("Synchronized sessionData between session and cookies:", sessionData);
        } else {
            console.warn("No sessionData found in session storage.");
        }

        const sessionCustomerData = sessionStorage.getItem("customerInfo");
        if (sessionCustomerData) {
            const customerData = JSON.parse(decodeURIComponent(sessionCustomerData));
            const encodedCustomerData = encodeURIComponent(JSON.stringify(customerData
            ));
            document.cookie = `customerInfo=${encodedCustomerData}; path=/; SameSite=None; Secure; max-age=604800`;
            sessionStorage.setItem("customerInfo", encodedCustomerData);
            console.log("Synchronized customer data between session and cookies:", customerData);
        }

    } catch (error) {
        console.error("Error during switchToCookies operation:", error);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

// Updated function to merge cart data and avoid duplicates
function mergeCartDataByProductName(existingCartData, newCartData) {
    const productMap = new Map();

    // Add existing cart items to the map
    existingCartData.forEach(item => {
        productMap.set(item.name, { ...item });
    });

    // Merge or update quantities from new cart data
    newCartData.forEach(item => {
        if (productMap.has(item.name)) {
            productMap.get(item.name).quantity += item.quantity;
        } else {
            productMap.set(item.name, { ...item });
        }
    });

    // Convert map back to array
    return Array.from(productMap.values());
}

// Ensure populateFormFromCookiesOrSession is globally accessible in case of non-modular environments
if (typeof window.populateFormFromCookiesOrSession === 'undefined') {
    window.populateFormFromCookiesOrSession = function () {
        let customerInfo = getCookie("customerInfo") ? JSON.parse(decodeURIComponent(getCookie("customerInfo"))) : {};
        let cartData = getCookie("cartData") ? JSON.parse(decodeURIComponent(getCookie("cartData"))) : [];
        let sessionData = getCookie("sessionData") ? JSON.parse(decodeURIComponent(getCookie("sessionData"))) : {};

        console.log("Populating form from cookies:");

        Object.keys(customerInfo).forEach((key) => {
            const inputField = document.getElementById(key);
            if (inputField) {
                inputField.value = customerInfo[key];
            }
        });

        return { customerInfo, cartData, sessionData };
    };
}

