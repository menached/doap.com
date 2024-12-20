console.log("doap.js started loading");
document.addEventListener("DOMContentLoaded", () => {

    // Consolidated table for subdomain data
    const subdomainData = [
        { 
            subdomain: "alamo", 
            city: "Alamo", 
            phone: "925-553-4710", 
            minimumOrder: 40, 
            url: "https://alamo.doap.com/cart.php" 
        },
        { 
            subdomain: "burlingame", 
            city: "Burlingame", 
            phone: "650-293-0880", 
            minimumOrder: 120, 
            url: "https://burlingame.doap.com/cart.php" 
        },
        { 
            subdomain: "campbell", 
            city: "Campbell", 
            phone: "N/A", 
            minimumOrder: 120, 
            url: "https://campbell.doap.com/cart.php" 
        },
        { 
            subdomain: "concord", 
            city: "Concord", 
            phone: "925-412-4880", 
            minimumOrder: 50, 
            url: "https://concord.doap.com/cart.php" 
        },
        { 
            subdomain: "danville", 
            city: "Danville", 
            phone: "925-725-6920", 
            minimumOrder: 40, 
            url: "https://danville.doap.com/cart.php" 
        },
        { 
            subdomain: "dublin", 
            city: "Dublin", 
            phone: "925-587-6777", 
            minimumOrder: 40, 
            url: "https://dublin.doap.com/cart.php" 
        },
        { 
            subdomain: "lafayette", 
            city: "Lafayette", 
            phone: "925-871-1333", 
            minimumOrder: 50, 
            url: "https://lafayette.doap.com/cart.php" 
        },
        { 
            subdomain: "livermore", 
            city: "Livermore", 
            phone: "925-718-6181", 
            minimumOrder: 50, 
            url: "https://livermore.doap.com/cart.php" 
        },
        { 
            subdomain: "orinda", 
            city: "Orinda", 
            phone: "925-891-7800", 
            minimumOrder: 60, 
            url: "https://orinda.doap.com/cart.php" 
        },
        { 
            subdomain: "pittsburg", 
            city: "Pittsburg", 
            phone: "N/A", 
            minimumOrder: 75, 
            url: "https://pittsburg.doap.com/cart.php" 
        },
        { 
            subdomain: "pleasanthill", 
            city: "Pleasant Hill", 
            phone: "925-891-7800", 
            minimumOrder: 60, 
            url: "https://pleasanthill.doap.com/cart.php" 
        },
        { 
            subdomain: "sanramon", 
            city: "San Ramon", 
            phone: "925-365-6030", 
            minimumOrder: 40, 
            url: "https://sanramon.doap.com/cart.php" 
        },
        { 
            subdomain: "walnutcreek", 
            city: "Walnut Creek", 
            phone: "925-464-2075", 
            minimumOrder: 50, 
            url: "https://walnutcreek.doap.com/cart.php" 
        }
    ];

    // Extract the subdomain
    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();

    // Get city data based on subdomain
    const currentSubdomainData = subdomainData.find(data => data.subdomain === domainName);
    
    let cityName = currentSubdomainData ? currentSubdomainData.city : "Norcal Doap";
    const phoneNumber = currentSubdomainData ? currentSubdomainData.phone : "833-289-3627";
    const minimumOrder = currentSubdomainData ? currentSubdomainData.minimumOrder : 60;
    const defaultDescription = `${cityName} DOAP Delivers Organic Awesome Pot to ${cityName} and surrounding cities 9-9 daily.`;

    // Update the page title
    document.title = `${cityName} Doap`;

    // Match H1 to Page Title
    const mainH1 = document.querySelector("h1");
    if (mainH1) {
        mainH1.textContent = document.title;
    }

    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.textContent = cityName;
    }

    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

    const logoLink = document.querySelector(".header a");
    if (logoLink && currentSubdomainData) {
        logoLink.href = currentSubdomainData.url;
        logoLink.title = `Call ${cityName} Doap!`;
    }

    const headerLink = document.querySelector("h1 a");
    if (headerLink && currentSubdomainData) {
        headerLink.href = currentSubdomainData.url;
        headerLink.title = `Call ${cityName} Doap!`;
    }

    // ZIP Form Logic
    const zipForm = document.querySelector("#zipForm");
    if (zipForm) {
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
            for (const data of subdomainData) {
                if (!isNaN(userInput) && data.zip?.includes(parseInt(userInput))) {
                    matchedURL = data.url;
                    break;
                } else if (data.city.toLowerCase() === userInput) {
                    matchedURL = data.url;
                    break;
                }
            }

            if (matchedURL) {
                window.location.href = matchedURL;
            } else {
                message.textContent = "No matching location found. Please try again.";
            }
        });
    }
});

console.log("doap.js loaded successfully!");

