// Create the map object with center and zoom level
let map = L.map('map').setView([37.09, -95.71], 4); // Centered on the USA

// Add a tile layer (the background map image) to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get color based on earthquake depth
function getColor(depth) {
  // Define color ranges based on depth value
  return depth > 90 ? '#ea2c2c' :  // Dark red for deep earthquakes
         depth > 70 ? '#ea822c' :  // Orange-red for moderately deep earthquakes
         depth > 50 ? '#ee9c00' :  // Orange for mid-depth earthquakes
         depth > 30 ? '#eecc00' :  // Yellow-orange for shallower earthquakes
         depth > 10 ? '#d4ee00' :  // Yellow for near-surface earthquakes
                      '#98ee00';   // Light green for very shallow earthquakes
}

// Function to get radius based on magnitude
function getRadius(magnitude) {
  // Check if the magnitude is 0, return a small radius if true
  return magnitude === 0 ? 1 : magnitude * 4;
}

// Fetch earthquake data from the USGS GeoJSON Feed
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
  // Create a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Turn each feature into a circle marker
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style each circle marker
    style: function(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]), // Get color based on depth
        color: '#000000',  // Outline color of the marker (black)
        radius: getRadius(feature.properties.mag), // Size based on magnitude
        stroke: true,
        weight: 0.5
      };
    },
    // Bind a popup to each marker showing details of the earthquake
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map); // Add the layer to the map
});

// Create a legend control object
let legend = L.control({ position: 'bottomright' });

// Add details to the legend
legend.onAdd = function() {
  let div = L.DomUtil.create('div', 'info legend');
  const depths = [-10, 10, 30, 50, 70, 90]; // Depth ranges
  const colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c']; // Corresponding colors

  // Loop through intervals to generate a label with a colored square for each depth range
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }

  return div;
};

// Add the legend to the map
legend.addTo(map);
