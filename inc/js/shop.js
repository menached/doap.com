console.log("shop.js started loading");

$(document).ready(function () {
    // Function to show flying text
    function showFlyingText(message, isRemoved = false) {
        // Create a new flying text element
        const flyingText = $('<div class="flying-text"></div>')
            .text(message)
            .css({
                left: '50%', // Center horizontally
                top: '50%',  // Center vertically
                transform: 'translate(-50%, -50%)', // Adjust for true centering
                zIndex: 9999, // Ensure it appears above other elements
            });

        // Add removed class if it's a removal message
        if (isRemoved) {
            flyingText.addClass('removed');
        }

        // Append to the container
        $('#flying-text-container').append(flyingText);

        // Remove the flying text after the animation
        setTimeout(() => {
            flyingText.remove();
        }, 3000); // Match animation duration
    }

    // Example usage: Add click events to your items
    $('.item').on('click', function () {
        const checkbox = $(this).find('input[type="checkbox"]');
        const isChecked = checkbox.prop('checked');
        checkbox.prop('checked', !isChecked);

        // Show flying text
        if (!isChecked) {
            showFlyingText('Added to Cart');
        } else {
            showFlyingText('Removed from Cart', true);
        }
    });
});


// Cart update logic
const cartForm = document.getElementById("cartForm");
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


    // Example cart update logic (placeholder for your actual cart logic)
    const updateCart = () => {
        let total = parseFloat(totalDisplay.textContent.replace('$', '')) || 0;
        handleOrderMessage(total);
    };

    // Call the function when the cart updates
    updateCart();

    document.getElementById("cartForm").addEventListener("change", updateCart);


        // Add remove-item functionality
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const valueToRemove = button.getAttribute("data-value");
                const itemToUncheck = cartForm.querySelector(`input[name="item"][value="${valueToRemove}"]`);
                if (itemToUncheck) {
                    itemToUncheck.checked = false;
                    cartForm.dispatchEvent(new Event("change"));
                }
            });
        });
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


// Payment method handling
const paymentMethodDropdown = document.getElementById("paymentMethod");
const creditCardForm = document.getElementById("creditCardForm");
const cryptoWallets = document.getElementById("cryptoWallets");
const generalHelp = document.getElementById("generalHelp");

const handlePaymentMethodChange = (selectedMethod) => {
    // Hide all sections initially
    creditCardForm.style.display = "none";
    cryptoWallets.style.display = "none";
    generalHelp.style.display = "none";

    // Show the appropriate section based on the selected payment method
    if (selectedMethod === "credit-card") {
        creditCardForm.style.display = "block";
    } else if (selectedMethod === "crypto") {
        cryptoWallets.style.display = "block";
    } else if (["cash"].includes(selectedMethod)) {
        generalHelp.style.display = "block";
        // Update the message for "Cash" payment method
        generalHelp.innerHTML = `
            <h3 style="display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fas fa-phone-alt"></i> Cash on Delivery</span>
                <i class="fas fa-question-circle" style="color: green; cursor: pointer;" title="Need more help? Click here!"></i>
            </h3>
            <p>COD is the easiest payment method.  No sign-up required.  Show proof of age upon delivery.  Check your email after placing your order to verify your order details. 
            If you need to make changes, call us at <strong>(833) 289-3627</strong> for assistance. We're standing by to help!</p>
        `;
    } else if (["zelle", "venmo", "paypal", "cashapp"].includes(selectedMethod)) {
        generalHelp.style.display = "block";
        generalHelp.innerHTML = `
            <h3 style="display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fas fa-phone-alt"></i> Need Assistance?</span>
                <i class="fas fa-question-circle" style="color: green; cursor: pointer;" title="Need more help? Click here!"></i>
            </h3>
            <p>After placing your order, please check your email for further instructions on how to complete your payment. 
            For zelle send payment to zelle@doap.com, for venmo, venmo@doap.com, for paypal, paypal@doap.com, and cashapp is cashapp@doap.com.  Feel free to call us at <strong>(833) 289-3627</strong> for assistance. We're standing by to help!</p>
        `;
    }
};

if (paymentMethodDropdown) {
    paymentMethodDropdown.addEventListener("change", (event) => {
        handlePaymentMethodChange(event.target.value);
    });

    // Trigger default behavior on page load
    handlePaymentMethodChange(paymentMethodDropdown.value);
}
console.log("Payment method logic applied!");


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

// Sync the H1 tag content with the page title
const mainH1 = document.querySelector("h1");
if (mainH1) {
    mainH1.textContent = document.title;
}

// Debug output
console.log(`Page title set to: ${document.title}`);


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



// Configuration: Maps for subdomains
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

// Extract subdomain and determine city info
function getSubdomain() {
    const hostname = window.location.hostname;
    return hostname.split('.')[0].toLowerCase();
}

function getCityName(domainName) {
    return cityMap[domainName] || domainName.charAt(0).toUpperCase() + domainName.slice(1);
}

function getMinimumOrderAmount(domainName) {
    return areaMinimum[domainName] || 60;
}

function getPhoneNumber(domainName) {
    return phoneMap[domainName] || defaultPhoneNumber;
}

// Update document elements
function updatePageTitle(cityName, hostname) {
    if (hostname === "www.doap.com" || hostname === "doap.com") {
        document.title = "Norcal DOAP";
    } else {
        document.title = `${cityName} Doap`;
    }
    console.log(`Page title set to: ${document.title}`);
}

