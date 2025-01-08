<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();  // Start the session if it's not already started
}
?>
<!DOCTYPE html>
<html>
    <head> 
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VP7XRHB9TQ"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-VP7XRHB9TQ');
        </script>

        <?php include 'inc/php/head.php'; ?> </head>
    <body>
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PHZXR9R"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->

        <div class="page-wrapper">
            <div class="main-content">
                <?php include 'inc/html/header.html'; ?>
                <?php include 'inc/php/shop.php'; ?>
            </div>
            <?php include 'inc/html/footer.html'; ?>
        </div>
    </body>
</html>

