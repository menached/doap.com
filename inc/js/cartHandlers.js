export function loadCartDataFromSession() {
    const sessionCartData = sessionStorage.getItem("cartData");
    let cartData = [];

    if (sessionCartData) {
        try {
            cartData = JSON.parse(decodeURIComponent(sessionCartData));
            console.log("Loaded cart data from session storage:", cartData);
            updateCartUI(cartData);
        } catch (error) {
            console.error("Error parsing cart data from session storage:", error);
        }
    } else {
        console.log("No cart data found in session storage.");
    }
}

export function updateCartUI(cartData) {
    const cartContainer = document.getElementById("cartItems");
    if (!cartContainer) return;

    cartContainer.innerHTML = cartData.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>${item.quantity}</span>
        </div>
    `).join("");

    console.log("Cart UI updated:", cartData);
}

export function initializeCartListeners() {
    document.addEventListener("cartUpdated", () => {
        const cartData = JSON.parse(decodeURIComponent(sessionStorage.getItem("cartData"))) || [];
        console.log("Cart event triggered, saving to session:", cartData);
        sessionStorage.setItem("cartData", encodeURIComponent(JSON.stringify(cartData)));
    });
}

