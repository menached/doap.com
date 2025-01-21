// consentHandler.js
import { setCookie, getCookie, deleteCookie } from './cookieManager.js';

export function initCookieConsent() {
    window.addEventListener("load", () => {
        syncCookiesToSession(); // Sync cookies to sessionStorage before anything else

        if (typeof window.cookieconsent === "undefined") {
            console.error("CookieConsent library not loaded.");
            return;
        }

        window.cookieconsent.initialise({
            palette: {
                popup: { background: "#000" },
                button: { background: "#f1d600" }
            },
            type: "opt-in",
            content: {
                message: "<img src=/images/gravatars/doap-budtender-150x150.png height=70 width=70>At <span class=marvel-font-bold>DOAP</span>, we go out of our way to respect your privacy. Enjoy 'no account needed' ordering or request a 'no-knock' discreet delivery. (call from out front). Details like these make our service truly <span class=marvel-font-bold>DOAP</span>!",
                dismiss: "Got it!",
                allow: "Allow Cookies",
                deny: "Decline",
                link: "Learn more",
                href: "/privacy-policy"
            },
            elements: {
                messagelink: '<span id="cookie-message" class="poppins-font-light">{{message}}</span> <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a>'
            },
            onInitialise: handleConsentChange,
            onStatusChange: handleConsentChange,
        });

        // Load Marvel font dynamically
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Marvel:wght@400;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    });
}

// Handle consent changes (on initialise and status change)
function handleConsentChange(status) {
    console.log(`Cookies ${status.toUpperCase()} by user.`);
    if (status === "allow") {
        syncSessionToCookies();
    } else {
        clearCookies();
    }
}

// Sync data from sessionStorage to cookies
function syncSessionToCookies() {
    const keysToSync = ["cartData", "customerData"];
    keysToSync.forEach(key => {
        const sessionData = sessionStorage.getItem(key);
        if (sessionData) {
            setCookie(key, JSON.parse(decodeURIComponent(sessionData)), 7); // Ensure cookies are valid JSON
            console.log(`${key} synchronized to cookies.`);
        }
    });
}

// Sync cookies to sessionStorage
export function syncCookiesToSession() {
    if (getCookie("cookieconsent_status") === "allow") {
        const keysToSync = ["cartData", "customerData", "siteData"];
        keysToSync.forEach((key) => {
            const cookieValue = getCookie(key);
            if (cookieValue) {
              try {
                // If it's an object, just JSON.stringify it directly.
                sessionStorage.setItem(
                  key,
                  encodeURIComponent(JSON.stringify(cookieValue))
                );
                console.log(`${key} synchronized from cookies to sessionStorage:`, cookieValue);
              } catch (error) {
                console.error(`Failed to process cookie for key "${key}":`, error);
              }
            }
        });
    }
}

// Clear cookies if consent is revoked
function clearCookies() {
    const keysToClear = ["cartData", "customerData", "siteData"];
    keysToClear.forEach(deleteCookie);
    console.log("Cookies cleared due to revoked consent.");
}

// Initialize default sessionStorage data
function initializeSessionData() {
    initializeCartData();
    initializeCustomerData();
}

// Initialize cartData in sessionStorage
function initializeCartData() {
    const cartData = getSessionData("cartData", []);
    sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
}

// Initialize customerData in sessionStorage
function initializeCustomerData() {
    const customerData = getSessionData("customerData", {
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        specialInstructions: ""
    });
    sessionStorage.setItem("customerData", encodeURIComponent(JSON.stringify(customerData)));
}

// Utility to retrieve and parse session data or return a default value
function getSessionData(key, defaultValue) {
    try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(decodeURIComponent(data)) : defaultValue;
    } catch {
        console.warn(`Failed to parse ${key}. Using default value.`);
        return defaultValue;
    }
}

