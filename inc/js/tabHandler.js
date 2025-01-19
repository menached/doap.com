document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    // Load the last active tab from localStorage
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
        const savedTabButton = [...tabButtons].find(button => button.getAttribute("data-tab") === savedTab);
        const savedTabContent = document.getElementById(savedTab);
        
        if (savedTabButton && savedTabContent) {
            // Remove active class from all tabs and hide all contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.style.display = "none");

            // Activate the saved tab
            savedTabButton.classList.add("active");
            savedTabContent.style.display = "block";
        }
    } else {
        // Default to the first tab
        tabContents.forEach(content => content.style.display = "none");
        tabContents[0].style.display = "block";
        tabButtons[0].classList.add("active");
    }

    // Add click event listeners for tabs
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedTab = button.getAttribute("data-tab");

            // Remove active class from all buttons and hide contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.style.display = "none");

            // Add active class to the clicked tab and show the selected category
            button.classList.add("active");
            const targetContent = document.getElementById(selectedTab);
            if (targetContent) {
                targetContent.style.display = "block"; // Show the correct content
            } else {
                console.error(`Tab content with id '${selectedTab}' not found.`);
            }

            // Save the selected tab to localStorage
            localStorage.setItem("activeTab", selectedTab);

            // Reapply cart highlights after tab switch (if needed)
            if (typeof highlightCartItems === "function") {
                highlightCartItems();
            }
        });
    });
});

