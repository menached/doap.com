<!DOCTYPE html>
<html>
<head>
    <script>
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        //const cityName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1).toLowerCase();
        const cityName = "<?php include('city.php'); ?>";
        //document.title = `${cityName} Doap`;
    </script>
        <title><?php include('city.php'); ?> Doap</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Marvel&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script src="cart.js" defer></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php include('og_meta.php'); ?>
</head>
<body>
<form id="cartForm">
    <!-- Header Section -->
        <div class="header">
            <div class="logo-title-container">
                <a href="/cart.php" target="_SELF">
                <img src="https://www.doap.com/doap-logo-wording.png" alt="Doap Logo" class="doap-logo">
                </a>
                <div class="text-container">
                    <a class="nodec" href="/cart.php" target="_SELF">
                        <h1 id="cityName"><?php include('city.php'); ?> Doap</h1>
                    </a>
                    <a href="tel:8332893627" class="phone-number nodec">(833) 289-3627</a>
                </div>
            </div>
            <div class="menu-title nodec">
                    <a style="text-decoration:none!important;" class="nodec" href="/cart.php" target="_SELF">
                <h2 class="menu-title-text nodec">Delivering Organic Awesome Pot</h2>
                    </a>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tab-container">
            <div class="tab active" data-tab="flower">Flower</div>
            <div class="tab" data-tab="concentrates">Concentrates</div>
            <div class="tab" data-tab="edibles">Edibles</div>
            <div class="tab" data-tab="accessories">Accessories</div>
        </div>

<!-- "Doap Menu" -->
<!-- Tab content for Flower -->
<div class="tab-content active" id="flower">
    <div class="item-list">
        <!-- Premium Quality Hybrid Prerolls -->
        <label class="item">
            <input type="checkbox" name="item" value="Premium Quality Hybrid Prerolls by House GP Brand|15">
            <img src="https://alamo.doap.com/wp-content/uploads/2021/10/4-pack-of-top-shelf-cone-joints.jpg" alt="Premium Quality Hybrid Prerolls">
            <div class="item-details">
                <p class="item-title">Premium Quality Hybrid Prerolls by House GP Brand</p>
                <div class="item-quantity">
                    <label for="quantity-premium-prerolls">Qty:</label>
                    <input type="number" id="quantity-premium-prerolls" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$15.00</p>
            </div>
        </label>
        <!-- 2 pk Top Shelf Prerolled Cone Joints -->
        <label class="item">
            <input type="checkbox" name="item" value="2 pk Top Shelf Prerolled Cone Joints|20">
            <img src="https://alamo.doap.com/wp-content/uploads/2021/10/4-pack-of-top-shelf-cone-joints.jpg" alt="2 pk Top Shelf Prerolled Cone Joints">
            <div class="item-details">
                <p class="item-title">2 pk Top Shelf Prerolled Cone Joints</p>
                <div class="item-quantity">
                    <label for="quantity-top-shelf-joints">Qty:</label>
                    <input type="number" id="quantity-top-shelf-joints" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$20.00</p>
            </div>
        </label>
        <!-- 5 Top Shelf Cannabis Pre-rolled Joints -->
        <label class="item">
            <input type="checkbox" name="item" value="5 Top Shelf Cannabis Pre-rolled Joints|40">
            <img src="https://alamo.doap.com/wp-content/uploads/2021/10/4-pack-of-top-shelf-cone-joints.jpg" alt="5 Top Shelf Cannabis Pre-rolled Joints">
            <div class="item-details">
                <p class="item-title">5 Top Shelf Cannabis Pre-rolled Joints</p>
                <div class="item-quantity">
                    <label for="quantity-pre-rolled-joints">Qty:</label>
                    <input type="number" id="quantity-pre-rolled-joints" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$40.00</p>
            </div>
        </label>
    </div>
</div>



