# Earthquake Map

A simple web application that displays real-time earthquake data from the USGS API on an interactive map using Leaflet.

## Features

- **Real-time Data:** Fetches the latest earthquake data every 2 minutes.
- **Interactive Map:** Uses Leaflet to display earthquake locations worldwide.
- **Dynamic Markers:** Markers change size and color based on the earthquake's magnitude.
- **Dark Mode:** Toggle between light and dark map tiles and UI.

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
