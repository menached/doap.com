// analytics.js

export function enableAnalyticsAndAds() {
    console.log("Loading third-party scripts and G-VP7XRHB9TQ.");
    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-VP7XRHB9TQ";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    gaScript.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-VP7XRHB9TQ');
    };
}

