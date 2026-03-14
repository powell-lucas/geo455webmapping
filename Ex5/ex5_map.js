var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var imagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
});

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets]
});

var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

L.easyButton(
    '<img src="images/globe_icon.png" height="60%"/>',
    function () {
        map.setView(homeCenter, homeZoom);
    },
    "Home"
).addTo(map);


/*Create custom popups with images*/
var greatwallPopup = "Great Wall of China<br/><img src='images/great_wall.jpg' alt='Great Wall of China' width='150px'/>";
var chichenPopup = "Chichen-Itza<br/><img src='images/chichen_itza.jpg' alt='Chichen-Itza' width='150px'/>";
var petraPopup = "Petra<br/><img src='images/petra.jpg' alt='Petra' width='150px'/>";
var machuPopup = "Machu Pichu<br/><img src='images/machu_pichu.jpg' alt='Machu Pichu' width='150px'/>";
var christPopup = "Christ the Redeemer<br/><img src='images/christ_redeemer.jpg' alt='Christ the Redeemer' width='150px'/>";
var coloPopup = "Colosseum<br/><img src='images/colosseum.jpg' alt='Colosseum' width='150px'/>";
var tajPopup = "Taj Mahal<br/><img src='images/taj_mahal.jpg' alt='Taj Mahal' width='150px'/>";
var customOptions = {'maxWidth': '150', 'className': 'custom'};

/*LayerGroup and Data Array*/
var landmarks = L.layerGroup();
landmarks.addTo(map);

var wonders = [
    { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup },
    { name: "Chichen-Itza", coords: [20.6793, -88.5682], popupHtml: chichenPopup },
    { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup },
    { name: "Machu Pichu", coords: [-13.1629, -72.5450], popupHtml: machuPopup },
    { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: christPopup },
    { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
    { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml: tajPopup },
];

var iconFiles = [
    "images/icon_1.png",
    "images/icon_2.png",
    "images/icon_3.png",
    "images/icon_4.png",
    "images/icon_5.png",
    "images/icon_6.png",
    "images/icon_7.png",
];

var wonderIcons = [];
for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    })
  );
}

function addWondersToLayer(dataArray, layerGroup, iconsArray) {
    var markers = [];

    for (var i = 0; i < dataArray.length; i++) {
        var feature = dataArray[i];

        var marker = L.marker(feature.coords, { icon: iconsArray[i] })
            .bindPopup(feature.popupHtml, customOptions)
            .bindTooltip(feature.name, { direction: "top", sticky: true, opacity: 0.9 })
            .addTo(layerGroup);

        markers.push(marker);
    }

    return markers;
}

var wonderMarkers = addWondersToLayer(wonders, landmarks, wonderIcons);

var phyGeo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
});

/* Layer control and Menu Item */
var baseLayers = {
    'Streets Map': streets,
    "Physical Geography": phyGeo,
};
var overlays = {};

var clickPopup = L.popup();

function onMapClick(e) {
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;

    // Popup at the clicked location
    clickPopup
        .setLatLng(e.latlng)
        .setContent(
            "You clicked the map at: <br>" +
                "<b>Lat:</b> " + lat.toFixed(5) + "<br>" +
                "<b>Lon:</b> " + lon.toFixed(5)
        )
        .openOn(map);

    // Update the info panel
    document.getElementById("click-lat").textContent = lat.toFixed(5);
    document.getElementById("click-lon").textContent = lon.toFixed(5);
}

// Leaflet event API
map.on("click", onMapClick);

L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);

var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 6;

for (var i = 0; i < wonders.length; i++) {
  (function(index) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-secondary btn-sm text-start";
    btn.innerHTML =
      '<img src="' + iconFiles[index] + '" style="width:18px;height:18px;margin-right:8px;">' +
      wonders[index].name;

    btn.addEventListener("click", function() {
      map.setView(wonders[index].coords, wonderZoom);
      wonderMarkers[index].openPopup();
    });

    buttonsDiv.appendChild(btn);
  })(i);
}

/* --------------------------------------------------------
   REAL-TIME ISS: moving marker + jump button
   -------------------------------------------------------- */

var issIcon = L.icon({
    iconUrl: "images/iss200.png",
    iconSize: [80, 52],
    iconAnchor: [25, 16],
});

var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// API endpoint
var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function getISS() {
    try {
        var response = await fetch(api_url);
        if (!response.ok) throw new Error("ISS API error");
        var data = await response.json();
        var latitude = data.latitude;
        var longitude = data.longitude;

        issMarker.setLatLng([latitude, longitude]);

        document.getElementById("lat").textContent = latitude.toFixed(3);
        document.getElementById("lon").textContent = longitude.toFixed(3);
        document.getElementById("iss-time").textContent = formatTime(new Date());
    } catch (err) {
        document.getElementById("iss-time").textContent = "ISS unavailable";
    }
}

// Initial call + refresh
getISS();
setInterval(getISS, 1000);

// Jump to ISS button
document.getElementById("btn-iss").addEventListener("click", function () {
    var ll = issMarker.getLatLng();
    map.setView([ll.lat, ll.lng], 4);
});

/* --------------------------------------------------------
   EXERCISE 5 - PLUGIN 1: Fullscreen Control
   -------------------------------------------------------- */
L.control.fullscreen({
    position: "topleft",
    title: "Enter fullscreen",
    titleCancel: "Exit fullscreen",
    forceSeparateButton: true
}).addTo(map);


/* --------------------------------------------------------
   EXERCISE 5 - PLUGIN 2: Leaflet Control Geocoder
   -------------------------------------------------------- */
L.Control.geocoder({
    defaultMarkGeocode: true,
    position: "topright",
    placeholder: "Search location...",
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);