document.addEventListener("DOMContentLoaded", function () {
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
                { 
                    zip: [94507], 
                    city: ["Alamo", "Blackhawk", "Tassajara"], 
                    url: "https://alamo.doap.com" 
                },
                {
                    zip: [
                        94002, 94005, 94010, 94011, 94014, 94015, 94019, 94022, 94025, 94027, 
                        94028, 94030, 94038, 94044, 94061, 94062, 94063, 94065, 94066, 94070, 
                        94080, 94112, 94128, 94134, 94301, 94401, 94402, 94403, 94404
                    ],
                    city: ["Burlingame", "El Granada", "Moss Beach", "Montara", "San Mateo"],
                    url: "https://burlingame.doap.com"
                },
                { 
                    zip: [94536, 94538, 94539, 94555], 
                    city: ["Castro Valley", "Newark", "Union City"], 
                    url: "https://castrovalley.doap.com" 
                },
                {
                    zip: [94022, 94023, 94024, 94040, 94041, 94042, 94043, 94085, 94086, 94087, 
                          94088, 94089, 94301, 94302, 94303, 94304, 94305, 94306, 94309, 94401, 
                          94402, 94403, 94404, 95002, 95008, 95009, 95011, 95013, 95014, 95015, 
                          95030, 95031, 95032, 95035, 95036, 95042, 95044, 95050, 95051, 95052, 
                          95054, 95055, 95056, 95101, 95102, 95103, 95106, 95108, 95109, 95110, 
                          95111, 95112, 95113, 95115, 95116, 95117, 95118, 95119, 95120, 95121, 
                          95122, 95123, 95124, 95125, 95126, 95127, 95128, 95129, 95130, 95131, 
                          95132, 95133, 95134, 95135, 95136, 95138, 95139, 95140, 95141, 95148, 
                          95150, 95151, 95152, 95153, 95154, 95155, 95156, 95157, 95158, 95159, 
                          95160, 95161, 95164, 95170, 95172, 95173, 95191, 95192, 95193, 95194, 
                          95196, 95391],
                    city: ["Campbell", "Monte Sereno", "Saratoga", "San Jose"],
                    url: "https://campbell.doap.com"
                },
                { 
                    zip: [94528, 94547, 94552, 94556, 94619, 94605, 94516, 94575], 
                    city: ["Concord", "Clayton", "Pacheco"], 
                    url: "https://concord.doap.com" 
                },
                { 
                    zip: [94506, 94526], 
                    city: ["Danville", "Diablo"], 
                    url: "https://danville.doap.com" 
                },
                { 
                    zip: [94568, 94552, 94586], 
                    city: ["Dublin", "Sunol"], 
                    url: "https://dublin.doap.com" 
                },
                { 
                    zip: [94402, 94403, 94002, 94030, 94070, 94404, 94065, 94066, 94080, 94063, 94128, 94401, 94015, 94044, 94134, 94014, 94124], 
                    city: ["Hillsborough", "Belmont", "Millbrae"], 
                    url: "https://hillsborough.doap.com" 
                },
                { 
                    zip: [94549, 94583, 94553, 94598, 94575, 94556, 94708, 94707, 94709, 94618, 94704, 94517, 94720, 94705, 94710, 94712, 94702, 94703], 
                    city: ["Lafayette", "Moraga"], 
                    url: "https://lafayette.doap.com" 
                },
                { 
                    zip: [94550, 94551], 
                    city: ["Livermore", "Altamont"], 
                    url: "https://livermore.doap.com" 
                },
                { 
                    zip: [94618, 94705, 94708, 94563, 94611, 94803, 94704, 94530, 94707, 94556, 94804, 94564, 94619, 94805, 94553, 94709, 94609, 94516, 94610, 94575, 94706, 94710, 94702, 94572, 94720, 94703, 94608, 94612, 94569, 94602, 94547, 94606, 94613, 94607, 94601], 
                    city: ["Orinda", "El Sobrante", "Pinole"], 
                    url: "https://orinda.doap.com" 
                },
                {
                    zip: [94536, 94538, 94539, 94555],
                    city: ["Castro Valley", "Newark", "Union City", "Fremont"],
                    url: "https://castrovalley.doap.com"
                },
                { 
                    zip: [94512, 94513, 94565, 94509, 94514, 94531, 94548, 94561, 94571, 94511], 
                    city: ["Pittsburg", "Bay Point"], 
                    url: "https://pittsburg.doap.com" 
                },
                { 
                    zip: [94597, 94523, 94553, 94528, 94575, 94806, 94531, 94564, 94803, 94805, 94547, 94530, 94707, 94005], 
                    city: ["Pleasant Hill", "Martinez", "Crockett"], 
                    url: "https://pleasanthill.doap.com" 
                },
                { 
                    zip: [94528, 94583, 94582, 94517, 94552, 94556, 94536, 94537], 
                    city: ["San Ramon", "Dougherty"], 
                    url: "https://sanramon.doap.com" 
                },
                { 
                    zip: [94598, 94595, 94596, 94575, 94556, 94806, 94803, 94805, 94564, 94572, 94801, 94804, 94850, 94547, 94553, 94530, 94707, 94708, 94920], 
                    city: ["Walnut Creek", "Rossmoor"], 
                    url: "https://walnutcreek.doap.com" 
                }
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
});

