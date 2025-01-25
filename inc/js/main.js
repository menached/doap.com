// main.js
import { initCookieConsent } from './consentHandler.js';
import { populateFormFromStorage } from './formPopulator.js';
import { subdomainData } from './subdomainData.js';
import { updateCustomerDataInSession } from './formHandler.js';

floatingModal.classList.add("show");

export function showNotification(message) {
    const modal = document.getElementById("notification-modal");
    const messageElement = document.getElementById("notification-message");
    const closeButton = document.getElementById("close-notification");

    messageElement.textContent = message;
    modal.style.display = "block";

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
}


document.addEventListener("DOMContentLoaded", () => {
    initCookieConsent();
    populateFormFromStorage();

    const cartContainer = document.getElementById("cartContainer");

    function getMinimumOrder() {
        const subdomain = window.location.hostname.split('.')[0].toLowerCase();
        const areaData = subdomainData.find(entry => entry.subdomain === subdomain);
        return areaData?.minimumOrder || 0;  // Default to 0 if not found
    }

    function getCartTotal() {
        const totalElement = document.getElementById("total");
        return parseFloat(totalElement.textContent.replace("$", "")) || 0;
    }

    function isCustomerInfoComplete() {
        // Gather all fields
        const customerInfo = {
            name: document.getElementById("name")?.value || "",
            phone: document.getElementById("phone")?.value || "",
            email: document.getElementById("email")?.value || "",
            address: document.getElementById("address")?.value || "",
            city: document.getElementById("city")?.value || "",
            specialInstructions: document.getElementById("specialInstructions")?.value || "",
        };

        // Define which fields are “required”
        const requiredFields = ["name", "phone", "email", "address", "city"];

        // Count filled required fields
        const filledRequiredCount = requiredFields
            .filter(field => customerInfo[field].trim() !== "").length;

        const totalRequired = requiredFields.length;

        return {
            allFilled: filledRequiredCount === totalRequired,
            partiallyFilled: filledRequiredCount > 0 && filledRequiredCount < totalRequired,
        };
    }

    function updateCartBorderColor() {
        const cartTotal = getCartTotal();
        const minimumOrder = getMinimumOrder();
        const meetsMinimumOrder = cartTotal >= minimumOrder;
        const { allFilled, partiallyFilled } = isCustomerInfoComplete();
        const paymentMethod = document.getElementById("paymentMethod")?.value;

        if (!allFilled && cartTotal === 0) {
            cartContainer.style.borderColor = "#FF0000"; // Red: No fields and no cart data
        } else if (!allFilled && partiallyFilled) {
            cartContainer.style.borderColor = "#FFCC00"; // Yellow: Some fields filled but not all
        } else if (allFilled && meetsMinimumOrder && paymentMethod) {
            cartContainer.style.borderColor = "#00FF00"; // Green: All fields filled, meets minimum, and payment selected
        } else {
            cartContainer.style.borderColor = "#FF0000"; // Red: Invalid state (e.g., missing payment method)
        }

        console.log(`Customer Info Complete: ${allFilled}, Partially Filled: ${partiallyFilled}, Payment Method: ${paymentMethod}, Cart Total: $${cartTotal}, Minimum: $${minimumOrder}`);
    }

    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");

    customerInputs.forEach((input) => {
        input.addEventListener("input", updateCustomerDataInSession);
        input.addEventListener("input", updateCartBorderColor); // Add both event listeners
    });


    // Listen for cart total changes
    const totalElement = document.getElementById("total");
    const observer = new MutationObserver(() => {
        updateCartBorderColor();  // Trigger when the cart total changes
    });

    if (totalElement) {
        observer.observe(totalElement, { childList: true, subtree: true });
    }

    // Initial check on page load
    updateCartBorderColor();

    console.group("Debug Info");
    console.log("Minimum Order:", getMinimumOrder());
    console.log("Initial Cart Total:", getCartTotal());
    console.groupEnd();
});


export function getCityDataFromHostname() {
    const hostname = window.location.hostname.split('.')[0].toLowerCase();
    return subdomainData.find(entry => entry.subdomain === hostname) || {};
}



