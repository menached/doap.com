<title>Doap</title>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VP7XRHB9TQ"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-VP7XRHB9TQ');
</script>

<script>
    // Get the subdomain from the hostname
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    // Replace placeholders or static URLs dynamically
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = `https://${subdomain}.doap.com/shopstyles.css`;
    document.head.appendChild(styleLink);

    const shopScript = document.createElement("script");
    shopScript.src = `https://${subdomain}.doap.com/shop.js`;
    shopScript.type = "module";
    shopScript.defer = true;
    document.head.appendChild(shopScript);

    const zipFinderScript = document.createElement("script");
    zipFinderScript.src = `https://${subdomain}.doap.com/shopzipFinder.js`;
    zipFinderScript.defer = true;
    document.head.appendChild(zipFinderScript);

    console.log(`Using resources for subdomain: ${subdomain}`);
</script>

<link href="https://fonts.googleapis.com/css2?family=Marvel&display=swap" rel="stylesheet">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php include('og_meta.php'); ?>

