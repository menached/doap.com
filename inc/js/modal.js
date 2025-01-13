// Get the modal elements
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const captionText = document.getElementById("caption");

// Function to open the modal with the clicked image
function openModal(image) {
    if (!modal || !modalImage || !captionText) {
        console.error("Modal elements not found.");
        return;
    }
    modal.style.display = "block";
    modalImage.src = image.src;
    captionText.textContent = image.alt || "Image preview";
    console.log("Modal opened with image src:", image.src);
}

// Add event listener to all product images
const productImages = document.querySelectorAll(".item img");
if (productImages.length > 0) {
    productImages.forEach(img => {
        img.addEventListener("click", function () {
            openModal(this);
        });
    });
} else {
    console.warn("No product images found for modal events.");
}

// Function to close the modal
window.closeModal = function () {
    if (modal) {
        modal.style.display = "none";
        console.log("Modal closed.");
    } else {
        console.error("Modal element not found.");
    }
};

// Add event listener to close the modal when clicking outside the image
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        window.closeModal();
    }
});

console.log("Modal functionality initialized successfully.");
