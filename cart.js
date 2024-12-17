document.addEventListener("DOMContentLoaded", () => {
    // Extract the subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0]; // Raw subdomain

    // Default cityName for single-word subdomains
    let cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase();

    // Map of subdomains to full city names
    const cityMap = {
        pleasanthill: "Pleasant Hill",
        walnutcreek: "Walnut Creek",
        castrovalley: "Castro Valley",
        sanramon: "San Ramon",
        discoverybay: "Discovery Bay",
        alamo: "Alamo",
        antioch: "Antioch",
        dublin: "Dublin",
        lafayette: "Lafayette",
        pleasanton: "Pleasanton",
        danville: "Danville",
        concord: "Concord",
        livermore: "Livermore",
        orinda: "Orinda"
    };

    const minimumOrderMap = {
        alamo: 50,
        sanramon: 50,
        danville: 50,
        dublin: 50,
        walnutcreek: 60,
        concord: 60,
        pleasanthill: 60,
        castrovalley: 60,
        burlingame: 120,
        campbell: 120,
        livermore: 60
    };

    // Get the phone number based on the subdomain
    const defaultPhoneNumber = "833-289-3627";
    const phoneNumber = {
        ...{
            pleasanthill: "925-891-7800",
            walnutcreek: "925-464-2075",
            castrovalley: "925-263-9209",
            sanramon: "925-365-6030",
            alamo: "925-553-4710",
            dublin: "925-587-6777",
        },
    };

    // Determine minimum order
    const defaultMinOrder = 75;
    const minimumOrder = minimumOrderMap[subdomain] || defaultMinOrder;

    const cartForm = document.getElementById("cartForm");
    const totalDisplay = document.getElementById("total");
    const selectedItemsList = document.getElementById("SelectedItemsList");
  user_quantity_quantity="+ @` disable check full filled upon pagecall logic 
}
}
empty and working enter assistant submit next collect

