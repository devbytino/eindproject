const map = L.map('map', {
  center: [20, 0],
  zoom: 2,
  minZoom: 2  // min zoom level to limit the amount
});
const lightTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const darkTiles = "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";

let currentTileLayer = L.tileLayer(lightTiles).addTo(map);
let isDark = false;
let earthquakeData = null; // Store fetched earthquake data
let earthquakeMarkers = L.layerGroup().addTo(map); // Group to manage markers
let displayedCount = 10; // Initial number of items to show

// Set initial tile layers with attribution
L.tileLayer(lightTiles, {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Function to determine marker style based on magnitude
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

// Function to render markers and list based on selected filter
function renderEarthquakes(filterValue) {
  if (!earthquakeData) return;

  const list = document.getElementById('earthquake-list');
  list.innerHTML = ''; // Clear old list items
  earthquakeMarkers.clearLayers(); // Clear old markers from map

  // Filter features based on magnitude
  const filteredFeatures = earthquakeData.features.filter(feature => {
    if (filterValue === 'all') return true;
    const minMag = parseInt(filterValue);
    return feature.properties.mag >= minMag;
  });

  filteredFeatures.forEach((feature, index) => {
    let latitude = feature.geometry.coordinates[1];
    let longitude = feature.geometry.coordinates[0];
    let magnitude = feature.properties.mag;
    let info = feature.properties.title;

    // Add circle markers to map group (all filtered markers on map)
    L.circleMarker([latitude, longitude], drawMarker(magnitude))
      .addTo(earthquakeMarkers)
      .bindPopup(info)
      .on('click', () => showDetail(feature));

    // Only add to the list if within the displayedCount
    if (index < displayedCount) {
      // Create list item and link for each earthquake
      const mag = feature.properties.mag;
      const place = feature.properties.place;
      const time = new Date(feature.properties.time).toLocaleTimeString();
      const url = feature.properties.url;
      const li = document.createElement('li');
      li.textContent = `Magnitude ${mag} — ${place} at ${time} `;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => showDetail(feature));
      list.appendChild(li);
    }
  });

  // Show or hide button
  const showMoreBtn = document.getElementById('show-more-btn');
  if (filteredFeatures.length > displayedCount) {
    showMoreBtn.style.display = 'block';
  } else {
    showMoreBtn.style.display = 'none';
  }
}

// Get data from USGS on earthquakes
async function getEarthquakes() {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    if (response.ok) {

      earthquakeData = await response.json();
      console.log('Earthquake Data:', earthquakeData);
      const currentFilter = document.getElementById('filterByMag').value;
      renderEarthquakes(currentFilter);
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

document.getElementById('filterByMag').addEventListener('change', (e) => {
  displayedCount = 10; // Reset displayedCount when filter changes
  renderEarthquakes(e.target.value);
});

// "Show More" button event listener
document.getElementById('show-more-btn').addEventListener('click', () => {
  displayedCount += 10; // Increase count
  const currentFilter = document.getElementById('filterByMag').value;
  renderEarthquakes(currentFilter);
});

getEarthquakes();
// refresh data every 2 minutes (120k milliseconds)
setInterval(getEarthquakes, 120000);

// Dark mode toggle that will change map tiles and body class
document.getElementById("darkBtn").addEventListener("click", () => {
  isDark = !isDark;
  currentTileLayer.remove();
  currentTileLayer = L.tileLayer(isDark ? darkTiles : lightTiles).addTo(map);
  document.body.classList.toggle("dark-mode", isDark);
});

function showDetail(quake) {
  const panel = document.getElementById('details-panel');
  const props = quake.properties;
  const coords = quake.geometry.coordinates;
  let time = new Date(props.time).toLocaleString()
  let html = '';
  html += `
    <div class="detail-header">
      <h2>${props.place}</h2>
      <p class="detail-time">DETECTED: ${time}</p>
    </div>
    <div class="detail-cards">
      <div class="detail-card">
        <span class="card-label">MAGNITUDE</span>
        <span class="card-value">${props.mag.toFixed(2)}</span>
      </div>
      <div class="detail-card">
        <span class="card-label">DEPTH PROFILE</span>
        <span class="card-value">${coords[2].toFixed(2)} km</span>
      </div>
    </div>
    <a class="detail-link" href="${props.url}" target="_blank">View on USGS →</a>
  `;
  panel.innerHTML = html;

  panel.classList.remove('hidden');
  map.flyTo([coords[1], coords[0]], 6);
}
