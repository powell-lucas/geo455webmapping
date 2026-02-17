const map = L.map("map").setView([43.81642117539796, -91.23209456992531], 13);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([43.82134, -91.19977])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>I am Lookout Prarie, a La Crosse Bluff Overlook.")
  .openPopup();