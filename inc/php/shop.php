    <!-- Tabs -->
    <div class="tab-container">
        <div class="tab active" data-tab="flower">Flower</div>
        <div class="tab" data-tab="concentrates">Concentrates</div>
        <div class="tab" data-tab="edibles">Edibles</div>
        <div class="tab" data-tab="accessories">Accessories</div>
    </div>


    <?php //include('shopproducts.html'); ?>
    <?php
    if ($_SERVER['HTTP_HOST'] === 'www.doap.com') {
        // Do not include shopproducts.html and cartsection.html if the hostname is www.doap.com
    } else {
        // Include shopproducts.html for other hostnames
    ?>
    <div id="cartContainer"> 
    <?php
        echo "<form id=\"cartForm\">";

        include('inc/html/products.html');
?>
        <?php include('inc/html/cartsection.html');  ?>
    </div>
<?php } ?>


    <div id="popupMessage" class="popup hidden">
        <p id="popupText">Order Processed Successfully!</p>
    </div>

    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
        <div id="caption"></div>
    </div>



<script type="module">
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    // Show all categories on page load
    tabContents.forEach(content => content.classList.add("active"));

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            // Hide all categories
            tabContents.forEach(content => content.classList.remove("active"));

            // Show only the selected category
            const contentId = tab.dataset.tab;
            const targetContent = document.getElementById(contentId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
});

</script>


