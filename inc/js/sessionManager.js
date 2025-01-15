// sessionManager.js
export function setSessionData(key, value) {
    sessionStorage.setItem(key, encodeURIComponent(JSON.stringify(value)));
}

export function getSessionData(key) {
    const data = sessionStorage.getItem(key);
    try {
        return data ? JSON.parse(decodeURIComponent(data)) : null;
    } catch (error) {
        console.error(`Error parsing session data for key "${key}":`, error);
        return null;
    }
}

export function syncCookiesToSession(getCookie) {
    const cookieKeys = ["cartData", "siteData", "customerData"];
    cookieKeys.forEach((key) => {
        try {
            const cookieValue = getCookie(key);
            if (cookieValue) {
                sessionStorage.setItem(key, decodeURIComponent(cookieValue));
                console.log(`Synchronized ${key} from cookies to session.`);
            }
        } catch (error) {
            console.error(`Failed to sync ${key} from cookies:`, error);
        }
    });
}