document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkoutButton");

    checkoutButton.addEventListener("click", async () => {
        const isValid = validateFields();
        if (!isValid) return;

        showNotification("Sending your order, please wait...");
        
        try {
            const response = await processOrder();
            if (response.message === 'Order processed successfully!') {
                showNotification("Order Completed Successfully!");
            } else {
                throw new Error("Unexpected response");
            }
        } catch (error) {
            showNotification("Error processing order. Please try again.");
            console.error(error);
        }
    });

    async function processOrder() {
        return new Promise((resolve) => setTimeout(() => resolve({ message: "Order processed successfully!" }), 2000));
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const flyingTextContainer = document.getElementById("flying-text-container");

    function showFlyingText(text, x, y) {
        const flyingText = document.createElement("div");
        flyingText.textContent = text;
        flyingText.className = "flying-text";

        // Set position near the clicked button
        flyingText.style.left = `${x}px`;
        flyingText.style.top = `${y}px`;

        flyingTextContainer.appendChild(flyingText);

        // Remove the text after the animation ends
        flyingText.addEventListener("animationend", () => {
            flyingTextContainer.removeChild(flyingText);
        });
    }

    //// Attach event listener to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const rect = event.target.getBoundingClientRect();
            const x = rect.left + rect.width / 2; // Center horizontally
            const y = rect.top; // Start above the button

            showFlyingText("Added to cart", x, y);

            // Optional: Add your existing cart logic here
        });
    });
});


    //import { subdomainData } from './data.js'; // Ensure this path is correct

    document.addEventListener("DOMContentLoaded", () => {
        const hostname = window.location.hostname.split('.')[0].toLowerCase();

        let title = "Norcal Doap"; // Default title
        if (hostname === "localhost") {
            title = "Developing Doap";
        } else {
            const subdomainInfo = subdomainData.find(entry => entry.subdomain === hostname);
            if (subdomainInfo && subdomainInfo.city) {
                title = `${subdomainInfo.city} Doap`;
            }
        }

        document.title = title;
        console.log(`Document title set to: "${title}"`);
    });




