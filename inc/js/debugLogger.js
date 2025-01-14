window.addEventListener('DOMContentLoaded', () => {
    console.group('Debugging Session and Cookie Data');

    // Log session storage data
    const sessionData = sessionStorage.getItem('sessionData');
    let parsedSessionData = sessionData ? JSON.parse(decodeURIComponent(sessionData)) : null;
    console.log('Session Data:', parsedSessionData ? parsedSessionData : 'No session data found');

    // Log cookie data
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = decodeURIComponent(value);
        return acc;
    }, {});
    console.log('Cookies:', cookies);

    console.groupEnd();

    // Populate the form with customer data from cookies if it exists
    if (cookies.sessionData) {
        try {
            const customerData = JSON.parse(decodeURIComponent(cookies.sessionData));
            console.log('Populating form with customer data from cookies:', customerData);

            Object.keys(customerData).forEach(key => {
                const inputField = document.getElementById(key);
                if (inputField) {
                    inputField.value = customerData[key];
                } else {
                    console.warn(`Input field with id '${key}' not found.`);
                }
            });

        } catch (error) {
            console.error('Error parsing customer data from cookies:', error);
        }
    } else {
        console.log('No customer data found in cookies.');
    }
});

