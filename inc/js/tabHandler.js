document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const allProductsContainer = document.createElement("div");

    // Prepare a container for showing all products
    allProductsContainer.id = "all-products";
    allProductsContainer.classList.add("tab-content", "active");
    document.body.insertBefore(allProductsContainer, tabContents[0].parentNode);

    // Populate all products in the "all-products" container
    const allProducts = Array.from(tabContents).flatMap(tabContent =>
        Array.from(tabContent.querySelectorAll(".product"))
    );
    allProducts.forEach(product => {
        const clonedProduct = product.cloneNode(true);
        allProductsContainer.appendChild(clonedProduct);
    });

    // Show "all-products" on initial load
    tabContents.forEach(content => content.classList.remove("active"));
    allProductsContainer.classList.add("active");

    // Add click event listeners for tab buttons
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedTab = button.getAttribute("data-tab");
            const targetContent = document.getElementById(selectedTab);

            // Remove active class from all buttons and hide all contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            allProductsContainer.classList.remove("active");

            // Add active class to the clicked tab and show the selected content
            button.classList.add("active");

            if (targetContent) {
                targetContent.classList.add("active");
            } else {
                console.error(`Tab content with id '${selectedTab}' not found.`);
            }
        });
    });
});

