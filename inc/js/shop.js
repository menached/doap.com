console.log("shop.js started loading");
const productTitle = '';
$(document).ready(function () {

    // Log the image source when a product image is clicked
    document.querySelectorAll('.item img').forEach(img => {
        img.addEventListener('click', function () {
            const imgSrc = this.src;  // Get the image source
            console.log("Image src:", imgSrc);
        });
    });

});

const totalDisplay = document.getElementById("total");
const selectedItemsList = document.getElementById("selectedItemsList");

const updateCart = () => {
    const itemElements = cartForm.querySelectorAll('input[name="item"]');
    let total = 0;

    const cartItems = Array.from(itemElements)
        .filter(el => el.checked)
        .map(item => {
            const quantityInput = item.closest(".item").querySelector(".quantity");
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const [itemName, itemCost] = item.value.split('|');
            const cost = parseFloat(itemCost) * quantity;

            total += cost;

            return `<li>${itemName} (x${quantity}) - $${cost.toFixed(2)} 
                <span class="remove-item" data-value="${item.value}">x</span></li>`;
        });

        // Update the selected items and total display
        selectedItemsList.innerHTML = cartItems.length
            ? cartItems.join("")
            : '<li>No items selected yet.</li>';
        totalDisplay.textContent = `$${total.toFixed(2)}`;

        const handleOrderMessage = (total) => {
            if (total === 0) {
                minOrderMessage.textContent = `Minimum order is $${MINIMUM_ORDER_AMOUNT}.`;
                minOrderMessage.style.color = "black";
            } else if (total > 0 && total < MINIMUM_ORDER_AMOUNT) {
                minOrderMessage.textContent = `Minimum order is $${MINIMUM_ORDER_AMOUNT}.`;
                minOrderMessage.style.color = "red";
            } else {
                minOrderMessage.textContent = "Free 1hr delivery!";
                minOrderMessage.style.color = "green";
            }
        };

    };

// Event listeners for cart updates
if (cartForm) {
    cartForm.addEventListener("change", updateCart);
    cartForm.addEventListener("input", (event) => {
        if (event.target.classList.contains("quantity")) {
            updateCart();
        }
    });
}
console.log("Cart logic applied successfully!");

// Get the modal
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const captionText = document.getElementById("caption");

// Add event listener to all product images
document.querySelectorAll(".item img").forEach(img => {
    img.addEventListener("click", function () {
        modal.style.display = "block";
        modalImage.src = this.src;
        captionText.innerHTML = this.alt;
    });
});

// Close the modal
window.closeModal = function () {
    modal.style.display = "none";
};

// Configuration: Map subdomains to minimum order amounts, city names, and phone numbers
const areaMinimum = {
    alamo: 40, burlingame: 120, campbell: 120, concord: 50, danville: 40, dublin: 40,
    lafayette: 50, livermore: 50, orinda: 60, pittsburg: 75, pleasanthill: 60,
    sanramon: 40, walnutcreek: 50
};

const cityMap = {
    pleasanthill: "Pleasant Hill", walnutcreek: "Walnut Creek", castrovalley: "Castro Valley",
    sanramon: "San Ramon", discoverybay: "Discovery Bay", alamo: "Alamo", antioch: "Antioch",
    dublin: "Dublin", lafayette: "Lafayette", pleasanton: "Pleasanton", danville: "Danville",
    concord: "Concord", livermore: "Livermore", orinda: "Orinda"
};

const phoneMap = {
    pleasanthill: "925-891-7800", walnutcreek: "925-464-2075", castrovalley: "925-263-9209",
    sanramon: "925-365-6030", discoverybay: "925-891-7800", alamo: "925-553-4710",
    antioch: "925-891-7800", dublin: "925-587-6777", lafayette: "925-871-1333",
    pleasanton: "925-587-6777", danville: "925-725-6920", concord: "925-412-4880",
    livermore: "925-718-6181", orinda: "925-891-7800"
};

const defaultPhoneNumber = "833-289-3627";

// Extract the subdomain and set defaults
const hostname = window.location.hostname;
const domainName = hostname.split('.')[0].toLowerCase();
let cityName = cityMap[domainName] || domainName.charAt(0).toUpperCase() + domainName.slice(1);
const MINIMUM_ORDER_AMOUNT = areaMinimum[domainName] || 60;

console.log(`Subdomain: ${domainName}, Minimum Order: $${MINIMUM_ORDER_AMOUNT}`);

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

// Update page elements with city-specific information
const cityNameElement = document.getElementById("cityName");
if (cityNameElement) {
    cityNameElement.textContent = (hostname === "www.doap.com" || hostname === "doap.com") ? "California" : cityName;
} else {
    console.warn("Element with id 'cityName' not found.");
}

// Update phone number dynamically
const phoneNumber = phoneMap[domainName] || defaultPhoneNumber;
const phoneNumberElement = document.querySelector(".phone-number");
if (phoneNumberElement) {
    phoneNumberElement.textContent = phoneNumber;
    phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
}

// Update logo and header links with subdomain-specific links
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

// Tab switching logic
const applyTabListeners = () => {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and tab contents
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Add active class to clicked tab and corresponding tab content
            tab.classList.add("active");
            const targetTab = document.getElementById(tab.dataset.tab);
            if (targetTab) {
                targetTab.classList.add("active");
            }
        });
    });
};

applyTabListeners();
console.log("Tab logic applied successfully!");

