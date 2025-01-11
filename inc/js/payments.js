// Payment method handling

// Configuration: Map subdomains to minimum order amounts, city names, and phone numbers
const areaMinimum = {
    alamo: 40, burlingame: 120, campbell: 120, concord: 50, danville: 40, dublin: 40,
    lafayette: 50, livermore: 50, orinda: 60, pittsburg: 75, pleasanthill: 60,
    sanramon: 40, walnutcreek: 50
};

// Extract subdomain from the current hostname
let domainName = window.location.hostname.split('.')[0].toLowerCase();

// Check if it's a known subdomain; if not, set a default or handle it gracefully
if (!areaMinimum.hasOwnProperty(domainName)) {
    console.log(`Unknown: ${domainName}, using www as default domain name.`);
    domainName = '';
}

const MINIMUM_ORDER_AMOUNT = areaMinimum[domainName] || 60;
console.log(`Subdomain: ${domainName}, Minimum Order: $${MINIMUM_ORDER_AMOUNT}`);

const paymentMethodDropdown = document.getElementById("paymentMethod");
const creditCardForm = document.getElementById("creditCardForm");
const cryptoWallets = document.getElementById("cryptoWallets");
const generalHelp = document.getElementById("generalHelp");

const handlePaymentMethodChange = (selectedMethod) => {
    // Hide all sections initially
    if (creditCardForm) creditCardForm.style.display = "none";
    if (cryptoWallets) cryptoWallets.style.display = "none";
    if (generalHelp) generalHelp.style.display = "none";

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
            <p>Please have the exact cash amount ready for a smooth delivery process. Check your email after placing your order to verify details.</p>
        `;
    } else if (["zelle", "venmo", "paypal", "cashapp"].includes(selectedMethod)) {
        generalHelp.style.display = "block";
        generalHelp.innerHTML = `
            <h3 style="display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fas fa-phone-alt"></i> Payment Instructions</span>
                <i class="fas fa-question-circle" style="color: green; cursor: pointer;" title="Need more help? Click here!"></i>
            </h3>
            <p>After placing your order, please check your email for further instructions on completing your payment. Feel free to call us at <strong>(833) 289-3627</strong> for assistance.</p>
        `;
    }
};

if (paymentMethodDropdown) {
    paymentMethodDropdown.addEventListener("change", (event) => {
        handlePaymentMethodChange(event.target.value);
    });

    // Trigger default behavior on page load to show the correct form if any default value is set
    handlePaymentMethodChange(paymentMethodDropdown.value);
}

console.log("Payment method logic applied!");


// Page Load Event

document.addEventListener("DOMContentLoaded", () => {
    // Clear session data if cookies are declined
    const consentStatus = getCookie("cookieconsent_status");
    const cartDataKey = "cartData";
    const selectedItemsList = document.getElementById("selectedItemsList");

    if (consentStatus !== "allow") {
        console.log("Cookies not allowed. Clearing session data.");
        sessionStorage.removeItem(cartDataKey);
        updateCartUI([]);  // Ensure the UI shows "No items selected yet."
    } else {
        // Load cart data from cookies if allowed
        const cookieCartData = getCookie(cartDataKey);
        if (cookieCartData) {
            sessionStorage.setItem(cartDataKey, cookieCartData);
        }
    }

    // Function to update the cart UI
    function updateCartUI(cartData) {
        if (!Array.isArray(cartData)) {
            cartData = [];
        }
        const totalDisplay = document.getElementById("total");
        let total = 0;

        const cartItemsHTML = cartData.map(item => {
            const cost = item.price * item.quantity;
            total += cost;
            
            // Highlight the corresponding product checkbox and show "Added to Cart"
            const productCheckbox = document.querySelector(`input[name="item"][value="${item.name}|${item.price}"]`);
            if (productCheckbox) {
                productCheckbox.checked = true;
                const itemLabel = productCheckbox.closest(".item");
                itemLabel.classList.add("selected");  // Add highlighted border class
                const addedText = itemLabel.querySelector(".added-to-cart");
                if (addedText) {
                    addedText.style.display = "block";  // Show "Added to Cart"
                }
            }

            return `<li>${item.name} (x${item.quantity}) - $${cost.toFixed(2)}</li>`;
        }).join("");

        selectedItemsList.innerHTML = cartItemsHTML || '<li>No items selected yet.</li>';
        if (totalDisplay) {
            totalDisplay.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Load initial cart data on page load
    const initialCartData = JSON.parse(sessionStorage.getItem(cartDataKey)) || [];
    updateCartUI(initialCartData);

    // Checkout button logic
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

                const name = document.getElementById("name").value.trim();
                const city = document.getElementById("city").value.trim();
                const phone = document.getElementById("phone").value.trim();
                const email = document.getElementById("email").value.trim();
                const address = document.getElementById("address").value.trim();
                const total = totalDisplay.textContent.trim();
                const paymentMethod = paymentMethodDropdown.value;
                const nameOnCard = document.getElementById("nameOnCard")?.value.trim();
                const cardNumber = document.getElementById("cardNumber")?.value.trim();
                const expiryDate = document.getElementById("expiryDate")?.value.trim();
                const cvv = document.getElementById("cvv")?.value.trim();
                const cardZip = document.getElementById("cardZip")?.value.trim();
                const specialInstructions = document.getElementById("specialInstructions").value.trim();

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

    // Add click event listener to all addresses
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

    // Locate the minimum order message container
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

    // Subdomain city logic
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

    const hostname = window.location.hostname.split('.')[0].toLowerCase();  // Get subdomain
    const cityName = cityMap[hostname] || "";  // Leave blank if subdomain is not mapped
    const cityElement = document.getElementById("city");  // City input field

    if (cityElement) {
        cityElement.value = cityName;  // Set the city name directly (no "Doap" suffix)
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

