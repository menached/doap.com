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
                //clearCookieBasedData();
            }
        },
        onStatusChange: function(status) {
            if (status === 'allow') {
                enableAnalyticsAndAds();
                switchToCookies();
            } else {
                console.warn("User declined cookies. Leaving existing cookie-based data intact.");
                //clearCookieBasedData();
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

        // Merge session cart data if available
        if (sessionCartData) {
            const newCartData = JSON.parse(decodeURIComponent(sessionCartData));
            mergedCartData = [...new Set([...existingCartData, ...newCartData])]; // Avoid duplicate entries
            console.log("Synchronized cart data between session and cookies:", mergedCartData);

            // Sync the merged cart data to both cookies and sessionStorage
            const encodedCartData = encodeURIComponent(JSON.stringify(mergedCartData));
            if (encodedCartData.length <= 4000) { // Prevent large cookie size
                document.cookie = `cartData=${encodedCartData}; path=/; SameSite=None; Secure; max-age=604800`;
                sessionStorage.setItem("cartData", encodedCartData);
            } else {
                console.warn("Cart data exceeds cookie size limit. Only sessionStorage will be updated.");
                sessionStorage.setItem("cartData", encodedCartData);
            }
        }

        const sessionCustomerData = sessionStorage.getItem("sessionData");

        // Sync customer data if available
        if (sessionCustomerData) {
            const customerData = JSON.parse(decodeURIComponent(sessionCustomerData));
            const encodedCustomerData = encodeURIComponent(JSON.stringify(customerData));

            document.cookie = `sessionData=${encodedCustomerData}; path=/; SameSite=None; Secure; max-age=604800`;
            sessionStorage.setItem("sessionData", encodedCustomerData); // Ensure it remains in sessionStorage too
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



