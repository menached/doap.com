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

const debounce = (func, delay = 100) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

const updateCart = debounce(() => {
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
}, 100);

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

// Avoid recursive creation and handle ad-blocking or script failure gracefully
(function() {
    const nativeCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
        if (typeof tagName !== 'string') {
            throw new Error("Invalid tagName passed to createElement.");
        }

        const tempElement = nativeCreateElement.call(document, tagName, options);
        if (tagName.toLowerCase() === "script") {
            tempElement.addEventListener("error", () => {
                console.error(`Failed to load script: ${tempElement.src}`);
                if (tempElement.src.includes("googlesyndication.com")) {
                    console.warn("Google Ads script failed. Review network or cookie settings.");
                }
            });

            if (tempElement.src && tempElement.src.includes("googlesyndication.com")) {
                const sessionId = sessionStorage.getItem('sessionId') || generateSessionId();
                document.cookie = `session_id=${sessionId}; path=/;`; // Store session ID in a cookie

                const isCookieAllowed = window.CookieConsent?.getCurrentStatus?.() === "allow";

                if (!isCookieAllowed) {
                    console.warn(`Blocking script from ${tempElement.src} until cookies are allowed.`);
                    tempElement.src = ""; // Prevent loading the blocked script
                }
            }
        }

        return tempElement;
    };

    function generateSessionId() {
        const newId = `sess-${Math.random().toString(36).substring(2)}-${Date.now()}`;
        sessionStorage.setItem('sessionId', newId);
        return newId;
    }

    console.log("Selective script creation interceptor with session ID handling applied.");
})();

console.log("document.createElement adjusted for selective third-party script management.");

