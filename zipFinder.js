document.addEventListener("DOMContentLoaded", function () {
    // ZIP Form
    const form = document.createElement("form");
    form.className = "zip-form";
    form.style.cssText = "display: flex; flex-direction: column; gap: 10px;";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter ZIP Code or City/Town";
    input.className = "userInput";
    input.required = true;
    input.style.cssText = "padding: 10px; font-size: 1rem; border: 1px solid #ccc; border-radius: 5px;";

    // Adjust input width dynamically for screens > 400px
    function adjustInputWidth() {
        if (window.innerWidth > 400) {
            input.style.width = "100%";
        } else {
            input.style.width = "90%";
        }
    }
    adjustInputWidth(); // Initial width check
    window.addEventListener("resize", adjustInputWidth);

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Find Location";
    button.style.cssText = "padding: 10px 15px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;";

    // Message element for error or info display
    const message = document.createElement("p");
    message.className = "message";
    message.style.cssText = "color: red; font-size: 1rem; margin: 10px 0 0;";

    // Append elements to form
    form.appendChild(input);
    form.appendChild(button);
    form.appendChild(message);

    // Form submit logic
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const userInput = input.value.trim().toLowerCase();
        if (!userInput) {
            message.textContent = "Please enter a valid ZIP Code or city.";
            return;
        }

        // ZIP Data Mapping
        const zipData = [
            { zip: [94507], city: ["Alamo"], url: "https://alamo.doap.com/cart.php" },
            { zip: [94568], city: ["Dublin"], url: "https://dublin.doap.com/cart.php" },
            // Add more mappings here...
        ];

        let matchedURL = null;
        for (const data of zipData) {
            if (data.zip.includes(parseInt(userInput)) || data.city.some(city => city.toLowerCase() === userInput)) {
                matchedURL = data.url;
                break;
            }
        }

        if (matchedURL) {
            window.location.href = matchedURL; // Redirect to matched URL
        } else {
            message.textContent = "No matching location found. Please try again.";
        }
    });

    // Append form to the document body
    document.body.appendChild(form);
});

