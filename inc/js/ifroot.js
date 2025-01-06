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

