<body>
    <!-- Tabs -->
    <div class="tab-container">
        <div class="tab active" data-tab="flower">Flower</div>
        <div class="tab" data-tab="concentrates">Concentrates</div>
        <div class="tab" data-tab="edibles">Edibles</div>
        <div class="tab" data-tab="accessories">Accessories</div>
    </div>

    <form id="cartForm">

    <?php include('shopproducts.html'); ?>

    <?php //include('flower.html'); ?>
    
    <?php //include('concentrates.html'); ?>

    <?php //include('edibles.html'); ?>

    <?php //include('accessories.html'); ?>



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

        <textarea id="specialInstructions" placeholder="Special instructions"></textarea>

    </div>
        
    <!-- Payment Method -->
    <div class="payment-section">
        <label for="paymentMethod" class="Marvelfont"><i class="fas fa-cash-register alignright"></i>  Payment Method: </label>
        <select id="paymentMethod" name="paymentMethod" required>
            <option value="" selected>Select Payment Method</option>
            <option value="credit-card">Credit Card</option>
            <option value="crypto">Crypto</option>
            <option value="cash">Cash</option>
            <option value="zelle">Zelle</option>
            <option value="venmo">Venmo</option>
            <option value="paypal">PayPal</option>
            <option value="cashapp">Cashapp</option>
        </select>
    </div>

    <div id="accordionContent" style="margin-top: 20px;">
            
        <div id="creditCardForm" class="accordion-section" style="display: none;">
            <h3><i class="fas fa-credit-card alignright"></i> Enter Your Credit Card Details</h3>
            <p class="aligncenter"> 
                <label for="nameOnCard">
                    Name on card:
                </label>
                <input type="text" id="nameOnCard" placeholder="Joe Q. Public" /> <i class="cardElement"></i> 
            </p>
            <p class="aligncenter"> 
                <label for="cardNumber">
                    Card Number:
                </label>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" class="cardElement"/> <i class="fas fa-lock golden-lock"></i> 
            </p>
            <p class="cardbits">
                <label for="expiryDate">
                    Expiration Date:
                </label>
                <input type="text" id="expiryDate" placeholder="MM/YY" class="cardElement" />
            
                <label for="cvv">
                    CVV:
                </label>
                <input type="text" id="cvv" placeholder="123"  class="cardElement"/>
                <label for="zip">
                    Zip:
                </label>
                <input type="text" id="cardZip" placeholder="94XXX"  class="cardElement"/>
            </p>
        </div>

        <div id="cryptoWallets" class="accordion-section" style="display: none;">
            <h3>Crypto Wallet Addresses</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li>
                    <i class="fab fa-bitcoin"></i>
                    <strong>Bitcoin (BTC):</strong> 
                    <span class="copy-address small-text" data-address="bc1q28m9z95qzfjap7tamagnhlrk8nu332l7mlyjzr" style="cursor: pointer; color: blue;">
                        bc1q28m9z95qzfjap7tamagnhlrk8nu332l7mlyjzr
                    </span>
                </li>
                <li>
                    <i class="fab fa-ethereum"></i>
                    <strong>Ethereum (ETH):</strong> 
                    <span class="copy-address small-text" data-address="0xf38ab68ae630bacd769cfc34fbcf3f7c0504f97a" style="cursor: pointer; color: blue;">
                        0xf38ab68ae630bacd769cfc34fbcf3f7c0504f97a
                    </span>
                </li>
                <li>
                    <i class="fa fa-dog"></i>
                    <strong>Doge (DOGE):</strong> 
                    <span class="copy-address small-text" data-address="DKx7uayMeVmd8Zuy3PgGSRB8XjUVt3ndeT" style="cursor: pointer; color: blue;">
                        DKx7uayMeVmd8Zuy3PgGSRB8XjUVt3ndeT
                    </span>
                </li>
                <li>
                    <i class="fa fa-wallet"></i>
                    <strong>Litecoin (LTC):</strong> 
                    <span class="copy-address small-text" data-address="ltc1q97cz898tgwqh23j44kf5nsaggg84j2vw666jqr" style="cursor: pointer; color: blue;">
                        ltc1q97cz898tgwqh23j44kf5nsaggg84j2vw666jqr
                    </span>
                </li>
            </ul>
            <!-- Temporary Copy Confirmation Message -->
            <div id="copyMessage" class="small-text" style="display: none; color: green; font-weight: bold; margin-top: 10px;"></div>
        

       </div>

        <div id="generalHelp" class="accordion-section" style="display: none;">
            <h3><i class="fas fa-phone-alt"></i> Need Assistance?</h3>
            <p>After placing your order, please check your email for further instructions on how to complete your payment.  Feel free to call us at (833)289-3627 for assistance. We're standing by to help!</p>
        </div>
            
        <!-- Submit Button -->
        <button id="checkoutButton">Checkout</button>

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


</body>
</html>

