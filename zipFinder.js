document.addEventListener("DOMContentLoaded", function () {
    // Debug: Log the hostname to confirm
    const hostname = window.location.hostname;
    console.log("Current hostname:", hostname);

    // Allow slight variations in hostname (e.g., with or without www)
    if (/^(www\.)?doap\.com$/.test(hostname)) {
        console.log("ZIP form will be displayed on this page.");

        // Function to create and return the ZIP form
        function createZipForm() {
            const formContainer = document.createElement("div");
            formContainer.style.cssText = "display: flex; flex-direction: column; align-items: center; margin-top: 20px;";

            // Create the form
            const form = document.createElement("form");
            form.className = "zip-form";
            form.style.cssText = "display: flex; flex-direction: column; gap: 10px; align-items: center;";

            // Input field
            const input = document.createElement("input");
            input.type = "text";
            input.className = "userInput";
            input.placeholder = "Enter ZIP Code or City/Town";
            input.required = true;
            input.style.cssText = "padding: 10px; font-size: 1.2rem; border: 2px solid #007BFF; border-radius: 5px;";

            // Submit button
            const button = document.createElement("button");
            button.type = "submit";
            button.className = "buttonsubmit";
            button.textContent = "Find Location";
            button.style.cssText = "padding: 10px 20px; background-color: #007BFF; color: #fff; font-size: 1rem; border: none; border-radius: 5px; cursor: pointer;";
            button.onmouseover = () => (button.style.backgroundColor = "#0056b3");
            button.onmouseout = () => (button.style.backgroundColor = "#007BFF");

            // Message area
            const message = document.createElement("p");
            message.className = "message";
            message.style.cssText = "color: red; font-size: 1rem; margin-top: 10px;";

            // Append input and button to form
            form.appendChild(input);
            form.appendChild(button);
            form.appendChild(message);

            // Attach ZIP form logic
            handleZipFormSubmit(form);

            // Append form to the container
            formContainer.appendChild(form);

            return formContainer;
        }

        // Function to handle ZIP form logic
        function handleZipFormSubmit(form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                const userInput = form.querySelector(".userInput").value.trim().toLowerCase();
                const message = form.querySelector(".message");
                const zipData = [
                    { zip: [94507], city: ["Alamo"], url: "https://alamo.doap.com/cart.php" },
                    { zip: [94568], city: ["Dublin"], url: "https://dublin.doap.com/cart.php" },
                ];

                let matchedURL = null;
                for (const data of zipData) {
                    if (data.zip.includes(parseInt(userInput)) || data.city.some(c => c.toLowerCase() === userInput)) {
                        matchedURL = data.url;
                        break;
                    }
                }

                if (matchedURL) {
                    window.location.href = matchedURL; // Redirect to matched URL
                    form.reset();
                } else {
                    message.textContent = "No agency in your area.";
                }
            });
        }

        // Add the welcome message and ZIP form to the page
        const mainContainer = document.body;

        const message = document.createElement("div");
        message.textContent = "Welcome to Norcal Doap!";
        message.style.cssText = "text-align: center; font-size: 2rem; margin-top: 20px; font-weight: bold; font-family: Marvel;";
        mainContainer.appendChild(message);

        const zipForm = createZipForm(); // Call the form creation function
        mainContainer.appendChild(zipForm);
    } else {
        console.log("ZIP form will NOT be displayed on this page.");
    }
});

