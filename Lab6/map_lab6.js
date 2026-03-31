// Create Map
var mymap = L.map("map", {
center: [51.48882027639122, -0.1028811094342392],
zoom: 11
});

// Add Basemap
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Add Minilayer and Minimap
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
minZoom: 0,
maxZoom: 13,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var miniMap = new L.Control.MiniMap(miniLayer, {
toggleDisplay: true,
minimized: false,
position: "bottomleft"
}).addTo(mymap);


// Choropleth Color Palette Function
function getColorDensity(value) {
    return value > 139 ? '#54278f' :
           value > 87  ? '#756bb1' :
           value > 53  ? '#9e9ac8' :
           value > 32  ? '#cbc9e2' :
                         '#f2f0f7' ;
}

// Language Color Palette
function getColorLanguage(value) {
    return value > 4776 ? '#718355' :
           value > 3185  ? '#87986A' :
           value > 2640  ? '#97A97C' :
           value > 1568  ? '#B5C99A' :
           value > 1374  ? '#CFE1B9' :
           value > 1112  ? '#E9F5DB':
                           '#f2f0f7';
}
// Style Function
function styleDensity(feature) {
    return {
        fillColor: getColorDensity(feature.properties.pop_den),
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}

// Language Function
function styleLanguage(feature) {
    return {
        fillColor: getColorLanguage(feature.properties.Eng_Den),
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.9
    };
}

// Highlight Function
function highlightFeature(e) {
    var layer = e.target;
    
    layer.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront() ;
    }
}

// Reset Functions
function resetDensityHighlight(e) {
    densitylayer.resetStyle(e.target);
    e.target.closePopup();
}

// Reset Function for Language
function resetLanguageHighlight(e) {
    languagelayer.resetStyle(e.target);
    e.target.closePopup();
}

// Interaction Functions
function onEachDensityFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.NAME + '</strong><br>' +
        '<span style="color:purple">' + feature.properties.pop_den + ' people/hectare</span>'
    );
    
    layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            e.target.openPopup();
        },
        mouseout: resetDensityHighlight
    });
}

// Language Interaction
function onEachLanguageFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.name + '</strong><br>' +
        '<span style="color:red">' + feature.properties.Eng_Den + ' language density</span>'
    );

    layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            e.target.openPopup();
        },
        mouseout: resetLanguageHighlight
    });
}
// Density Layer function
var densitylayer = L.geoJson(data, {
    style: styleDensity,
    onEachFeature: onEachDensityFeature
}).addTo(mymap);

// Language Layer function
var languagelayer = L.geoJson(datalang, {
    style: styleLanguage,
    onEachFeature: onEachLanguageFeature
});

// Build Legends in the side Panel
function buildLegendHTML(title, grades, colorFunction) {
    var html = '<div class="legend-title">' + title + '</div>';
    
    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1];
        
        html +=
            '<div class="legend-box">' +
                '<span class="legend-color" style="background:' + colorFunction(from +1) + '"></span>' +
                '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' +
            '</div>';
    }
    
    return html;
}

// Insert Density Legend into Side Panel
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
    densityLegendDiv.innerHTML = buildLegendHTML(
        'Population Density',
        [0, 32, 53, 87, 139],
        getColorDensity
    );
}

// Language Legend
var languageLegendDiv = document.getElementById('language-legend');
if (languageLegendDiv) {
    languageLegendDiv.innerHTML = buildLegendHTML(
        'Language Density',
        [1112, 1374, 1568, 2640, 3185, 4776],
        getColorLanguage
    );
}

// Layer Control Panel
var baseLayers = {
    "Population Density": densitylayer,
    "Language Density": languagelayer
};

// Get Rid of Overlay
L.control.layers(baseLayers, null, {
    collapsed: false
}).addTo(mymap);