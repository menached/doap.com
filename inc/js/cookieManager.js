// cookieManager.js
export function setCookie(name, value, days) {
    if (!value || JSON.stringify(value) === "{}") {
        console.warn(`Skipped setting ${name} cookie: value is null or empty.`);
        return;
    }
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=/; SameSite=None; Secure;`;
}

export function getCookie(name) {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = decodeURIComponent(parts.pop().split(";").shift());
            // Attempt to parse as JSON; if it fails, return the plain string.
            try {
                return JSON.parse(cookieValue);
            } catch (error) {
                return cookieValue;  // Return as plain string if not valid JSON.
            }
        }
        return null;
    } catch (error) {
        console.error(`Error retrieving cookie ${name}:`, error);
        return null;
    }
}

export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;`;
}