function updateCityNameElement(cityName) {
    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) {
        cityNameElement.textContent = cityName;
    } else {
        console.warn("Element with id 'cityName' not found.");
    }
}

function updatePhoneNumberElement(phoneNumber) {
    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }
}

function updateLogoAndHeaderLinks(domainName, cityName) {
    const logoLink = document.querySelector(".header a");
    const headerLink = document.querySelector("h1 a");
    const linkUrl = `https://${domainName}.doap.com/simple.php`;
    const linkTitle = `Call ${cityName} Doap!`;

    if (logoLink) {
        logoLink.href = linkUrl;
        logoLink.title = linkTitle;
    }

    if (headerLink) {
        headerLink.href = linkUrl;
        headerLink.title = linkTitle;
    }
}

function syncMainH1WithTitle() {
    const mainH1 = document.querySelector("h1");
    if (mainH1) {
        mainH1.textContent = document.title;
    }
}

function hideElementsForMainDomain() {
    const sectionsToHide = [".tab", ".tab-content", ".cart-section", ".payment-section", ".customer-info"];
    sectionsToHide.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => element.style.display = "none");
    });
    console.log("Tabs, cart, and payment methods are hidden for www and doap.com.");
}

// Main function to initialize the page based on subdomain
function initializePage() {
    const hostname = window.location.hostname;
    const domainName = getSubdomain();
    const cityName = (hostname === "www.doap.com" || hostname === "doap.com") ? "California" : getCityName(domainName);

    const minimumOrderAmount = getMinimumOrderAmount(domainName);
    console.log(`Subdomain: ${domainName}, Minimum Order: $${minimumOrderAmount}`);

    if (hostname === "www.doap.com" || hostname === "doap.com") {
        hideElementsForMainDomain();
    }

    updatePageTitle(cityName, hostname);
    updateCityNameElement(cityName);
    updatePhoneNumberElement(getPhoneNumber(domainName));
    updateLogoAndHeaderLinks(domainName, cityName);
    syncMainH1WithTitle();
}

// Run the initialization
initializePage();


const targetElement = document.querySelector('body > div:nth-child(3)');
if (targetElement) {
    targetElement.remove();
    console.log("Removed body > div:nth-child(3)");
} else {
    console.warn("Element body > div:nth-child(3) not found.");
}


// Close modal on Escape key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideLargeImage();
    }
});


function showLargeImage(imageSrc) {
    const modal = document.getElementById('largeImageModal');
    const img = document.getElementById('largeImage');
    img.src = imageSrc;

    img.onerror = () => {
        img.src = '/wp-content/uploads/default-large-image.webp'; // Fallback image path
    };

    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
}


function hideLargeImage() {
    const modal = document.getElementById('largeImageModal');
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.pointerEvents = 'none';
}

console.log("Hovered:", this.querySelector('.thumbnail').getAttribute('alt'));
console.log("Image src:", imgSrc);


function showNotification(message) {
    const popup = document.createElement('div');
    popup.className = 'popup success visible';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}


document.addEventListener("DOMContentLoaded", function () {
    if (window.location.hostname === "www.doap.com" && window.location.pathname === "/simple.php") {
        const cartForm = document.getElementById("cartForm");
        if (cartForm) {
            cartForm.style.display = "none";
            console.log("#cartForm hidden successfully.");
        } else {
            console.warn("#cartForm not found on this page.");
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    console.log("Product selection logic initialized");

    // Select all product items
    const productItems = document.querySelectorAll('.product');

    // Add click event listener to each product item
    productItems.forEach(item => {
        item.addEventListener('click', function () {
            const checkbox = this.querySelector('input[type="checkbox"]');

            // Toggle the selected state
            const isSelected = checkbox.checked;
            checkbox.checked = !isSelected;

            // Apply or remove the 'selected' class based on the checkbox state
            this.classList.toggle('selected', !isSelected);

            // Optionally, update the cart or any other UI here
            console.log(`${this.querySelector('.item-title').textContent} is now ${!isSelected ? "added to" : "removed from"} the cart.`);
        });
    });

    console.log("Product selection logic applied successfully");
});


document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cartContainer');
    const selectedItemsList = document.getElementById('selectedItemsList');

    // Function to check if the cart has any items
    function toggleCartVisibility() {
        const hasItems = selectedItemsList.querySelectorAll('li').length > 0 &&
                         selectedItemsList.querySelector('li').textContent !== 'No items selected yet.';
        cartContainer.style.display = hasItems ? 'block' : 'none';
    }

    // Listen for changes to the cart
    document.querySelectorAll('.item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const itemDetails = checkbox.closest('.item');
            const itemName = itemDetails.querySelector('.item-title').textContent;
            const itemPrice = parseFloat(itemDetails.querySelector('.item-price').textContent.replace('$', ''));
            const quantityInput = itemDetails.querySelector('.quantity');
            const quantity = parseInt(quantityInput.value, 10) || 1;

            if (checkbox.checked) {
                // Add item to the cart
                const li = document.createElement('li');
                li.textContent = `${itemName} (x${quantity}) - $${(itemPrice * quantity).toFixed(2)}`;
                selectedItemsList.appendChild(li);
            } else {
                // Remove item from the cart
                const items = Array.from(selectedItemsList.querySelectorAll('li'));
                const itemToRemove = items.find(li => li.textContent.includes(itemName));
                if (itemToRemove) {
                    selectedItemsList.removeChild(itemToRemove);
                }
            }

            toggleCartVisibility();
        });
    });

    // Initially check if the cart has any items
    toggleCartVisibility();
});

console.log("shop.js loaded completely");
