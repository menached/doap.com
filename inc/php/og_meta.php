<?php
// Get the host and extract the subdomain
$host = $_SERVER['HTTP_HOST'];
$subdomain = strstr($host, '.', true);

// Array of domain-specific details
$domainData = [
    "alamo" => [
        "city" => "Alamo",
        "description" => "Alamo Doap delivers organic awesome pot from 9am to 9pm daily to Alamo and surrounding cities 
7 days a week.",
        "phone" => "925-553-4710"
    ],
    "burlingame" => [
        "city" => "Burlingame",
        "description" => "Burlingame Doap offers premium organic pot delivery, 9am to 9pm daily, covering Burlingame and nearby areas.",
        "phone" => "925-601-1234"
    ],
    "campbell" => [
        "city" => "Campbell",
        "description" => "Campbell Doap brings you fresh organic pot daily from 9am to 9pm, serving Campbell and neighboring cities.",
        "phone" => "925-603-8765"
    ],
    "castrovalley" => [
        "city" => "Castro Valley",
        "description" => "Castro Valley Doap delivers organic pot to your door 9am to 9pm every day, covering Castro Valley and nearby areas.",
        "phone" => "925-263-9209"
    ],
    "concord" => [
        "city" => "Concord",
        "description" => "Concord Doap delivers organic awesome pot daily, 9am to 9pm, to Concord and surrounding cities.",
        "phone" => "925-412-4880"
    ],
    "danville" => [
        "city" => "Danville",
        "description" => "Danville Doap offers reliable pot delivery 7 days a week, 9am to 9pm, serving Danville and nearby cities.",
        "phone" => "925-725-6920"
    ],
    "dublin" => [
        "city" => "Dublin",
        "description" => "Dublin Doap delivers organic pot daily from 9am to 9pm to Dublin and surrounding areas.",
        "phone" => "925-587-6777"
    ],
    "hillsborough" => [
        "city" => "Hillsborough",
        "description" => "Hillsborough Doap provides top-quality organic pot delivery, 9am to 9pm daily, to Hillsborough and nearby cities.",
        "phone" => "925-601-5555"
    ],
    "lafayette" => [
        "city" => "Lafayette",
        "description" => "Lafayette Doap delivers organic pot to Lafayette and surrounding cities daily from 9am to 9pm.",
        "phone" => "925-871-1333"
    ],
    "livermore" => [
        "city" => "Livermore",
        "description" => "Livermore Doap delivers fresh organic pot daily, 9am to 9pm, serving Livermore and nearby areas.",
        "phone" => "925-718-6181"
    ],
    "orinda" => [
        "city" => "Orinda",
        "description" => "Orinda Doap offers daily organic pot delivery, 9am to 9pm, serving Orinda and its neighboring cities.",
        "phone" => "925-891-7800"
    ],
    "pleasanton" => [
        "city" => "Pleasanton",
        "description" => "Pleasanton Doap delivers organic awesome pot daily to Pleasanton and nearby cities from 9am to 9pm.",
        "phone" => "925-587-6777"
    ],
    "pleasanthill" => [
        "city" => "Pleasant Hill",
        "description" => "Pleasant Hill Doap brings organic pot to your door daily, 9am to 9pm, serving Pleasant Hill and surrounding areas.",
        "phone" => "925-891-7800"
    ],
    "sanramon" => [
        "city" => "San Ramon",
        "description" => "San Ramon Doap provides daily pot delivery, 9am to 9pm, serving San Ramon and nearby cities.",
        "phone" => "925-365-6030"
    ],
    "walnutcreek" => [
        "city" => "Walnut Creek",
        "description" => "Walnut Creek Doap offers organic pot delivery every day, 9am to 9pm, in Walnut Creek and surrounding areas.",
        "phone" => "925-464-2075"
    ],
    "www" => [
        "city" => "Norcal",
        "description" => "Consult the Directory Of Agencies & Providers for agencies that deliver organic awesome pot from 9am to 9pm daily 7 days a week!",
        "phone" => "833-289-3627"
    ]
];

// Default fallback
$defaultData = [
    "city" => "Norcal",
    "description" => "Find a DOAP Northern California cannabis delivery service near you!",
    "phone" => "833-289-3627",
    "customTitle" => "Cannabis Delivery Service" // Default title
];

// Retrieve the domain details or use the default
$domainDetails = $domainData[strtolower($subdomain)] ?? $defaultData;

// Define dynamic title
$customTitle = $domainDetails['customTitle'] ?? "{$domainDetails['city']} Cannabis Delivery";
if ($subdomain === "www" && $_SERVER['REQUEST_URI'] === "/simple.php") {
    $customTitle = "Directory Of Agencies & Providers";
}

// Generate OG meta tags
$cityName = htmlspecialchars($domainDetails['city'], ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars($domainDetails['description'], ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($domainDetails['phone'], ENT_QUOTES, 'UTF-8');

// Check for image existence
$imagePath = $_SERVER['DOCUMENT_ROOT'] . "/images/banners/{$subdomain}doapbanner.webp";
$imageUrl = file_exists($imagePath) ? "https://{$subdomain}.doap.com/images/banners/{$subdomain}doapbanner.webp" : 'https://default-image-url.com/fallback-image.webp';

$logoUrl = "https://{$subdomain}.doap.com/images/doap-logo-wording.png";

// Output the meta tags
header('Content-Type: text/html');
echo <<<HTML
<meta property="og:title" content="{$customTitle}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://{$host}{$_SERVER['REQUEST_URI']}">
<meta property="og:description" content="{$description}">
<meta property="og:image" content="{$imageUrl}">
<meta property="og:locale" content="en-US" />
<meta property="og:logo" content="{$logoUrl}" />
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{$customTitle}">
<meta name="twitter:description" content="{$description}">
<meta name="twitter:image" content="{$imageUrl}">
<meta name="twitter:site" content="Call us at {$phone}">
HTML;
?>
