console.log("shop.js started loading");

$(document).ready(function () {
    function showFlyingText(message, isRemoved = false) {
        console.log("Flying text message:", message);

        const flyingText = $('<div class="flying-text"></div>')
            .text(message)
            .css({
                position: 'fixed',  // Stay relative to the viewport
                left: '50%',
                top: '50%',  // Vertically centered in the viewport
                transform: 'translate(-50%, -50%)',  // Center based on its size
                zIndex: 9999,  // Ensure it appears above all other elements
                padding: '20px 40px',
                borderRadius: '10px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: isRemoved ? '#dc3545' : '#28a745',  // Red for remove, green for add
                border: '2px solid black',  // Add a debug border to make it obvious
            });

        $('body').append(flyingText);

        setTimeout(() => {
            flyingText.fadeOut(500, () => flyingText.remove());
        }, 3000);  // Remove after 3 seconds
    }

    window.addEventListener('scroll', () => {
        const flyingTextElement = document.querySelector('.flying-text');
        if (flyingTextElement) {
            const windowHeight = window.innerHeight;
            flyingTextElement.style.top = `${windowHeight / 2}px`;  // Recenter based on viewport height
        }
    });


    // Example usage: Add click events to your items
    $('.item').off('click').on('click', function () {
        const checkbox = $(this).find('input[type="checkbox"]');
        const isChecked = checkbox.prop('checked');
        checkbox.prop('checked', !isChecked); // Toggle the checkbox

        // Show flying text
        if (!isChecked) {
            showNotification('Added to Cart');
        } else {
            showNotification('Removed from Cart');
        }
    });

    $(document).on('click', '.item', function () {
        const checkbox = $(this).find('input[type="checkbox"]');
        const isChecked = checkbox.prop('checked');
        checkbox.prop('checked', !isChecked);

        if (!isChecked) {
            showNotification('Added to Cart');
        } else {
            showNotification('Removed from Cart');
        }
    });

    document.querySelectorAll('.item img').forEach(img => {
        img.addEventListener('click', function () {
            const imgSrc = this.src; // Get the image source
            console.log("Image src:", imgSrc); // Log the source of the clicked image
        });
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



document.addEventListener("DOMContentLoaded", () => {

    // Remove "Call us at" from the phone number
    const phone = document.querySelector(".phone-number");
    if (phone) {
        phone.textContent = phone.textContent.replace(/Call us at\s*/, '');
    }

    // Checkout button logic
    const checkoutButton = document.getElementById("checkoutButton");
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
                const total = totalDisplay.textContent;
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


//console.log("Hovered:", this.querySelector('.thumbnail').getAttribute('alt'));

document.addEventListener('mouseover', function (event) {
    const thumbnail = event.target.closest('.thumbnail');
    if (thumbnail) {
        console.log("Hovered:", thumbnail.getAttribute('alt'));
    }
});



//console.log("Image src:", imgSrc);

function showNotification(message) {
    const popup = document.createElement('div');
    popup.className = 'popup success visible flying-text'; // Add flying-text class for consistency
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

//function showNotification(message) {
    //const popup = document.createElement('div');
    //popup.className = 'popup success visible';
    //popup.textContent = message;
    //document.body.appendChild(popup);
    //setTimeout(() => popup.remove(), 3000);
//}


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

    //// Function to check if the cart has any items
    //function toggleCartVisibility() {
        //const hasItems = selectedItemsList.querySelectorAll('li').length > 0 &&
                         //selectedItemsList.querySelector('li').textContent !== 'No items selected yet.';
        //cartContainer.style.display = hasItems ? 'block' : 'none';
    //}
    function toggleCartVisibility() {
        const hasRealItems = Array.from(selectedItemsList.querySelectorAll('li')).some(li =>
            !li.textContent.includes('No items selected yet.')
        );
        cartContainer.style.display = hasRealItems ? 'block' : 'none';
    }

    document.querySelectorAll('.product input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Find the parent product element
            const productElement = checkbox.closest('.product');
            if (!productElement) {
                console.error('Error: .product element not found.');
                return;
            }

            // Find the item-details within the product
            const itemDetails = productElement.querySelector('.item-details');
            if (!itemDetails) {
                console.error('Error: .item-details element not found.');
                return;
            }

            const itemName = itemDetails.querySelector('.item-title')?.textContent || 'Unknown Item';
            const itemPrice = parseFloat(itemDetails.querySelector('.item-price')?.textContent.replace('$', '') || 0);
            const quantityInput = itemDetails.querySelector('.quantity');
            const quantity = parseInt(quantityInput?.value, 10) || 1;

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
