var mymap = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(mymap);

var commuteLayer = new L.migrationLayer({
  map: mymap,
  data: data,
  pulseRadius: 30,
  pulseBorderWidth: 3,
  arcWidth: 1,
  arcLabel: true,
  arcLabelFont: '10px sans-serif',
  maxWidth: 10
});

// Fetching GeoJSON File
fetch('lab8_data/wi_il_gcs.geojson')
  .then(function(response) {
    return response.json();
  })
  .then(function(wi_ilData) {
    var wi_ilLayer = L.geoJSON(wi_ilData, {
      style: {
        color: '#444',
        weight: 1,
        fillColor: '#d4e6f1',
        fillOpacity: 0.4
      },
      onEachFeature: function(feature, layer) {
        if (feature.properties && feature.properties["wi_il_gcs.NAME"]) {
          layer.bindTooltip(feature.properties["wi_il_gcs.NAME"], {
            permanent: true,
            direction: 'center',
            className: 'county-label'
          });
        }
      }
    }).addTo(mymap);

    // Fit Map to GeoJSON layer
    mymap.fitBounds(wi_ilLayer.getBounds());

    commuteLayer.addTo(mymap);
  })

.catch(function(error) {
    console.error('Error loading GeoJSON file:', error);
  });