const map = L.map('map').setView([44.5, -90.5], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([42.9765, -88.1084], { icon: myIcon1 })
  .addTo(map)
  .bindPopup("<b>New Berlin, WI</b><br>New Berlin is my hometown.")
  .openPopup();

var myIcon2 = L.icon({
    iconUrl: 'images/icon_2.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([43.041, -87.9097], { icon: myIcon2 })
  .addTo(map)
  .bindPopup("<b>Milwaukee, WI</b><br>Milwaukee is where a majority of my high school friends live.")
  .openPopup();

var myIcon3 = L.icon({
    iconUrl: 'images/icon_3.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([41.8832, -87.6324], { icon: myIcon3 })
  .addTo(map)
  .bindPopup("<b>Chicago, IL</b><br>Chicago is where a lot of my extended family lives.")
  .openPopup();

var myIcon4 = L.icon({
    iconUrl: 'images/icon_4.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([43.8138, -91.2519], { icon: myIcon4 })
  .addTo(map)
  .bindPopup("<b>La Crosse, WI</b><br>La Crosse is home to our university, UWL.")
  .openPopup();

var myIcon5 = L.icon({
    iconUrl: 'images/icon_5.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([44.9867, -93.2581], { icon: myIcon5 })
  .addTo(map)
  .bindPopup("<b>Minneapolis, MN</b><br>Minneapolis is where a majority of my UWL friends live.")
  .openPopup();

var myIcon6 = L.icon({
    iconUrl: 'images/icon_6.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([44.7319, -93.2177], { icon: myIcon6 })
  .addTo(map)
  .bindPopup("<b>Apple Valley, MN</b><br>Apple Valley is one of my best friend's hometown.")
  .openPopup();

var myIcon7 = L.icon({
    iconUrl: 'images/icon_7.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([46.7845, -92.1055], { icon: myIcon7 })
  .addTo(map)
  .bindPopup("<b>Duluth, MN</b><br>Duluth is where another friend of mine is pursuing his master's degree.")
  .openPopup();

var myIcon8 = L.icon({
    iconUrl: 'images/icon_8.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([43.0722, -89.4008], { icon: myIcon8 })
  .addTo(map)
  .bindPopup("<b>Madison, WI</b><br>Madison is where both my brother and my sister live.")
  .openPopup();

var myIcon9 = L.icon({
    iconUrl: 'images/icon_9.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([45.4711, -89.7299], { icon: myIcon9 })
  .addTo(map)
  .bindPopup("<b>Tomahawk, WI</b><br>Tomahawk is where my brother completed his first internship.")
  .openPopup();

var myIcon10 = L.icon({
    iconUrl: 'images/icon_10.png',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
L.marker([41.8775, -88.067], { icon: myIcon10 })
  .addTo(map)
  .bindPopup("<b>Glen Ellyn, IL</b><br>Glen Ellyn is where my grandma used to live.")
  .openPopup();