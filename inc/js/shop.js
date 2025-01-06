let cartForm;

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
    if (!cartForm) {
        console.log("cartForm is not defined.");
        return;
    }

    const itemElements = cartForm.querySelectorAll('input[name="item"]');
    let total = 0;

    const cartItems = Array.from(itemElements)
        .filter(el => el.checked)
        .map(item => {
            const quantityInput = item.closest(".item")?.querySelector(".quantity");
            if (!quantityInput) {
                console.warn("Quantity input not found for item.");
                return;
            }
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const [itemName, itemCost] = item.value.split('|');
            const cost = parseFloat(itemCost) * quantity;

            total += cost;

            return `<li>${itemName} (x${quantity}) - $${cost.toFixed(2)} 
                <span class="remove-item" data-value="${item.value}">x</span></li>`;
        }).filter(Boolean);

    // Update the selected items and total display
    selectedItemsList.innerHTML = cartItems.length
        ? cartItems.join("")
        : '<li>No items selected yet.</li>';
    totalDisplay.textContent = `$${total.toFixed(2)}`;

    const minOrderMessage = document.getElementById("minOrderMessage");
    const MINIMUM_ORDER_AMOUNT = 20; // Assuming a minimum order amount constant

    if (minOrderMessage) {
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
    }
};

// Event listeners for cart updates
if (cartForm) {
    cartForm.addEventListener("change", updateCart);
    cartForm.addEventListener("input", (event) => {
        if (event.target.classList.contains("quantity")) {
            updateCart();
        }
    });
} else {
    console.log("cartForm is not initialized.");
}

console.log("Cart logic applied successfully!");

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

    if (tabs.length === 0) {
        console.warn("No tabs found.");
        return;
    }

    tabs.forEach(tab => {
        tab.removeEventListener("click", handleTabClick);
        tab.addEventListener("click", handleTabClick);
    });

    function handleTabClick() {
        tabs.forEach(t => t.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));
        this.classList.add("active");
        const targetTab = document.getElementById(this.dataset.tab);
        if (targetTab) {
            targetTab.classList.add("active");
        }
    }
};

applyTabListeners();
console.log("Tab logic applied successfully!");

// Remove the createElement override to avoid recursion issues
// If there is still a need to track dynamic element creation, use a safer approach like mutation observers.

console.log("Removed createElement override to avoid stack overflow issues.");

