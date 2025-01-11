export const handlePaymentMethodChange = (selectedMethod) => {
    if (creditCardForm) creditCardForm.style.display = "none";
    if (cryptoWallets) cryptoWallets.style.display = "none";
    if (generalHelp) generalHelp.style.display = "none";

    if (selectedMethod === "credit-card") {
        creditCardForm.style.display = "block";
    } else if (selectedMethod === "crypto") {
        cryptoWallets.style.display = "block";
    } else if (["cash"].includes(selectedMethod)) {
        generalHelp.style.display = "block";
        generalHelp.innerHTML = `
            <h3><i class="fas fa-phone-alt"></i> Cash on Delivery</h3>
            <p>Please have the exact cash amount ready for a smooth delivery process.</p>
        `;
    } else if (["zelle", "venmo", "paypal", "cashapp"].includes(selectedMethod)) {
        generalHelp.style.display = "block";
        generalHelp.innerHTML = `
            <h3><i class="fas fa-phone-alt"></i> Payment Instructions</h3>
            <p>After placing your order, check your email for further payment instructions.</p>
        `;
    }
};
