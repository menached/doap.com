// Function to update the cart UI
export function updateCartUI(cartData) {
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

