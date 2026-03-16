const map = L.map('map').setView([20, 0], 2);
const lightTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const darkTiles = "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";

let currentTileLayer = L.tileLayer(lightTiles).addTo(map);
let isDark = false;
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 0.75,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Get data from USGS on earthquakes
async function getEarthquakes() {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      const drawMarker = (magnitude) => {
        if (magnitude < 1.5) {
          return {radius: 3, color: '#60b84a'};
        } else if (magnitude < 5) {
          return {radius: 5, color: '#edbb5d'};
        } else if (magnitude < 7) {
          return {radius: 8, color: '#ed5d31'};
        } else {
          return {radius: 10, color: '#ed3131'};
        }
      }

      for (let feature of data.features) {
        let latitude = feature.geometry.coordinates[1];
        let longitude = feature.geometry.coordinates[0];
        let magnitude = feature.properties.mag;
        let info = feature.properties.title;
        // Latitude and Longitude have to be reversed as GEOjson is in reverse order to leaflet
        L.circleMarker([latitude, longitude], drawMarker(magnitude)).addTo(map).bindPopup(info)

        console.log(feature);
      }
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

getEarthquakes()
// refresh data every 2 minutes (120k milliseconds)
setInterval(getEarthquakes, 120000);

// Dark mode toggle that will change map tiles and body class
document.getElementById("darkBtn").addEventListener("click", () => {
  isDark = !isDark;
  currentTileLayer.remove();
  currentTileLayer = L.tileLayer(isDark ? darkTiles : lightTiles).addTo(map);
  document.body.classList.toggle("dark-mode", isDark);
});
