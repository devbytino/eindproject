# SEISMIC_CORE - Earthquake Map

A real-time web application that monitors global seismic activity using the USGS API and an interactive Leaflet map.

## Features

- **Real-time Monitoring:** Fetches the latest earthquake data every 2 minutes for up-to-date tracking.
- **Interactive Global Map:** Visualizes earthquake locations worldwide with customized Leaflet tiles.
- **Magnitude-Based Visualization:** Map markers dynamically adjust in size and color (Green, Yellow, Orange, Red) based
  on earthquake magnitude.
- **Advanced Filtering:** Filter the map and list by magnitude (All, 1+, 2+, 3+, 4+, 5+).
- **In-Depth Details Panel:** Selecting an earthquake reveals detailed insights:
  - **Depth Profile:** Visual representation and classification (Shallow, Intermediate, or Deep Focus).
  - **Tsunami Evaluation:** Instant alerts if a tsunami threat is detected.
  - **Map Focus:** Clicking an entry automatically focuses the map on the epicenter.
- **Interactive List View:** Browse earthquakes in a searchable list with "Show More" pagination.
- **Dark Mode Support:** Seamlessly toggle between light and dark UI and map tiles for comfortable viewing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server with hot reload:

```bash
npm start
```

### Build

To create a production-ready build:

```bash
npm run build
```

## Data Sources

- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) for earthquake data.
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles.
