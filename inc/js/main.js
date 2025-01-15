// main.js
import { initCookieConsent } from './consentHandler.js';
import { populateFormFromStorage } from './formPopulator.js';
//import "./debugLogger.js";

document.addEventListener("DOMContentLoaded", () => {
    initCookieConsent();
    populateFormFromStorage();
});

