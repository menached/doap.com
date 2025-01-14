document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    // On page load, show all categories
    tabContents.forEach(content => content.style.display = "block");

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

            // Reapply cart highlights after tab switch (if needed)
            if (typeof highlightCartItems === "function") {
                highlightCartItems();
            }
        });
    });
});

