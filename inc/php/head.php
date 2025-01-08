<title>Doap</title>
    <!-- Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PHZXR9R"></script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PHZXR9R');</script>
    <!-- End Google Tag Manager -->

    <script>
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Marvel&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/inc/css/style.css">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="/inc/js/ifroot.js" type="module" defer></script>
    <script src="/inc/js/shop.js" type="module" defer></script>
    <script src="/inc/js/payments.js" type="module" defer></script>
    <script src="/inc/js/modal.js" type="module" defer></script>
    <script src="/inc/js/subdomainData.js" type="module" defer></script>
    <script src="/inc/js/shopzipFinder.js" defer></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php include('/inc/php/og_meta.php'); ?>




<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.1/cookieconsent.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.1/cookieconsent.min.js"></script>
<script>
  window.addEventListener("load", function() {
    window.cookieconsent.initialise({
      palette: {
        popup: { background: "#000" },
        button: { background: "#f1d600" }
      },
      type: "opt-in", // Require opt-in for analytics and ads.
      content: {
        message: "We use cookies to enhance your experience.",
        dismiss: "Got it!",
        allow: "Allow Cookies",
        deny: "Decline",
        link: "Learn more",
        href: "/privacy-policy"
      },
      onInitialise: function(status) {
        if (status === 'allow') {
          enableAnalyticsAndAds();
        }
      }
    });
  });

  function enableAnalyticsAndAds() {
    console.log("Cookies allowed. Loading third-party scripts...");
    // Re-load Google Ads or Analytics scripts only if allowed.
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/conversion.js";
    document.head.appendChild(script);
  }
</script>

