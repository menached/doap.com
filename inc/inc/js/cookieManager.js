export function setCookie(name, value, days = 7) {
    if (!value || typeof value !== "object") {
        console.warn(`Skipped setting ${name} cookie: value is invalid.`);
        return;
    }

    const expires = days
        ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}`
        : "";

    const isLocalhost = window.location.hostname === "localhost";
    const sameSite = isLocalhost ? "Lax" : "None"; // Use "Lax" for localhost
    const secure = isLocalhost ? "" : " Secure";  // Avoid "Secure" for localhost

    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=/; SameSite=${sameSite};${secure}`;
    console.log(`Cookie set: ${name}=${JSON.stringify(value)}, expires: ${expires}`);
}

export function getCookie(name) {
    const match = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
    if (!match) return null;

    try {
        return JSON.parse(decodeURIComponent(match[1]));
    } catch {
        return decodeURIComponent(match[1]); // Return plain string if not JSON
    }
}

export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;
    console.log(`Cookie deleted: ${name}`);
}