document.addEventListener("DOMContentLoaded", () => {
    const copyElements = document.querySelectorAll(".copy-address");
    const copyMessage = document.getElementById("copyMessage");

    copyElements.forEach(element => {
        element.addEventListener("click", () => {
            const address = element.getAttribute("data-address");

            if (navigator.clipboard) {
                navigator.clipboard.writeText(address)
                    .then(() => {
                        showCopyFeedback("Address copied!", element);
                    })
                    .catch(err => {
                        console.error("Error copying text: ", err);
                    });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = address;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    showCopyFeedback("Address copied!", element);
                } catch (err) {
                    console.error("Error copying text: ", err);
                }
                document.body.removeChild(textArea);
            }
        });
    });

    function showCopyFeedback(message, element) {
        if (copyMessage) {
            copyMessage.textContent = message;
            copyMessage.style.display = "block";

            setTimeout(() => {
                copyMessage.style.display = "none";
            }, 2000);
        }

        element.style.color = "green";
        element.style.fontWeight = "bold";

        setTimeout(() => {
            element.style.color = "";
            element.style.fontWeight = "";
        }, 2000);
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("checkoutButton");
    const modal = document.getElementById("hoverModal");

    button.addEventListener("mouseenter", () => {
        if (button.disabled) {
            const rect = button.getBoundingClientRect();
            modal.style.display = "block";
            modal.style.top = `${rect.top - modal.offsetHeight}px`;
            modal.style.left = `${rect.left + rect.width / 2 - modal.offsetWidth / 2}px`;
        }
    });

    button.addEventListener("mouseleave", () => {
        modal.style.display = "none";
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cartContainer");
    const cartItemsList = document.getElementById("selectedItemsList");
    const totalElement = document.getElementById("total");

    // Helper function to toggle visibility
    function updateCartVisibility() {
        const total = parseFloat(totalElement.textContent.replace("$", "")) || 0;
        if (total > 0) {
            cartContainer.style.display = "block"; // Show cart
        } else {
            cartContainer.style.display = "none"; // Hide cart
        }
    }

    // Listen for changes in the cart total
    const observer = new MutationObserver(() => {
        updateCartVisibility(); // Update visibility when cart total changes
    });

    if (totalElement) {
        observer.observe(totalElement, { childList: true, subtree: true });
    }

    // Initial visibility check
    updateCartVisibility();
});



document.addEventListener("DOMContentLoaded", () => {
    const quantitySelect = document.getElementById("quantity-top-shelf-hydro");
    const itemPriceElement = document.querySelector(".item-price");
    const addToCartButton = document.querySelector(".add-to-cart-button");

    quantitySelect.addEventListener("change", () => {
        const selectedOption = quantitySelect.options[quantitySelect.selectedIndex];
        const selectedPrice = selectedOption.getAttribute("data-price");

        // Update the price display
        itemPriceElement.textContent = `$${selectedPrice}`;
        itemPriceElement.setAttribute("data-base-price", selectedPrice);

        // Update the Add to Cart button data
        addToCartButton.setAttribute("data-price", selectedPrice);
    });
});


export function validateFields() {
    let customerData = {};
    let cartData = [];
    let cartTotal = 0;
    let minimumOrder = 0;

    // Retrieve and decode customerData
    try {
        const customerDataString = localStorage.getItem("customerData");
        if (customerDataString) {
            customerData = JSON.parse(decodeURIComponent(customerDataString));
        }
    } catch (error) {
        console.error("Failed to parse customerData:", error);
    }

    // Retrieve and decode cartData
    try {
        const cartDataString = localStorage.getItem("cartData");
        if (cartDataString) {
            cartData = JSON.parse(decodeURIComponent(cartDataString));
            cartTotal = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
        }
    } catch (error) {
        console.error("Failed to parse cartData:", error);
    }

    // Retrieve minimum order value from siteData
    try {
        const siteDataString = localStorage.getItem("siteData") || sessionStorage.getItem("siteData");
        if (siteDataString) {
            const siteData = JSON.parse(decodeURIComponent(siteDataString));
            minimumOrder = siteData.minimumOrder || 0;
        }
    } catch (error) {
        console.error("Failed to parse siteData:", error);
    }

    // Check if all required customer fields are filled
    //const allRequiredFilled = customerData.name && customerData.phone && customerData.email &&
        //customerData.address && customerData.city && customerData.paymentMethod;
    const allRequiredFilled = !!(
      customerData.name &&
      customerData.phone &&
      customerData.email &&
      customerData.address &&
      customerData.city &&
      customerData.paymentMethod
    );

    // Check if the cart meets the minimum order value
    const meetsMinimumOrder = cartTotal >= minimumOrder;

    // Update UI elements
    const cartContainer = document.querySelector("#cartContainer");
    const checkoutButton = document.getElementById("checkoutButton");

    if (allRequiredFilled && meetsMinimumOrder) {
        cartContainer.style.border = "2px solid #28a745"; // Green border
        checkoutButton.disabled = false; // Enable checkout button
        checkoutButton.style.backgroundColor = "#28a745"; // Green background
    } else {
        cartContainer.style.border = "1px dashed #ff0000"; // Red border
        checkoutButton.disabled = true; // Disable checkout button
        checkoutButton.style.backgroundColor = "#ccc"; // Grey background
    }

    console.log("Validation status:", {
        allRequiredFilled,
        meetsMinimumOrder,
        cartTotal,
        minimumOrder,
        customerData,
        cartData,
    });
}





document.addEventListener("DOMContentLoaded", () => {
    const targetElement = document.querySelector("body > div.page-wrapper > footer > div:nth-child(1) > div");

    // Check if the target element exists
    if (!targetElement) {
        console.warn("Target element not found.");
        return;
    }

    // Function to check if customer info is complete
    function isCustomerInfoComplete() {
        const customerData = {
            name: document.getElementById("name")?.value || "",
            phone: document.getElementById("phone")?.value || "",
            email: document.getElementById("email")?.value || "",
            address: document.getElementById("address")?.value || "",
            city: document.getElementById("city")?.value || "",
        };

        // Check if all required fields are filled
        return Object.values(customerData).every((value) => value.trim() !== "");
    }

    // Function to update visibility of the target element
    function updateElementVisibility() {
        if (isCustomerInfoComplete()) {
            targetElement.style.display = "none"; // Hide element
            console.log("Customer Info Complete. Hiding target element.");
        } else {
            targetElement.style.display = "block"; // Show element
            console.log("Customer Info Incomplete. Showing target element.");
        }
    }

    // Attach event listeners to input fields to trigger visibility updates
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    customerInputs.forEach((input) => {
        input.addEventListener("input", updateElementVisibility);
    });

    // Run the visibility update on page load
    updateElementVisibility();
});




function showSendingOrderModal() {
    const sendingOrderModal = document.getElementById("sendingOrderModal");
    if (sendingOrderModal) {
        sendingOrderModal.style.display = "block"; // Make the modal visible
    }
}

function hideSendingOrderModal() {
    const sendingOrderModal = document.getElementById("sendingOrderModal");
    if (sendingOrderModal) {
        sendingOrderModal.style.display = "none"; // Hide the modal
    }
}

// Example usage in the checkout process
document.getElementById("checkoutButton").addEventListener("click", async () => {
    showSendingOrderModal(); // Show the "Sending Order" modal

    try {
        // Simulate order processing (replace with real API call)
        const response = await processOrder();
        hideSendingOrderModal(); // Hide the "Sending Order" modal

        if (response.message === 'Order processed successfully!') {
            showNotification("Order Completed Successfully!");
        } else {
            throw new Error("Unexpected response from server");
        }
    } catch (error) {
        hideSendingOrderModal(); // Ensure the modal is hidden on error
        showNotification("Processing order. Please wait...");
        console.error(error);
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const floatingModal = document.getElementById("floatingModal");
    const cartLink = document.getElementById("cartLink");
    const cartThumbnails = document.getElementById("cartThumbnails");
    const cartContainer = document.getElementById("cartContainer"); // Example container

    // Function to get cart data
    function getCartData() {
        try {
            const cartData = localStorage.getItem("cartData");
            return cartData ? JSON.parse(decodeURIComponent(cartData)) : [];
        } catch (error) {
            console.error("Error parsing cart data:", error);
            return [];
        }
    }

    // Function to update the floating modal
    function updateFloatingModal() {
        const cartData = getCartData();
        const itemCount = cartData.reduce((total, item) => total + (item.quantity || 0), 0);

        if (itemCount > 0) {
            // Update modal link text
            cartLink.textContent = `${itemCount} ${itemCount === 1 ? "Item" : "Items"} in Cart`;

            // Populate thumbnails
            cartThumbnails.innerHTML = ""; // Clear existing thumbnails
            cartData.forEach(item => {
                if (item.thumbnail) { // Ensure the item has a thumbnail property
                    const img = document.createElement("img");
                    img.src = item.thumbnail; // Use the item's thumbnail URL
                    img.alt = item.name || "Cart Item"; // Fallback alt text
                    cartThumbnails.appendChild(img);
                }
            });

            floatingModal.style.display = "block"; // Show the modal
            floatingModal.style.opacity = "1"; // Fade-in effect
        } else {
            floatingModal.style.opacity = "0"; // Fade-out effect
            setTimeout(() => (floatingModal.style.display = "none"), 300); // Hide after fade-out
        }
    }

    // Smooth scroll to cart
    cartLink.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("cartAnchor").scrollIntoView({ behavior: "smooth" });
    });

    // Observer to detect changes in the cart
    const observer = new MutationObserver(() => {
        updateFloatingModal(); // Update modal when cart changes
    });

    // Attach observer to the cart container
    if (cartContainer) {
        observer.observe(cartContainer, { childList: true, subtree: true });
    }

    // Initial update on page load
    updateFloatingModal();

    // Example event for manual updates (e.g., adding/removing items programmatically)
    document.addEventListener("cartUpdated", updateFloatingModal);
});

