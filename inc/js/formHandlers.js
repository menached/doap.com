// Handles displaying different payment methods
export const handlePaymentMethodChange = (selectedMethod) => {
    const creditCardForm = document.getElementById("creditCardForm");
    const cryptoWallets = document.getElementById("cryptoWallets");
    const generalHelp = document.getElementById("generalHelp");

    if (creditCardForm) creditCardForm.style.display = "none";
    if (cryptoWallets) cryptoWallets.style.display = "none";
    if (generalHelp) generalHelp.style.display = "none";

    switch (selectedMethod) {
        case "credit-card":
            if (creditCardForm) creditCardForm.style.display = "block";
            break;
        case "crypto":
            if (cryptoWallets) cryptoWallets.style.display = "block";
            break;
        case "cash":
            if (generalHelp) {
                generalHelp.style.display = "block";
                generalHelp.innerHTML = `
                    <h3><i class="fas fa-phone-alt"></i> Cash on Delivery</h3>
                    <p>Please have the exact cash amount ready for a smooth delivery process.</p>
                `;
            }
            break;
        default:
            console.warn(`Unhandled payment method: ${selectedMethod}`);
    }
};

// Function to populate form fields
export function populateFormFields(data) {
    const formFields = ["name", "phone", "email", "address", "city", "specialInstructions", "paymentMethod"];
    formFields.forEach((fieldId) => {
        const inputField = document.getElementById(fieldId);
        if (inputField && data[fieldId]) {
            inputField.value = data[fieldId];
            console.log(`Populated ${fieldId} with value: ${data[fieldId]}`);
        }
    });
}

// Attach form listeners
export function initializeFormListeners() {
    const customerFormFields = ["name", "phone", "email", "address", "city", "specialInstructions", "paymentMethod"];

    customerFormFields.forEach(fieldId => {
        const inputField = document.getElementById(fieldId);
        if (inputField) {
            inputField.addEventListener('input', saveSessionData);  // Calls a shared function
        }
    });

    const paymentMethodDropdown = document.getElementById("paymentMethod");
    if (paymentMethodDropdown) {
        paymentMethodDropdown.addEventListener("change", (event) => {
            handlePaymentMethodChange(event.target.value);
            saveSessionData();
        });
    }
}

