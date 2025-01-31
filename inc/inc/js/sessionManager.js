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
