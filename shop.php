    <!-- Tabs -->
    <div class="tab-container">
        <div class="tab active" data-tab="flower">Flower</div>
        <div class="tab" data-tab="concentrates">Concentrates</div>
        <div class="tab" data-tab="edibles">Edibles</div>
        <div class="tab" data-tab="accessories">Accessories</div>
    </div>

    <form id="cartForm">

    <?php //include('shopproducts.html'); ?>
    <?php
    if ($_SERVER['HTTP_HOST'] === 'www.doap.com') {
        // Do not include shopproducts.html if the hostname is www.doap.com
        echo "<!-- shopproducts.html not included -->";
    } else {
        // Include shopproducts.html for other hostnames
        include('shopproducts.html');
        include('cartsection.html');
    }
    ?>

    <?php //include('flower.html'); ?>
    <?php //include('concentrates.html'); ?>
    <?php //include('edibles.html'); ?>
    <?php //include('accessories.html'); ?>

    </form>

    <script>
        document.getElementById("year").textContent = new Date().getFullYear();
    </script>

    <div id="popupMessage" class="popup hidden">
        <p id="popupText">Order Processed Successfully!</p>
    </div>

    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
        <div id="caption"></div>
    </div>
