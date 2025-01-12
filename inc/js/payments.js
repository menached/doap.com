// Import areaMinimum and handlePaymentMethodChange from utility modules
import { areaMinimum } from './ifroot.js';
import { cityMap } from './ifroot.js';
import { handlePaymentMethodChange } from './formUtils.js';
import { updateCartUI } from './cartUtils.js'; // Use imported function
import { loadCustomerAndCartData } from './cartUtils.js'; // Use imported function

window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event triggered: Initializing customer and cart data loading.");

    // Add detailed logs at the start of loadCustomerAndCartData
    console.log("Debug: Current sessionStorage keys and values at page load:");
    Object.keys(sessionStorage).forEach(key => {
        console.log(`${key}:`, sessionStorage.getItem(key));
    });

    loadCustomerAndCartData(); // Load customer and cart data when the page loads

    // Track external influences that reset sessionStorage
    window.addEventListener("storage", (event) => {
        if (event.key === "cartData") {
            console.log("Session storage cartData changed externally:", JSON.parse(decodeURIComponent(event.newValue || "[]")));
        }
    });

    // Add an additional periodic log to check if sessionStorage is cleared externally
    setInterval(() => {
        console.log("Periodic check: Current sessionStorage contents:");
        Object.keys(sessionStorage).forEach(key => {
            console.log(`${key}:`, sessionStorage.getItem(key));
        });
    }, 10000); // Log session storage every 10 seconds
});



// Define saveSessionData function before it's used
function saveSessionData() {
    const sessionData = {
        paymentMethod: paymentMethodDropdown.value,
        name: document.getElementById("name")?.value.trim(),
        city: document.getElementById("city")?.value.trim(),
        phone: document.getElementById("phone")?.value.trim(),
        email: document.getElementById("email")?.value.trim(),
        address: document.getElementById("address")?.value.trim(),
        specialInstructions: document.getElementById("specialInstructions")?.value.trim()
    };
    sessionStorage.setItem(sessionDataKey, encodeURIComponent(JSON.stringify(sessionData)));
    document.cookie = `sessionData=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; SameSite=None; Secure; max-age=604800`; // 7 days expiration
    console.log("Session data saved in sessionStorage and cookies:", sessionData);
}

// Extract subdomain from the current hostname
let domainName = window.location.hostname.split('.')[0].toLowerCase();

// Check if it's a known subdomain; if not, set a default or handle it gracefully
if (!areaMinimum.hasOwnProperty(domainName)) {
    console.log(`Unknown: ${domainName}, using default.`);
    domainName = '';
}

const MINIMUM_ORDER_AMOUNT = areaMinimum[domainName] || 60;
console.log(`Subdomain: ${domainName}, Minimum Order: $${MINIMUM_ORDER_AMOUNT}`);

const paymentMethodDropdown = document.getElementById("paymentMethod");
const customerFormFields = ["name", "city", "phone", "email", "address", "specialInstructions", "paymentMethod"];
const sessionDataKey = "sessionData";

// Add event listeners for all input fields to save session data dynamically
customerFormFields.forEach(fieldId => {
    const inputField = document.getElementById(fieldId);
    if (inputField) {
        inputField.addEventListener('input', () => {
            saveSessionData();  // Save session data whenever the user types
        });
    }
});

// Event listener for payment method changes
if (paymentMethodDropdown) {
    paymentMethodDropdown.addEventListener("change", (event) => {
        handlePaymentMethodChange(event.target.value);
        saveSessionData(); // Now save session data here
    });
    handlePaymentMethodChange(paymentMethodDropdown.value);
}

console.log("Payment method logic applied!");

