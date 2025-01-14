document.addEventListener("DOMContentLoaded", function () {
    // Create the form container dynamically
    const form = document.createElement("form");
    form.className = "zip-form";

    // Create the input field
    const input = document.createElement("input");
    input.type = "text";
    input.id = "zipOrCityInput";
    input.name = "zipOrCity";
    input.placeholder = "Enter ZIP Code or City";
    input.className = "userInput";
    input.required = true;

    // Create the submit button
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Find a closer Agency";

    // Style hover effect for the button
    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#0056b3";
    });
    button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#007BFF";
    });

    // Create the message container for feedback
    const message = document.createElement("p");
    message.className = "message";
    message.style.cssText = "color: red; font-size: 1rem; margin: 10px 0 0;";

    // Append input and button to form
    form.appendChild(input);
    form.appendChild(button);

    // Form submission logic
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const userInput = input.value.trim().toLowerCase();
        if (!userInput) {
            message.textContent = "Please enter a valid ZIP Code or city.";
            form.appendChild(message);
            return;
        }

        // ZIP Data Mapping and redirection logic
        const zipData = [
            { zip: [94507], city: ["Alamo", "Blackhawk", "Tassajara"], url: "https://alamo.doap.com/simple.php" },
            { zip: [94568], city: ["Dublin"], url: "https://dublin.doap.com/simple.php" },
            {
                zip: [
                    94002, 94005, 94010, 94011, 94014, 94015, 94019, 94022, 94025, 94027,
                    94028, 94030, 94038, 94044, 94061, 94062, 94063, 94065, 94066, 94070,
                    94080, 94112, 94128, 94134, 94301, 94401, 94402, 94403, 94404
                ],
                city: ["Burlingame", "El Granada", "Moss Beach", "Montara", "San Mateo"],
                url: "https://burlingame.doap.com/simple.php"
            },
            { zip: [94536, 94538, 94539, 94555, 94577, 94578, 94579], city: ["Castro Valley", "Newark", "Union City", "Fremont", "San Leandro"], url: "https://castrovalley.doap.com/simple.php" },
            {
                zip: [94528, 94547, 94552, 94556, 94619, 94605, 94516, 94575], city: ["Concord", "Clayton", "Pacheco"], url: "https://concord.doap.com/simple.php"
            },
            { zip: [94506, 94526], city: ["Danville", "Diablo"], url: "https://danville.doap.com/simple.php" },
            { zip: [94568, 94552, 94586], city: ["Dublin", "Sunol"], url: "https://dublin.doap.com/simple.php" },
            {
                zip: [94402, 94403, 94002, 94030, 94070, 94404, 94065, 94066, 94080, 94063, 94128, 94401, 94015, 94044, 94134, 94014, 94124],
                city: ["Hillsborough", "Belmont", "Millbrae"],
                url: "https://hillsborough.doap.com/simple.php"
            },
            {
                zip: [94549, 94583, 94553, 94598, 94575, 94556, 94708, 94707, 94709, 94618],
                city: ["Lafayette", "Moraga"],
                url: "https://lafayette.doap.com/simple.php"
            },
            { zip: [94550, 94551], city: ["Livermore", "Altamont"], url: "https://livermore.doap.com/simple.php" },
            {
                zip: [94618, 94705, 94708, 94563, 94611],
                city: ["Orinda", "El Sobrante", "Pinole"],
                url: "https://orinda.doap.com/simple.php"
            },
            { zip: [94512, 94513, 94565, 94509, 94514], city: ["Pittsburg", "Bay Point"], url: "https://pittsburg.doap.com/simple.php" },
            {
                zip: [94597, 94523, 94553, 94528, 94575],
                city: ["Pleasant Hill", "Martinez", "Crockett"],
                url: "https://pleasanthill.doap.com/simple.php"
            },
            { zip: [94528, 94583, 94582, 94517], city: ["San Ramon", "Dougherty"], url: "https://sanramon.doap.com/simple.php" },
            {
                zip: [94598, 94595, 94596],
                city: ["Walnut Creek", "Rossmoor"],
                url: "https://walnutcreek.doap.com/simple.php"
            }
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
            form.appendChild(message);
        }
    });

    // Append form to the container with the class "zip-form-container"
    const formContainer = document.querySelector(".zip-form-container");

    if (formContainer) {
        formContainer.appendChild(form);
    } else {
        console.error("Target container '.zip-form-container' not found! Form was not appended.");
    }

    console.log("Zip Finder initialized successfully.");
});

