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

