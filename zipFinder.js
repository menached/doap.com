console.log("zipFinder.js started loading");
document.addEventListener("DOMContentLoaded", function () {
    const hostname = window.location.hostname;
    console.log("Current hostname:", hostname);

    // Check for main domains: www.doap.com or doap.com
    if (/^(www\.)?doap\.com$/.test(hostname)) {
        console.log("ZIP form will be displayed on this page.");

        // Prevent duplicate form/message insertion
        if (document.getElementById("zipFormContainer")) {
            console.log("Form already exists. Skipping creation.");
            return;
        }

        // Create ZIP form container
        const formContainer = document.createElement("div");
        formContainer.id = "zipFormContainer";
        formContainer.style.cssText = "display: flex; flex-direction: column; align-items: center; margin: 20px auto;";

        // Welcome Message (prevent duplicates)
        const welcomeMessage = document.createElement("h2");
        //welcomeMessage.textContent = "Welcome to Norcal Doap!";
        welcomeMessage.style.cssText = "text-align: center; font-size: 2rem; font-family: Marvel; margin-bottom: 10px;";

        // ZIP Form
        const form = document.createElement("form");
        form.className = "zip-form";
        form.style.cssText = "display: flex; gap: 10px;";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter ZIP Code or City/Town";
        input.className = "userInput";
        input.required = true;
        input.style.cssText = "padding: 10px; font-size: 1rem; border: 1px solid #ccc; border-radius: 5px;";

        const button = document.createElement("button");
        button.type = "submit";
        button.textContent = "Find Location";
        button.style.cssText = "padding: 10px 15px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;";

        // Message for errors
        const message = document.createElement("p");
        message.className = "message";
        message.style.cssText = "color: red; margin-top: 10px; font-size: 1rem;";

        // Append input, button, and message to form
        form.appendChild(input);
        form.appendChild(button);
        form.appendChild(message);

        formContainer.appendChild(welcomeMessage);
        formContainer.appendChild(form);

        // Insert form below the .menu-title area
        const menuTitle = document.querySelector(".menu-title");
        if (menuTitle) {
            menuTitle.insertAdjacentElement("afterend", formContainer);
        } else {
            console.warn("Unable to find '.menu-title'. Appending to body.");
            document.body.appendChild(formContainer);
        }

        // Handle form submission
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const userInput = input.value.trim().toLowerCase();
            message.textContent = ""; // Reset message

            const zipData = [
                { zip: [94507], city: ["Alamo"], url: "https://alamo.doap.com/cart.php" },
                { zip: [94568], city: ["Dublin"], url: "https://dublin.doap.com/cart.php" },
                // Add your mappings here
            ];

            let matchedURL = null;
            for (const data of zipData) {
                if (data.zip.includes(parseInt(userInput)) || data.city.some(c => c.toLowerCase() === userInput)) {
                    matchedURL = data.url;
                    break;
                }
            }

            if (matchedURL) {
                window.location.href = matchedURL; // Redirect
            } else {
                message.textContent = "No agency in your area.";
            }
        });
    } else {
        console.log("ZIP form will NOT be displayed on this page.");
    }
});
console.log("zipFinder.js loaded completely");
