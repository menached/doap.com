// main.js
import { initCookieConsent } from './consentHandler.js';
import { populateFormFromStorage } from './formPopulator.js';
import { subdomainData } from './subdomainData.js';
import { updateCustomerDataInSession } from './formHandler.js';


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


    //const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    //customerInputs.forEach(input => {
        //input.addEventListener("input", updateCustomerDataInSession);
    //});

    //// Listen for changes in customer info inputs
    //const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    //customerInputs.forEach(input => {
        //input.addEventListener("input", updateCartBorderColor);
    //});

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
    const requiredFields = document.querySelectorAll(".customer-info input[required], .customer-info textarea[required]");

    // Function to check if all required fields are filled
    //function validateFields() {
        //let customerData = {};
        //let cartData = [];
        //let cartTotal = 0;

        //// Retrieve and decode customerData
        //try {
            //const customerDataString = localStorage.getItem("customerData");
            //if (customerDataString) {
                //customerData = JSON.parse(decodeURIComponent(customerDataString));
            //}
        //} catch (error) {
            //console.error("Failed to parse customerData:", error);
        //}

        //// Retrieve and decode cartData
        //try {
            //const cartDataString = localStorage.getItem("cartData");
            //if (cartDataString) {
                //cartData = JSON.parse(decodeURIComponent(cartDataString));
                //cartTotal = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
            //}
        //} catch (error) {
            //console.error("Failed to parse cartData:", error);
        //}

        //// Retrieve minimum order value from siteData
        //let minimumOrder = 0;
        //try {
            //const siteDataString = localStorage.getItem("siteData");
            //if (siteDataString) {
                //const siteData = JSON.parse(decodeURIComponent(siteDataString));
                //minimumOrder = siteData.minimumOrder || 0;
            //}
        //} catch (error) {
            //console.error("Failed to parse siteData:", error);
        //}

        //// Check if all required customer fields are filled
        //const allRequiredFilled = customerData.name && customerData.phone && customerData.email &&
            //customerData.address && customerData.city && customerData.paymentMethod;

        //// Check if the cart meets the minimum order value
        //const meetsMinimumOrder = cartTotal >= minimumOrder;

        //const cartContainer = document.querySelector("#cartContainer");
        //const checkoutButton = document.getElementById("checkoutButton");

        //if (allRequiredFilled && meetsMinimumOrder) {
            //cartContainer.style.border = "2px solid #28a745"; // Green border if valid
            //checkoutButton.disabled = false; // Enable checkout button
        //} else {
            //cartContainer.style.border = "1px dashed #ff0000"; // Red border if invalid
            //checkoutButton.disabled = true; // Disable checkout button
        //}

        //console.log("Validation status:", {
            //allRequiredFilled,
            //meetsMinimumOrder,
            //cartTotal,
            //minimumOrder,
            //customerData,
            //cartData,
        //});
    //}

    // Add event listeners to all required fields
    requiredFields.forEach((field) => {
        field.addEventListener("input", validateFields);
    });

    // Initial validation check
    validateFields();
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
    //const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    //addToCartButtons.forEach(button => {
        //button.addEventListener("click", (event) => {
            //const rect = event.target.getBoundingClientRect();
            //const x = rect.left + rect.width / 2; // Center horizontally
            //const y = rect.top; // Start above the button

            //showFlyingText("Added to cart", x, y);

            //// Optional: Add your existing cart logic here
        //});
    //});
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

