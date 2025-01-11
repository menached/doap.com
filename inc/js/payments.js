// Payment method handling

// Configuration: Map subdomains to minimum order amounts, city names, and phone numbers
const areaMinimum = {
    alamo: 40, burlingame: 120, campbell: 120, concord: 50, danville: 40, dublin: 40,
    lafayette: 50, livermore: 50, orinda: 60, pittsburg: 75, pleasanthill: 60,
    sanramon: 40, walnutcreek: 50
};

// Extract subdomain from the current hostname
let domainName = window.location.hostname.split('.')[0];

// Check if it's a known subdomain; if not, set a default or handle it gracefully
if (!areaMinimum.hasOwnProperty(domainName)) {
    console.log(`Unknown: ${domainName}, Using www as default domain name.`);
    domainName = 'www';
}

const MINIMUM_ORDER_AMOUNT = areaMinimum[domainName] || 60;
console.log(`Subdomain: ${domainName}, Minimum Order: $${MINIMUM_ORDER_AMOUNT}`);


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



document.addEventListener("DOMContentLoaded", () => {
    // Checkout button logic
    const checkoutButton = document.getElementById("checkoutButton");
    const totalDisplay = document.getElementById("total"); // Ensure totalDisplay is defined

    if (!totalDisplay) {
        console.error("Total display element not found. Cannot proceed with checkout.");
        return;
    }

    if (checkoutButton && cartForm) {
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
                const total = totalDisplay.textContent.trim(); // Retrieve total safely
                const paymentMethod = document.getElementById("paymentMethod").value;
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

            // Copy the address to the clipboard
            navigator.clipboard.writeText(address).then(() => {
                // Show confirmation message
                const copyMessage = document.getElementById("copyMessage");
                copyMessage.textContent = `Copied: ${address}`;
                copyMessage.style.display = "block";

                // Hide the message after 2 seconds
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
        // Replace static text with dynamic variable
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
});

