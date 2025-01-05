// Get the modal
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const captionText = document.getElementById("caption");

// Add event listener to all product images
document.querySelectorAll(".item img").forEach(img => {
    img.addEventListener("click", function () {
        modal.style.display = "block";
        modalImage.src = this.src;
        captionText.innerHTML = this.alt;
    });
});

// Close the modal
window.closeModal = function () {
    modal.style.display = "none";
};


