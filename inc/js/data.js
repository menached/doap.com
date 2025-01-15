// data.js

export const defaultPhoneNumber = "833-289-3627";

export const areaMinimum = {
    localhost: 0, alamo: 40, burlingame: 120, campbell: 120, concord: 50, danville: 40, dublin: 40,
    lafayette: 50, livermore: 50, orinda: 60, pittsburg: 75, pleasanthill: 60,
    sanramon: 40, walnutcreek: 50
};

export const cityMap = {
    localhost: "Localhost", burlingame: "Burlingame", pleasanthill: "Pleasant Hill", walnutcreek: "Walnut Creek", castrovalley: "Castro Valley",
    sanramon: "San Ramon", discoverybay: "Discovery Bay", alamo: "Alamo", antioch: "Antioch",
    dublin: "Dublin", lafayette: "Lafayette", pleasanton: "Pleasanton", danville: "Danville",
    concord: "Concord", livermore: "Livermore", orinda: "Orinda"
};

export const phoneMap = {
    localhost: "833-BUY-DOAP", burlingame: "650-293-0880", pleasanthill: "925-891-7800", walnutcreek: "925-464-2075", castrovalley: "925-263-9209",
    sanramon: "925-365-6030", discoverybay: "925-891-7800", alamo: "925-553-4710",
    antioch: "925-891-7800", dublin: "925-587-6777", lafayette: "925-871-1333",
    pleasanton: "925-587-6777", danville: "925-725-6920", concord: "925-412-4880",
    livermore: "925-718-6181", orinda: "925-891-7800"
};

// Create the merged array of data objects
export const subdomainData = Object.keys(cityMap).map((subdomain) => {
    return {
        subdomain: subdomain,
        city: cityMap[subdomain] || "Unknown",
        phone: phoneMap[subdomain] || defaultPhoneNumber,
        minimumOrder: areaMinimum[subdomain] || 0
    };
});
