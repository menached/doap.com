// Function to initialize cookie consent and handle consent status
window.addEventListener("load", function() {
    window.cookieconsent.initialise({
        palette: {
            popup: { background: "#000" },
            button: { background: "#f1d600" }
        },
        type: "opt-in", // Require explicit opt-in for analytics and ads.
        content: {
            message: "We use cookies to enhance your experience.",
            dismiss: "Got it!",
            allow: "Allow Cookies",
            deny: "Decline",
            link: "Learn more",
            href: "/privacy-policy"
        },
        onInitialise: function(status) {
            if (status === 'allow') {
                enableAnalyticsAndAds(); // Load analytics and ads after consent
                switchToCookies(); // Switch session storage to cookies after consent
            } else {
                console.log("Cookies declined. Keeping cart data in session storage.");
            }
        },
        onStatusChange: function(status) {
            if (status === 'allow') {
                enableAnalyticsAndAds();
                switchToCookies();
            } else {
                console.warn("User declined cookies.");
            }
        }
    });
});

// Function to load third-party analytics and ads only if cookies are allowed
function enableAnalyticsAndAds() {
    console.log("User consented to cookies. Loading third-party scripts...");
    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-VP7XRHB9TQ";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    gaScript.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-VP7XRHB9TQ'); // Your Google Analytics 4 ID
    };
}

function switchToCookies() {
    const cartData = sessionStorage.getItem("cartData");
    if (cartData) {
        try {
            // Decode the cartData if it's URL-encoded
            const decodedData = decodeURIComponent(cartData);
            const parsedData = JSON.parse(decodedData);  // Parse after decoding
            document.cookie = `cartData=${encodeURIComponent(JSON.stringify(parsedData))}; path=/; SameSite=None; Secure; max-age=604800`; // 7 days
            console.log("Cart data moved to cookies:", parsedData);
        } catch (error) {
            console.error("Failed to parse cart data from sessionStorage:", error);
        }
    }
}

console.log(`Consent status: ${status}`);