<!-- Tab content for Edibles -->
<div class="tab-content" id="edibles">
    <div class="item-list">
        <!-- THC Gummy Bears - Small Bag -->
        <label class="item">
            <input type="checkbox" name="item" value="THC Gummy Bears - Small Bag|15">
            <img src="https://alamo.doap.com/wp-content/uploads/2023/11/29568cf4151e0959e1f853d6791c8906.png" alt="THC Gummy Bears - Small Bag">
            <div class="item-details">
                <p class="item-title">THC Gummy Bears - Small Bag</p>
                <div class="item-quantity">
                    <label for="quantity-thc-bears-small">Qty:</label>
                    <input type="number" id="quantity-thc-bears-small" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$15.00</p>
            </div>
        </label>

        <!-- THC Gummy Bears - Medium Bag -->
        <label class="item">
            <input type="checkbox" name="item" value="THC Gummy Bears - Medium Bag|25">
            <img src="https://alamo.doap.com/wp-content/uploads/2023/11/29568cf4151e0959e1f853d6791c8906.png" alt="THC Gummy Bears - Medium Bag">
            <div class="item-details">
                <p class="item-title">THC Gummy Bears - Medium Bag</p>
                <div class="item-quantity">
                    <label for="quantity-thc-bears-medium">Qty:</label>
                    <input type="number" id="quantity-thc-bears-medium" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$25.00</p>
            </div>
        </label>

        <!-- THC Gummy Bears - Large Bag -->
        <label class="item">
            <input type="checkbox" name="item" value="THC Gummy Bears - Large Bag|60">
            <img src="https://alamo.doap.com/wp-content/uploads/2023/11/29568cf4151e0959e1f853d6791c8906.png" alt="THC Gummy Bears - Large Bag">
            <div class="item-details">
                <p class="item-title">THC Gummy Bears - Large Bag</p>
                <div class="item-quantity">
                    <label for="quantity-thc-bears-large">Qty:</label>
                    <input type="number" id="quantity-thc-bears-large" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$60.00</p>
            </div>
        </label>

        <!-- THC Gummy Bears - Extra-Large Bag -->
        <label class="item">
            <input type="checkbox" name="item" value="THC Gummy Bears - Extra-Large Bag|100">
            <img src="https://alamo.doap.com/wp-content/uploads/2023/11/29568cf4151e0959e1f853d6791c8906.png" alt="THC Gummy Bears - Extra-Large Bag">
            <div class="item-details">
                <p class="item-title">THC Gummy Bears - Extra-Large Bag</p>
                <div class="item-quantity">
                    <label for="quantity-thc-bears-xl">Qty:</label>
                    <input type="number" id="quantity-thc-bears-xl" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$100.00</p>
            </div>
        </label>
        
        <!-- Space Tubaroos Cannabis Infused Strawberry Gummies -->
        <label class="item">
            <input type="checkbox" name="item" value="Space Tubaroos Cannabis Infused Strawberry Gummies|30">
            <img src="https://danville.doap.com/wp-content/uploads/2023/09/tuberoos.webp" alt="Space Tubaroos Cannabis Infused Strawberry Gummies">
            <div class="item-details">
                <p class="item-title">Space Tubaroos Cannabis Infused Strawberry Gummies</p>
                <div class="item-quantity">
                    <label for="quantity-space-tubaroos">Qty:</label>
                    <input type="number" id="quantity-space-tubaroos" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$30.00</p>
            </div>
        </label>
    </div>
</div>



<!-- Tab content for Concentrates -->
<div class="tab-content" id="concentrates">
    <div class="item-list">
        <!-- Solventless Extraction Half Gram Disposable Vape -->
        <label class="item">
            <input type="checkbox" name="item" value="Solventless Extraction Half Gram Disposable Vape|50">
            <img src="https://alamo.doap.com/wp-content/uploads/2021/10/The-DOAP-Vape-Pen-Battery-510thread-wCharger-1yrWarranty-2-1.jpeg" alt="Solventless Extraction Half Gram Disposable Vape">
            <div class="item-details">
                <p class="item-title">Solventless Extraction Half Gram Disposable Vape</p>
                <div class="item-quantity">
                    <label for="quantity-solventless-vape">Qty:</label>
                    <input type="number" id="quantity-solventless-vape" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$50.00</p>
            </div>
        </label>

        <!-- Doap Vape Pen - Rechargeable -->
        <label class="item">
            <input type="checkbox" name="item" value="Doap Vape Pen - Rechargeable|25">
            <img src="https://alamo.doap.com/wp-content/uploads/2021/10/The-DOAP-Vape-Pen-Battery-510thread-wCharger-1yrWarranty-2-1.jpeg" alt="Doap Vape Pen - Rechargeable">
            <div class="item-details">
                <p class="item-title">Doap Vape Pen - Rechargeable</p>
                <div class="item-quantity">
                    <label for="quantity-doap-vape-pen">Qty:</label>
                    <input type="number" id="quantity-doap-vape-pen" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$25.00</p>
            </div>
        </label>
    </div>
