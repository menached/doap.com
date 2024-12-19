// cart.js: Complete, Fixed Version
console.log("cart.js started loading");
document.addEventListener("DOMContentLoaded", () => {

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

    const hostname = window.location.hostname;
    const domainName = hostname.split('.')[0].toLowerCase();
    const MINIMUM_ORDER_AMOUNT = areaMinimum[domainName] || 60;
    console.log(`Subdomain: ${domainName}, Minimum Order: $${MINIMUM_ORDER_AMOUNT}`);

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

    let cityName = cityMap[domainName] || "Norcal Doap";
    document.title = `${cityName} Doap`;
    const cityNameElement = document.getElementById("cityName");
    if (cityNameElement) cityNameElement.textContent = cityName;

    const phoneNumber = phoneMap[domainName] || "833-289-3627";
    const phoneNumberElement = document.querySelector(".phone-number");
    if (phoneNumberElement) {
        phoneNumberElement.textContent = phoneNumber;
        phoneNumberElement.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }

    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(tc => tc.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab)?.classList.add("active");
        });
    });

    const cartForm = document.getElementById("cartForm");
    const totalDisplay = document.getElementById("total");
    const selectedItemsList = document.getElementById("selectedItemsList");

    const updateCart = () => {
        let total = 0;
        const items = Array.from(cartForm.querySelectorAll('input[name="item"]:checked')).map(input => {
            const quantity = parseInt(input.closest(".item").querySelector(".quantity").value, 10) || 1;
            const [name, price] = input.value.split('|');
            const cost = quantity * parseFloat(price);
            total += cost;
            return `<li>${name} (x${quantity}) - $${cost.toFixed(2)}</li>`;
        });

        selectedItemsList.innerHTML = items.length ? items.join('') : '<li>No items selected yet.</li>';
        totalDisplay.textContent = `$${total.toFixed(2)}`;
    };

    cartForm?.addEventListener("change", updateCart);
    cartForm?.addEventListener("input", event => {
        if (event.target.classList.contains("quantity")) updateCart();
    });

    const checkoutButton = document.getElementById("checkoutButton");
    checkoutButton?.addEventListener("click", async event => {
        event.preventDefault();
        try {
            const items = Array.from(cartForm.querySelectorAll('input[name="item"]:checked')).map(input => {
                const quantity = parseInt(input.closest(".item").querySelector(".quantity").value, 10) || 1;
                const [name, price] = input.value.split('|');
                return { name, quantity, price: parseFloat(price) };
            });
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const email = document.getElementById("email").value;
            const address = document.getElementById("address").value;
            const city = document.getElementById("city").value;
            const paymentMethod = document.getElementById("paymentMethod").value;

            if (!items.length || !name || !phone || !email || !address || !city || !paymentMethod) {
                throw new Error("All fields and at least one item are required.");
            }

            const payload = { items, name, phone, email, address, city, paymentMethod };
            console.log("Payload:", payload);

            const response = await fetch("/submit-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to submit order.");

            alert("Order submitted successfully!");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    console.log("cart.js loaded completely");
});

