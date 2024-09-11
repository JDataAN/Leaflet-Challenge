// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson').then(function(data) {
  // Define color scale based on depth
  function getColor(depth) {
    return depth > 90 ? '#ea2c2c' :
           depth > 70 ? '#ea822c' :
           depth > 50 ? '#ee9c00' :
           depth > 30 ? '#eecc00' :
           depth > 10 ? '#d4ee00' :
                        '#98ee00';
  }

  // Define size scale based on magnitude
  function getSize(magnitude) {
    return magnitude * 4;
  }

  // Add each earthquake to the map
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map);

  // Create a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 10, 30, 50, 70, 90],
        labels = [];

    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
});
