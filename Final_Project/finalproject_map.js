var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var imagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
});

var grayscale = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
});

var map = L.map("map", {
    center: [38.5, -96.0],
    zoom: 4,
    layers: [grayscale]
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

/* EF Scale Colors */
function getEFColor(ef) {
    switch (ef) {
        case "EF3": return "#fdae61";
        case "EF4": return "#d73027";
        case "EF5": return "#800026";
        default:    return "#aaaaaa";
    }
}

var intensityLayer = L.layerGroup();
var impactLayer = L.layerGroup();
var frequencyLayer = null;

/* Intensity Layer */
function buildIntensityLayer(geojson) {
    intensityLayer.clearLayers();

    L.geoJSON(geojson, {
        style: function (feature) {
            var ef = feature.properties["storm_data_search_results.csv.TOR_F_SCALE"];
            return {
                color: getEFColor(ef),
                weight: 4,
                opacity: 0.85
            };
        },
        onEachFeature: function (feature, layer) {
            var p = feature.properties;

            /* Variables for Each Field */
            var name     = p["storm_data_search_results.csv.BEGIN_LOCATION"] + " to " + p["storm_data_search_results.csv.END_LOCATION"];
            var date     = p["storm_data_search_results.csv.BEGIN_DATE"];
            var ef       = p["storm_data_search_results.csv.TOR_F_SCALE"];
            var deaths   = p["storm_data_search_results.csv.DEATHS_DIRECT"];
            var injuries = p["storm_data_search_results.csv.INJURIES_DIRECT"];
            var state    = p["storm_data_search_results.csv.STATE_ABBR"];
            var length   = p["tornado_prj_Project.length_mi"];
            var damage   = p["storm_data_search_results.csv.DAMAGE_PROPERTY_NUM"];

            /* Popup Information */
            var popupContent =
                "<b>" + name + "</b><br/>" +
                "<b>Date:</b> " + date + "<br/>" +
                "<b>EF Rating:</b> " + ef + "<br/>" +
                "<b>State:</b> " + state + "<br/>" +
                "<b>Fatalities:</b> " + deaths + "<br/>" +
                "<b>Injuries:</b> " + injuries + "<br/>" +
                "<b>Path Length:</b> " + (length ? length.toFixed(2) + " mi" : "—") + "<br/>" +
                "<b>Property Damage:</b> $" + (damage ? damage.toLocaleString() : "0");

            layer.bindPopup(popupContent, { maxWidth: 200 });

            /* Side Panel Information Updates */
            layer.on("click", function () {
                document.getElementById("detail-name").textContent  = name;
                document.getElementById("detail-date").textContent  = date;
                document.getElementById("detail-ef").textContent    = ef;
                document.getElementById("detail-fat").textContent   = deaths;
                document.getElementById("detail-inj").textContent   = injuries;
                document.getElementById("detail-state").textContent = state;
                document.getElementById("detail-len").textContent   = length ? length.toFixed(2) + " mi" : "—";
            });
        }
    }).addTo(intensityLayer);
}

/* Frequency Layer */
function buildFrequencyLayer(geojson) {
    if (frequencyLayer) {
        map.removeLayer(frequencyLayer);
    }

    /* Lat Long Points */
    var heatPoints = [];

    for (var i = 0; i < geojson.features.length; i++) {
        var coords = geojson.features[i].geometry.coordinates;
        heatPoints.push([coords[0][1], coords[0][0], 1.0]);
    }

    frequencyLayer = L.heatLayer(heatPoints, {
        radius: 20,
        blur: 15,
        maxZoom: 8
    });

    if (map.hasLayer(frequencyLayerGroup)) {
        frequencyLayer.addTo(map);
    }
}

var frequencyLayerGroup = L.layerGroup();

/* Impact Layer */
function buildImpactLayer(geojson) {
    impactLayer.clearLayers();

    for (var i = 0; i < geojson.features.length; i++) {
        var feature = geojson.features[i];
        var p = feature.properties;
        var coords = feature.geometry.coordinates;

        var deaths = p["storm_data_search_results.csv.DEATHS_DIRECT"] || 0;
        if (deaths <= 0) continue;

        var name     = p["storm_data_search_results.csv.BEGIN_LOCATION"] + " to " + p["storm_data_search_results.csv.END_LOCATION"];
        var date     = p["storm_data_search_results.csv.BEGIN_DATE"];
        var ef       = p["storm_data_search_results.csv.TOR_F_SCALE"];
        var injuries = p["storm_data_search_results.csv.INJURIES_DIRECT"];
        var state    = p["storm_data_search_results.csv.STATE_ABBR"];
        var damage   = p["storm_data_search_results.csv.DAMAGE_PROPERTY_NUM"];

        var radius = Math.max(6, Math.sqrt(deaths) * 4);

        var lat = coords[0][1];
        var lng = coords[0][0];

        /* Halo Rings */
        var halo = L.circleMarker([lat, lng], {
            radius: radius * 2,
            fillColor: "#d73027",
            color: "#d73027",
            weight: 1,
            fillOpacity: 0.12
        });

        var circle = L.circleMarker([lat, lng], {
            radius: radius,
            fillColor: "#d73027",
            color: "#333",
            weight: 1,
            fillOpacity: 0.8
        });

        /* Popup Information */
        var popupContent =
            "<b>" + name + "</b><br/>" +
            "<b>Date:</b> " + date + "<br/>" +
            "<b>EF Rating:</b> " + ef + "<br/>" +
            "<b>State:</b> " + state + "<br/>" +
            "<b>Fatalities:</b> " + deaths + "<br/>" +
            "<b>Injuries:</b> " + injuries + "<br/>" +
            "<b>Property Damage:</b> $" + (damage ? damage.toLocaleString() : "0");

        circle.bindPopup(popupContent, { maxWidth: 200 });

        /* Side Panel Information */
        circle.on("click", function (e) {
            var cp = e.target.tornadoProps;
            document.getElementById("detail-name").textContent  = cp.name;
            document.getElementById("detail-date").textContent  = cp.date;
            document.getElementById("detail-ef").textContent    = cp.ef;
            document.getElementById("detail-fat").textContent   = cp.deaths;
            document.getElementById("detail-inj").textContent   = cp.injuries;
            document.getElementById("detail-state").textContent = cp.state;
            document.getElementById("detail-len").textContent   = "—";
        });

        circle.tornadoProps = { name: name, date: date, ef: ef, deaths: deaths, injuries: injuries, state: state };

        halo.addTo(impactLayer);
        circle.addTo(impactLayer);
    }
}

/* Stats Panel Updates */
function updateStats(geojson) {
    var totalFat = 0;
    var totalInj = 0;

    for (var i = 0; i < geojson.features.length; i++) {
        var p = geojson.features[i].properties;
        totalFat += p["storm_data_search_results.csv.DEATHS_DIRECT"]   || 0;
        totalInj += p["storm_data_search_results.csv.INJURIES_DIRECT"] || 0;
    }

    document.getElementById("stat-count").textContent = geojson.features.length;
    document.getElementById("stat-fat").textContent   = totalFat.toLocaleString();
    document.getElementById("stat-inj").textContent   = totalInj.toLocaleString();
}

/* Time Slider */
var tornadoData = null;

var slider = document.getElementById("year-slider");
var yearDisplay = document.getElementById("year-display");

slider.addEventListener("input", function () {
    var selectedYear = parseInt(this.value);
    yearDisplay.textContent = selectedYear;

    if (!tornadoData) return;

    var filtered = {
        type: "FeatureCollection",
        features: tornadoData.features.filter(function (f) {
            var date = f.properties["storm_data_search_results.csv.BEGIN_DATE"];
            return parseInt(date.substring(0, 4)) === selectedYear;
        })
    };

    buildIntensityLayer(filtered);
    buildImpactLayer(filtered);
    buildFrequencyLayer(filtered);
    updateStats(filtered);
});

document.getElementById("btn-all-years").addEventListener("click", function () {
    yearDisplay.textContent = "All";
    slider.value = slider.max;
    if (!tornadoData) return;
    buildIntensityLayer(tornadoData);
    buildImpactLayer(tornadoData);
    buildFrequencyLayer(tornadoData);
    updateStats(tornadoData);
});

/* Layer Controls */
var baseLayers = {
    "Grayscale": grayscale,
    "Streets Map": streets,
    "Satellite": imagery
};

var overlays = {
    "Tornado Intensity (EF Scale)": intensityLayer,
    "Tornado Frequency (Heatmap)": frequencyLayerGroup,
    "Tornado Impact (Fatalities)": impactLayer
};

L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);

map.on("overlayadd", function (e) {
    if (e.name === "Tornado Frequency (Heatmap)" && frequencyLayer) {
        frequencyLayer.addTo(map);
    }
});

map.on("overlayremove", function (e) {
    if (e.name === "Tornado Frequency (Heatmap)" && frequencyLayer) {
        map.removeLayer(frequencyLayer);
    }
});

intensityLayer.addTo(map);

/* Legend */
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "leaflet-bar legend");
    div.innerHTML =
        "<b>EF Scale</b><br>" +
        '<span style="background:#fdae61;" class="legend-box"></span> EF3 — Severe<br>' +
        '<span style="background:#d73027;" class="legend-box"></span> EF4 — Devastating<br>' +
        '<span style="background:#800026;" class="legend-box"></span> EF5 — Incredible<br>';
    return div;
};

legend.addTo(map);

/* GeoJSON Data */
fetch("data/tornado_paths.geojson")
    .then(function (response) { return response.json(); })
    .then(function (data) {
        tornadoData = data;
        buildIntensityLayer(tornadoData);
        buildImpactLayer(tornadoData);
        buildFrequencyLayer(tornadoData);
        updateStats(tornadoData);
    })
    .catch(function (err) {
        console.error("Could not load tornado data:", err);
    });
