// Initialize and add the map & empty markers array
let map;

// The Starting Location
const startPosition = { lat: 42.353350, lng: -71.091525 };

//Create and initialize the map
async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");

    // The map, centered at MiT using startPosition
    map = new Map(document.getElementById('map'), {
        zoom: 14,
        center: startPosition,
        mapId: "MBTA bus locations"
    });
}

//on load completion initialize the map
window.onload = initMap();

//Array to hold bus locations, status, and ID
var busLocations = [];

async function run(){
    // get bus data    
    const locations = await getBusLocations();

    //Loop to grab data from the MBTA JSON data stored in locations and put into the array busLocations
    for (i=0; i<locations.length; i++){
        let tempObj = {};
        tempObj.latLng = { lat: locations[i].attributes.latitude, lng: locations[i].attributes.longitude };
        tempObj.status = locations[i].attributes.current_status;
        tempObj.busId = locations[i].id;
        busLocations[i] = tempObj;
    }
    // timer
    setTimeout(run, 3000);
}

var busMarkers = [];

setInterval(populateBusMarkers, 3000);

async function populateBusMarkers() {
        for (i = 0; i < busLocations.length; i++) {
            const position = busLocations[i].latLng;
            const id = busLocations[i].busId;

            if (busMarkers[i]) {
                busMarkers[i].pin.position = position;
            } else {
                    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
                    var marker = new AdvancedMarkerElement({
                        position: position,
                        id: id,
                        map: map
                    })
                    busMarkers.push({id: id, pin: marker});
                   
            }
            console.log(busMarkers);
        }}
   



// Request bus data from MBTA
async function getBusLocations(){
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json     = await response.json();
    return json.data;
}

run();