// Page Load Event
document.addEventListener("DOMContentLoaded", () => {
    const consentStatus = getCookie("cookieconsent_status");
    const cartDataKey = "cartData";
    const selectedItemsList = document.getElementById("selectedItemsList");

    if (consentStatus !== "allow") {
        console.log("Cookies not allowed. Clearing session data.");
        sessionStorage.removeItem(cartDataKey);
        updateCartUI([]);  // Ensure the UI shows "No items selected yet."
    } else {
        const cookieCartData = getCookie(cartDataKey);
        if (cookieCartData) {
            sessionStorage.setItem(cartDataKey, cookieCartData);
        }
    }

    let initialCartData = sessionStorage.getItem(cartDataKey);
    try {
        initialCartData = initialCartData ? JSON.parse(decodeURIComponent(initialCartData)) : [];
    } catch (e) {
        console.error("Failed to parse initial cart data:", e);
        initialCartData = [];
    }
    updateCartUI(initialCartData);

    const checkoutButton = document.getElementById("checkoutButton");
    const totalDisplay = document.getElementById("total");
    const cartForm = document.getElementById("cartForm");

    if (!totalDisplay || !cartForm) {
        console.error("Total display or cart form element not found. Cannot proceed with checkout.");
        return;
    }

    if (checkoutButton) {
        checkoutButton.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                const checkedItems = cartForm.querySelectorAll('input[name="item"]:checked');
                const items = Array.from(checkedItems).map(item => {
                    const quantityInput = item.closest(".item").querySelector(".quantity");
                    const quantity = parseInt(quantityInput.value, 10) || 1;
                    const [itemName, itemCost] = item.value.split('|');
                    return { name: itemName, quantity, price: parseFloat(itemCost) };
                });

                const name = document.getElementById("name")?.value.trim() || "";
                const city = document.getElementById("city")?.value.trim() || "";
                const phone = document.getElementById("phone")?.value.trim() || "";
                const email = document.getElementById("email")?.value.trim() || "";
                const address = document.getElementById("address")?.value.trim() || "";
                const total = totalDisplay.textContent.trim();
                const paymentMethod = paymentMethodDropdown.value;
                const specialInstructions = document.getElementById("specialInstructions")?.value.trim() || "";
                const cardNumber = document.getElementById("cardNumber")?.value.trim() || "";
                const nameOnCard = document.getElementById("nameOnCard")?.value.trim() || "";
                const expiryDate = document.getElementById("expiryDate")?.value.trim() || "";
                const cvv = document.getElementById("cvv")?.value.trim() || "";
                const cardZip = document.getElementById("cardZip")?.value.trim() || "";

                if (!items.length) throw new Error("No items selected!");
                if (!name || !city || !phone || !email || !address) {
                    throw new Error("All fields must be filled out!");
                }
                if (!paymentMethod) throw new Error("Payment method is required!");

                const creditCard = {
                    cardNumber,
                    nameOnCard,
                    expiryDate,
                    cvv,
                    cardZip
                };

                const payload = {
                    items,
                    name,
                    city,
                    phone,
                    email,
                    address,
                    total,
                    paymentMethod,
                    creditCard,
                    specialInstructions
                };

                console.log("Payload being sent:", payload);
                const response = await fetch("https://eft3wrtpad.execute-api.us-west-2.amazonaws.com/prod/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error from API:", errorText);
                    throw new Error("Failed to submit order.");
                }

                alert("Order submitted successfully!");
            } catch (error) {
                console.error("Error during checkout:", error);
                alert(error.message);
            }
        });
    }

    document.querySelectorAll(".copy-address").forEach(element => {
        element.addEventListener("click", () => {
            const address = element.getAttribute("data-address");

            navigator.clipboard.writeText(address).then(() => {
                const copyMessage = document.getElementById("copyMessage");
                copyMessage.textContent = `Copied: ${address}`;
                copyMessage.style.display = "block";

                setTimeout(() => {
                    copyMessage.style.display = "none";
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy address:", err);
            });
        });
    });

    const minOrderMessageElement = document.getElementById("minOrderMessage");
    if (minOrderMessageElement) {
        minOrderMessageElement.textContent = `Minimum order is $${MINIMUM_ORDER_AMOUNT}.`;
    }

    const categoryHeadings = document.querySelectorAll('[data-toggle="accordion"]');
    categoryHeadings.forEach(heading => {
        heading.addEventListener("click", () => {
            const content = heading.nextElementSibling;
            if (content.classList.contains("hidden")) {
                content.classList.remove("hidden");
                content.style.maxHeight = `${content.scrollHeight}px`;
            } else {
                content.classList.add("hidden");
                content.style.maxHeight = "0";
            }
        });
    });

    const hostname = window.location.hostname.split('.')[0].toLowerCase();
    const cityName = cityMap[hostname] || "";
    const cityElement = document.getElementById("city");

    if (cityElement) {
        cityElement.value = cityName;
        console.log(`City input value set to: ${cityElement.value}`);
    } else {
        console.error("City input field not found.");
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

// Helper function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=None; Secure";
}

//// Function to switch session data to cookies
//function switchToCookies() {
    //const sessionData = sessionStorage.getItem(sessionDataKey);
    //if (sessionData) {
        //try {
            //const decodedData = decodeURIComponent(sessionData);
            //const parsedData = JSON.parse(decodedData);
            //document.cookie = `sessionData=${encodeURIComponent(JSON.stringify(parsedData))}; path=/; SameSite=None; Secure; max-age=604800`; // 7 days
            //console.log("Customer info moved to cookies:", parsedData);
        //} catch (error) {
            //console.error("Failed to parse session data from sessionStorage:", error);
        //}
    //}
//}


//function loadCustomerAndCartData() {
    //let customerData;
    //let cartData;

    //// Try loading customer data from cookies
    //const sessionDataCookie = document.cookie.split('; ').find(row => row.startsWith('sessionData='));
    //if (sessionDataCookie) {
        //try {
            //customerData = JSON.parse(decodeURIComponent(sessionDataCookie.split('=')[1]));
            //console.log("Customer data loaded from cookies:", customerData);
        //} catch (error) {
            //console.error("Error parsing customer data from cookies:", error);
        //}
    //}

    //// Fallback to session storage if no customer data in cookies
    //if (!customerData) {
        //const sessionData = sessionStorage.getItem("sessionData");
        //if (sessionData) {
            //try {
                //customerData = JSON.parse(decodeURIComponent(sessionData));
                //console.log("Customer data loaded from session storage:", customerData);
            //} catch (error) {
                //console.error("Error parsing customer data from session storage:", error);
            //}
        //}
    //}

    //// Populate form fields if customer data exists
    //if (customerData) {
        //Object.keys(customerData).forEach(key => {
            //const inputField = document.getElementById(key);
            //if (inputField) {
                //inputField.value = customerData[key];
            //} else {
                //console.warn(`Input field with id '${key}' not found.`);
            //}
        //});
    //} else {
        //console.log("No customer data found.");
    //}

    //// Try loading cart data from cookies
    //const cartDataCookie = document.cookie.split('; ').find(row => row.startsWith('cartData='));
    //if (cartDataCookie) {
        //try {
            //cartData = JSON.parse(decodeURIComponent(cartDataCookie.split('=')[1]));
            //console.log("Cart data loaded from cookies:", cartData);
        //} catch (error) {
            //console.error("Error parsing cart data from cookies:", error);
        //}
    //}

    //// Fallback to session storage if no cart data in cookies
    //if (!cartData) {
        //const cartDataSession = sessionStorage.getItem("cartData");
        //if (cartDataSession) {
            //try {
                //cartData = JSON.parse(decodeURIComponent(cartDataSession));
                //console.log("Cart data loaded from session storage:", cartData);
            //} catch (error) {
                //console.error("Error parsing cart data from session storage:", error);
            //}
        //}
    //}

    //// Update the cart UI if cart data exists and save back to session storage if cookies are denied
    //if (cartData && cartData.length > 0) {
        //console.log("Updating session storage with current cart data:", cartData);
        //sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData))); // Ensure it is saved

        //updateCartUI(cartData);

        //cartData.forEach(item => {
            //const productCheckbox = document.querySelector(`input[name="item"][value="${item.name}|${item.price}"]`);
            //if (productCheckbox) {
                //const itemLabel = productCheckbox.closest(".item");
                //itemLabel.classList.add("selected"); // Add highlight class

                //let removeButton = itemLabel.querySelector(".remove-item");
                //if (!removeButton) {
                    //removeButton = document.createElement("span");
                    //removeButton.textContent = "x";
                    //removeButton.classList.add("remove-item");
                    //removeButton.dataset.productName = item.name;
                    //itemLabel.appendChild(removeButton);
                //}
                //console.log(`Added remove button for ${item.name}.`);
            //}
        //});

        //// Save cart data to sessionData for consistency
        //customerData = customerData || {};
        //customerData.cartData = cartData;
        //sessionStorage.setItem("sessionData", encodeURIComponent(JSON.stringify(customerData)));
        //console.log("Cart data saved to session storage within sessionData:", customerData);
    //} else {
        //console.log("No cart data found. Initializing an empty cart in session storage.");
        //sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify([]))); // Ensure cartData is initialized as an empty array
    //}
//}

//function addItemToCart(productName, price, quantity) {
    //console.log(`Adding item to cart: ${productName}, Price: ${price}, Quantity: ${quantity}`);
    //let cartData = sessionStorage.getItem("cartData");
    //try {
        //cartData = cartData ? JSON.parse(decodeURIComponent(cartData)) : [];
    //} catch (error) {
        //console.error("Failed to parse cart data from sessionStorage:", error);
        //cartData = [];
    //}

    //const existingItem = cartData.find(item => item.name === productName);
    //if (existingItem) {
        //existingItem.quantity += quantity;
        //console.log(`Updated quantity for ${productName}: ${existingItem.quantity}`);
    //} else {
        //cartData.push({ name: productName, price, quantity });
        //console.log(`Added new item to cart: ${productName}`);
    //}

    //sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    //console.log("Cart data after adding item:", cartData);

    //// Update sessionData with updated cart info for consistency
    //let sessionData = sessionStorage.getItem("sessionData");
    //try {
        //sessionData = sessionData ? JSON.parse(decodeURIComponent(sessionData)) : {};
    //} catch (error) {
        //console.error("Failed to parse sessionData:", error);
        //sessionData = {};
    //}
    //sessionData.cartData = cartData;
    //sessionStorage.setItem("sessionData", encodeURIComponent(JSON.stringify(sessionData)));
    //console.log("Updated sessionData with cart info:", sessionData);

    //updateCartUI(cartData);

    //// Debug: Verify session storage persists across reloads
    //const sessionCartCheck = sessionStorage.getItem("cartData");
    //if (sessionCartCheck) {
        //console.log("Session storage cart data after add:", JSON.parse(decodeURIComponent(sessionCartCheck)));
    //} else {
        //console.error("Session storage cart data is missing after add!");
    //}
//}

//window.addEventListener("DOMContentLoaded", () => {
    //console.log("DOMContentLoaded event triggered: Initializing customer and cart data loading.");
    //loadCustomerAndCartData(); // Load customer and cart data when the page loads

    //// Check if sessionStorage is cleared externally by any plugin or script
    //setInterval(() => {
        //const currentCartData = sessionStorage.getItem("cartData");
        //if (!currentCartData) {
            //console.warn("Session storage cartData is empty during page session. It may have been cleared externally.");
        //}
    //}, 5000); // Check every 5 seconds

    //// Track external influences that reset sessionStorage
    //window.addEventListener("storage", (event) => {
        //if (event.key === "cartData") {
            //console.log("Session storage cartData changed externally:", JSON.parse(decodeURIComponent(event.newValue || "[]")));
        //}
    //});

    //// Ensure this function is called after adding items
    //document.querySelectorAll('label.item input[type="checkbox"]').forEach(checkbox => {
        //checkbox.addEventListener('change', function () {
            //const itemLabel = this.closest('.item');
            //const productName = this.value.split('|')[0];
            //const price = parseFloat(this.value.split('|')[1]) || 0;
            //const quantityInput = itemLabel.querySelector('.quantity');
            //const quantity = parseInt(quantityInput?.value, 10) || 1;

            //if (this.checked) {
                //addItemToCart(productName, price, quantity);
            //} else {
                //console.log(`Removing ${productName} from cart.`);
                //removeItemFromCart(productName);
            //}
        //});
    //});
//});



window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event triggered: Initializing customer and cart data loading.");

    // Add detailed logs at the start of loadCustomerAndCartData
    console.log("Debug: Current sessionStorage keys and values at page load:");
    Object.keys(sessionStorage).forEach(key => {
        try {
            const value = sessionStorage.getItem(key);
            const decodedValue = value ? JSON.parse(decodeURIComponent(value)) : value;
            console.log(`${key}:`, decodedValue);
        } catch (e) {
            console.error(`Error decoding sessionStorage value for key ${key}:`, e);
        }
    });

    loadCustomerAndCartData(); // Load customer and cart data when the page loads

    // Track external influences that reset sessionStorage
    window.addEventListener("storage", (event) => {
        if (event.key === "cartData") {
            try {
                const decodedCartData = event.newValue ? JSON.parse(decodeURIComponent(event.newValue)) : [];
                console.log("Session storage cartData changed externally:", decodedCartData);
            } catch (e) {
                console.error("Error decoding external sessionStorage event value for cartData:", e);
            }
        }
    });

    // Add an additional periodic log to check if sessionStorage is cleared externally
    setInterval(() => {
        console.log("Periodic check: Current sessionStorage contents:");
        Object.keys(sessionStorage).forEach(key => {
            try {
                const value = sessionStorage.getItem(key);
                const decodedValue = value ? JSON.parse(decodeURIComponent(value)) : value;
                console.log(`${key}:`, decodedValue);
            } catch (e) {
                console.error(`Error decoding sessionStorage value during periodic check for key ${key}:`, e);
            }
        });
    }, 10000); // Log session storage every 10 seconds
});

