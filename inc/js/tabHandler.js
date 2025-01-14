document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedTab = button.getAttribute("data-tab");

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.style.display = "none");

            // Add active class to clicked button and show corresponding content
            button.classList.add("active");
            document.querySelector(`[data-tab-content="${selectedTab}"]`).style.display = "block";

            // Reapply cart highlights after tab switch
            if (typeof highlightCartItems === "function") {
                highlightCartItems();  // Highlight products in the active tab that are in the cart
            }
        });
    });
});