</div>


<!-- Tab content for Accessories -->
<div class="tab-content" id="accessories">
    <div class="item-list">
        <!-- LoKey Multi-Voltage KeyFob Vape Battery -->
        <label class="item">
            <input type="checkbox" name="item" value="LoKey Multi-Voltage KeyFob Vape Battery|40">
            <img src="https://alamo.doap.com/wp-content/uploads/2023/08/single-vape-carts.jpg" alt="LoKey Multi-Voltage KeyFob Vape Battery">
            <div class="item-details">
                <p class="item-title">LoKey Multi-Voltage KeyFob Vape Battery w/ Built-in USB Charger</p>
                <div class="item-quantity">
                    <label for="quantity-lokey-vape-battery">Qty:</label>
                    <input type="number" id="quantity-lokey-vape-battery" class="quantity" min="1" max="99" value="1">
                </div>
                <p class="item-price">$40.00</p>
            </div>
        </label>
    </div>
</div>




        <!-- Cart Section -->
        <div class="cart-section">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Cart:</h3>
                <span id="minOrderMessage" style="font-size: 0.9rem; font-weight: bold; color: black;">
                    Minimum order is $50.
                </span>
            </div>
            <ul id="selectedItemsList">
                <li>No items selected yet.</li>
            </ul>
            <div id="totalPriceRow">
                <span>Total Price:</span>
                <span id="total">$0</span>
            </div>
        </div>


        <!-- Customer Information -->
        <div class="customer-info">
            <div class="info-row">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="info-row">
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" required>
            </div>
            
            <div class="info-row">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="info-row">
                <label for="address">Address:</label>
                <textarea id="address" name="address" autocomplete="address-line1" required></textarea>
            </div>

            <div class="info-row">
                <label for="city">City:</label>
                <input type="text" id="city" name="city" value="<?php include('city.php'); ?>" required>
            </div>
    <!-- Submit Button -->
        <button id="checkoutButton">Checkout</button>
        </div>
        
        <!-- Payment Method -->
        <div class="payment-section">
            <label for="paymentMethod" class="Marvelfont">Payment Method:</label>
            <select id="paymentMethod" name="paymentMethod" required>
                <option value="" selected>Select Payment Method</option>
                <option value="credit-card">Credit Card</option>
                <option value="crypto">Crypto</option>
                <option value="cash">Cash</option>
                <option value="zelle">Zelle</option>
                <option value="venmo">Venmo</option>
                <option value="paypal">PayPal</option>
            </select>
        </div>

        <div id="accordionContent" style="margin-top: 20px;">
            <div id="creditCardForm" class="accordion-section" style="display: none;">
                <h3>Enter Your Credit Card Details</h3>
                <label for="cardNumber">Card Number:</label>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />
                <label for="expiryDate">Expiry Date:</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" />
                <label for="cvv">CVV:</label>
                <input type="text" id="cvv" placeholder="123" />
            </div>

            <div id="cryptoWallets" class="accordion-section" style="display: none;">
                <h3>Crypto Wallet Addresses</h3>
                <p>Bitcoin (BTC): bc1q28m9z95qzfjap7tamagnhlrk8nu332l7mlyjzr</p>
                <p>Ethereum (ETH): 0xf38ab68ae630bacd769cfc34fbcf3f7c0504f97a</p>
                <p>Doge (DOGE): DKx7uayMeVmd8Zuy3PgGSRB8XjUVt3ndeT</p>
                <p>Litecoin (LTC): ltc1q97cz898tgwqh23j44kf5nsaggg84j2vw666jqr</p>
            </div>

            <div id="generalHelp" class="accordion-section" style="display: none;">
                <h3><i class="fas fa-phone-alt"></i> Need Assistance?</h3>
                <p>After placing your order, please check your email for further instructions on how to complete your payment.  Feel free to call us at (833)289-3627 for assistance. We're standing by to help!</p>
            </div>
        </div>
    </form>

    <div id="popupMessage" class="popup hidden">
        <p id="popupText">Order Processed Successfully!</p>
    </div>

</body>
</html>
