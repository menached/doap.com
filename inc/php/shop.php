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
        echo "<!-- shopproducts.html not included -->";
        echo "<!-- cartsection.html not included -->";
    } else {
        // Include shopproducts.html for other hostnames
        echo "<form id=\"cartForm\">";

        include('inc/html/products.html');
?>
    <div id="cartContainer">
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
