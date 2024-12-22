console.log("shop.js started loading");
document.addEventListener("DOMContentLoaded", () => {


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


    // Map subdomains to minimum order amounts
    const areaMinimum = {
        alamo: 40,
        burlingame: 120,
        campbell: 120,
        concord: 50,
        danville: 40,
        dublin: 40,
        lafayette: 50,
        livermore: 50,
        orinda: 60,
        pittsburg: 75,
        pleasanthill: 60,
        sanramon: 40,
        walnutcreek: 50
    };

    // Extract the subdomain
    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();
    const cityNameElement = document.getElementById("cityName");

    // Determine the minimum order amount based on the subdomain, default to 60
    const MINIMUM_ORDER_AMOUNT = areaMinimum[domainName] || 60;

    // Log the minimum order for debugging
    console.log(`Subdomain: ${domainName}, Minimum Order: $${MINIMUM_ORDER_AMOUNT}`);

    // Default cityName for single-word subdomains
    let cityName = domainName.charAt(0).toUpperCase() + domainName.slice(1).toLowerCase();

    // Map of subdomains to full city names
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

    // Map of subdomains to phone numbers
    const phoneMap = {
        pleasanthill: "925-891-7800",
        walnutcreek: "925-464-2075",
        castrovalley: "925-263-9209",
        sanramon: "925-365-6030",
        discoverybay: "925-891-7800",
        alamo: "925-553-4710",
        antioch: "925-891-7800",
        dublin: "925-587-6777",
        lafayette: "925-871-1333",
        pleasanton: "925-587-6777",
        danville: "925-725-6920",
        concord: "925-412-4880",
        livermore: "925-718-6181",
        orinda: "925-891-7800"
    };

    // Update cityName if the domain exists in the map
    if (cityMap[domainName]) {
        cityName = cityMap[domainName];
    } else if (hostname === "www.doap.com" || hostname === "doap.com") {
        cityName = "Norcal Doap";
        // Hide all tabs and their contents
        const tabs = document.querySelectorAll(".tab, .tab-content");
        tabs.forEach(tab => tab.style.display = "none");

        // Hide cart and payment method sections
        const cartSection = document.querySelector(".cart-section");
        const paymentSection = document.querySelector(".payment-section");
        const customerInfo = document.querySelector(".customer-info");

        if (cartSection) cartSection.style.display = "none";
        if (paymentSection) paymentSection.style.display = "none";
        if (customerInfo) customerInfo.style.display = "none";

        // Optionally set a message for these pages
        const mainContainer = document.body;
        const message = document.createElement("div");
        //message.textContent = "Welcome to Norcal Doap!";
        message.style.cssText = "text-align: center; font-size: 2rem; margin-top: 20px; font-weight: bold; font-family: Marvel;";
        mainContainer.appendChild(message);

        console.log("Tabs, cart, and payment methods are hidden for www and doap.com.");
    }

    // Get the phone number based on the subdomain, default to the general number
    const defaultPhoneNumber = "833-289-3627";
    const phoneNumber = phoneMap[domainName] || defaultPhoneNumber;

    const defaultDescription = `${cityName} DOAP Delivers Organic Awesome Pot to ${cityName} and surrounding cities 9-9 daily.`;

    // Update the page title
    //document.title = `${cityName} Doap`;


    // Check if the hostname is not 'www.doap.com'
    if (window.location.hostname !== "www.doap.com") {
        // Update the page title
        document.title = `${cityName} Doap`;
    } else {
        console.log("Skipped updating the page title because the hostname is www.doap.com");
    }



    // Match H1 to Page Title
    const mainH1 = document.querySelector("h1");
    if (mainH1) {
        mainH1.textContent = document.title;
    }
    
    //// Update the header text dynamically
    //const cityNameElement = document.getElementById("cityName");
    //if (cityNameElement) {
        //cityNameElement.textContent = cityName;
    //}

    if (cityNameElement) {
        if (hostname === "www.doap.com" || hostname === "doap.com") {
            // Set the site heading explicitly to "Doap"
            cityNameElement.textContent = "Doap";
            console.log("Updated site heading to 'Doap' for www.doap.com.");
        } else {
            console.log("Preserved city name:", cityNameElement.textContent);
        }
    } else {
        console.warn("Element with id 'cityName' not found.");
    }
        // Update the phone number dynamically in the header
    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

    // Update logo link
    const logoLink = document.querySelector(".header a");
    if (logoLink) {
        logoLink.href = `https://${domainName}.doap.com/simple.php`;
        logoLink.title = `Call ${cityName} Doap!`;
    }
    // Update header text
    const headerLink = document.querySelector("h1 a");
    if (headerLink) {
        headerLink.href = `https://${domainName}.doap.com/simple.php`;
        headerLink.title = `Call ${cityName} Doap!`;
    }

    //// Set up Open Graph and Twitter meta tags
    //const ogMetaTags = [
        //{ property: "og:title", content: `${cityName} Doap - Call us today!` },
        //{ property: "og:type", content: "website" },
        //{ property: "og:url", content: `https://${hostname}/simple.php` },
        //{ property: "og:description", content: defaultDescription },
        //{ property: "og:image", content: `https://${subdomain}.doap.com/${subdomain}doapbanner.webp` },
        //{ name: "twitter:card", content: "summary_large_image" },
        //{ name: "twitter:image", content: `https://${subdomain}.doap.com/${subdomain}doapbanner.webp` },
        //{ name: "twitter:title", content: `${cityName} Doap - Call us today!` },
        //{ name: "twitter:description", content: defaultDescription },
        //{ name: "twitter:site", content: "@danvilledoap" }
    //];

    //// Remove existing meta tags
    //document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(tag => tag.remove());

    //// Append new meta tags
    //ogMetaTags.forEach(tagData => {
        //const tag = document.createElement("meta");
        //Object.keys(tagData).forEach(key => {
            //tag.setAttribute(key, tagData[key]);
        //});
        //document.head.appendChild(tag);
        //console.log("Added meta tag:", tagData.property || tagData.name);
    //});

    //console.log("Open Graph and Twitter meta tags added successfully!");

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
                    creditCard
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


console.log("shop.js loaded completely");
