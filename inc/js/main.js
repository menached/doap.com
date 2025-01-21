// main.js
import { initCookieConsent } from './consentHandler.js';
import { populateFormFromStorage } from './formPopulator.js';
import { subdomainData } from './subdomainData.js';

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

    // Listen for changes in customer info inputs
    const customerInputs = document.querySelectorAll(".customer-info input, .customer-info textarea");
    customerInputs.forEach(input => {
        input.addEventListener("input", updateCartBorderColor);
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
    const requiredFields = document.querySelectorAll(".customer-info input[required], .customer-info textarea[required]");

    // Function to check if all required fields are filled
    function validateFields() {
        let allFilled = true;

        requiredFields.forEach((field) => {
            if (!field.value.trim()) {
                allFilled = false;
            }
        });

        // Enable or disable the button based on the validation
        checkoutButton.disabled = !allFilled;
    }

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

    // Attach event listener to "Add to Cart" buttons
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

    // Example: Adding items to the cart
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Update the cart total dynamically for demonstration
            const currentTotal = parseFloat(totalElement.textContent.replace("$", "")) || 0;
            const itemPrice = parseFloat(button.getAttribute("data-price"));
            totalElement.textContent = `$${(currentTotal + itemPrice).toFixed(2)}`;
        });
    });

    // Initial visibility check
    updateCartVisibility();
});


document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cartContainer");
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Optional: Update cart total or add the item to the cart here
            
            // Scroll to the cart container
            cartContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
});



document.addEventListener("DOMContentLoaded", () => {
    const productImages = document.querySelectorAll(".product .item img");
    const modalOverlay = document.createElement("div");
    const modal = document.createElement("div");

    modalOverlay.className = "product-modal-overlay";
    modal.className = "product-modal";

    modal.innerHTML = `
        <button class="product-modal-close">&times;</button>
        <img src="" alt="Product Image" />
        <h3></h3>
        <p></p>
    `;

    document.body.appendChild(modalOverlay);
    document.body.appendChild(modal);

    const closeModal = () => {
        modalOverlay.style.display = "none";
        modal.style.display = "none";
    };

    modalOverlay.addEventListener("click", closeModal);
    modal.querySelector(".product-modal-close").addEventListener("click", closeModal);

    productImages.forEach(image => {
        const product = image.closest(".item");
        const title = product.querySelector(".item-title").textContent;
        const description = product.dataset.description;

        const showModal = () => {
            modal.querySelector("img").src = image.src;
            modal.querySelector("h3").textContent = title;
            modal.querySelector("p").innerHTML = description;

            modal.style.display = "block";
            modalOverlay.style.display = "block";

            // Ensure the modal is centered
            modal.style.top = "50%";
            modal.style.left = "50%";
            modal.style.transform = "translate(-50%, -50%)";
        };

        // For mobile and desktop: Use click for showing the modal
        image.addEventListener("click", showModal);

        // For desktop only: Use hover for showing the modal
        if (!isMobileDevice()) {
            image.addEventListener("mouseenter", showModal); // Desktop hover
            image.addEventListener("mouseleave", closeModal); // Hide modal on mouse leave
        }
    });

    // Utility function to detect mobile devices
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    }
});




