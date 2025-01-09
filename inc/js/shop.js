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


document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.getAttribute('data-product-name');
            const price = this.getAttribute('data-price');
            const quantityInput = this.closest('.item-details').querySelector('.quantity');
            const quantity = parseInt(quantityInput.value, 10);

            fetch('/cart-handler.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName, price, quantity })
            }).then(response => response.json())
              .then(data => {
                  alert(data.message);  // Show success message
                  console.log("Cart:", data.cart);  // Log cart for debugging
              })
              .catch(error => console.error("Error:", error));
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



});

