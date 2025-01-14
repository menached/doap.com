// sessionManager.js

export function setSessionData(key, value) {
    sessionStorage.setItem(key, encodeURIComponent(JSON.stringify(value))); // Encode before storing
}

export function getSessionData(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(decodeURIComponent(data)) : null;
}

//export function syncCookiesToSession(getCookie) {
    //const cartData = getCookie("cartData");
    //const siteData = getCookie("siteData");
    //const customerData = getCookie("customerData");

    //if (cartData) sessionStorage.setItem("cartData", decodeURIComponent(cartData));
    //if (siteData) sessionStorage.setItem("siteData", decodeURIComponent(siteData));
    //if (customerData) sessionStorage.setItem("customerData", decodeURIComponent(customerData));

    //console.log("Synchronized cookies to session.");
//}

