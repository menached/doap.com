// data.js 
export const defaultPhoneNumber = "833-289-3627";

export const areaMinimum = {
    localhost: 40, alamo: 40, burlingame: 120, campbell: 120, concord: 50, danville: 40, dublin: 40,
    lafayette: 50, livermore: 50, orinda: 60, pittsburg: 75, pleasanthill: 60,
    sanramon: 40, walnutcreek: 50
};

export const cityMap = {
    localhost: "Localhost", burlingame: "Burlingame", campbell: "Campbell", pleasanthill: "Pleasant Hill", walnutcreek: "Walnut Creek", castrovalley: "Castro Valley",
    sanramon: "San Ramon", discoverybay: "Discovery Bay", alamo: "Alamo", antioch: "Antioch",
    dublin: "Dublin", lafayette: "Lafayette", pleasanton: "Pleasanton", danville: "Danville",
    concord: "Concord", livermore: "Livermore", orinda: "Orinda", pittsburg: "Pittsburg"
};

export const phoneMap = {
    localhost: "833-BUY-DOAP", burlingame: "650-293-0880", campbell: "408-645-6700", pleasanthill: "925-891-7800", walnutcreek: "925-464-2075", castrovalley: "925-263-9209",
    sanramon: "925-365-6030", discoverybay: "925-891-7800", alamo: "925-553-4710",
    antioch: "925-891-7800", dublin: "925-587-6777", lafayette: "925-871-1333",
    pleasanton: "925-587-6777", danville: "925-725-6920", concord: "925-412-4880",
    livermore: "925-718-6181", orinda: "925-891-7800", pittsburg: "925-825-8555"
};

// Description for each subdomain
export const descriptionMap = {
    alamo: "Alamo Doap delivers organic awesome pot from 9am to 9pm daily to Alamo and surrounding cities 7 days a week.",
    burlingame: "Burlingame Doap offers premium organic pot delivery, 9am to 9pm daily, covering Burlingame and nearby areas.",
    campbell: "Campbell Doap brings you fresh organic pot daily from 9am to 9pm, serving Campbell and neighboring cities.",
    castrovalley: "Castro Valley Doap delivers organic pot to your door 9am to 9pm every day, covering Castro Valley and nearby areas.",
    concord: "Concord Doap delivers organic awesome pot daily, 9am to 9pm, to Concord and surrounding cities.",
    danville: "Danville Doap offers reliable pot delivery 7 days a week, 9am to 9pm, serving Danville and nearby cities.",
    dublin: "Dublin Doap delivers organic pot daily from 9am to 9pm to Dublin and surrounding areas.",
    lafayette: "Lafayette Doap delivers organic pot to Lafayette and surrounding cities daily from 9am to 9pm.",
    livermore: "Livermore Doap delivers fresh organic pot daily, 9am to 9pm, serving Livermore and nearby areas.",
    orinda: "Orinda Doap offers daily organic pot delivery, 9am to 9pm, serving Orinda and its neighboring cities.",
    pittsburg: "Pittsburg Doap provides daily pot delivery, 9am to 9pm, serving Pittsburg and Bay Point.",
    pleasanthill: "Pleasant Hill Doap brings organic pot to your door daily, 9am to 9pm, serving Pleasant Hill and surrounding areas.",
    sanramon: "San Ramon Doap provides daily pot delivery, 9am to 9pm, serving San Ramon and nearby cities.",
    walnutcreek: "Walnut Creek Doap offers organic pot delivery every day, 9am to 9pm, in Walnut Creek and surrounding areas.",
    www: "Consult the Directory Of Agencies & Providers for agencies that deliver organic awesome pot from 9am to 9pm daily 7 days a week!"
};

// Create the merged array of data objects
export const subdomainData = Object.keys(cityMap).map((subdomain) => {
    return {
        subdomain: subdomain,
        city: cityMap[subdomain] || "Unknown",
        phone: phoneMap[subdomain] || defaultPhoneNumber,
        minimumOrder: areaMinimum[subdomain] || 0,
        description: descriptionMap[subdomain] || "Description not available" // Adding description here
    };
});

