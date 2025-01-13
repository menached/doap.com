// sessionUtils.js

export function setSessionData(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}


export function getSessionData(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(decodeURIComponent(data)) : null;  // Decode the URL-encoded string before parsing as JSON.
}

//export function getSessionData(key) {
    //const data = sessionStorage.getItem(key);
    //return data ? JSON.parse(data) : null;
//}

export function updateCustomerInfo() {
    const customerData = {
        name: document.getElementById("name")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        email: document.getElementById("email")?.value || "",
        address: document.getElementById("address")?.value || "",
        city: document.getElementById("city")?.value || "",
        specialInstructions: document.getElementById("specialInstructions")?.value || ""
    };

    setSessionData("customerInfo", customerData);
    console.log("Customer info updated in session storage:", customerData);

    const cookieConsent = getCookie("cookieconsent_status");
    if (cookieConsent === "allow") {
        const encodedData = encodeURIComponent(JSON.stringify(customerData));
        document.cookie = `sessionData=${encodedData}; path=/; SameSite=None; Secure; max-age=604800`;
        console.log("Customer info updated in cookies:", customerData);
    }
}

