document.addEventListener("DOMContentLoaded", function () {
    // 🌍 Initialize OpenLayers Map
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM() // OpenStreetMap Tiles
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([10, 50]), // Center over Europe
            zoom: 4
        })
    });

    // 🔄 Load event data from JSON
    fetch('events.json')
        .then(response => response.json())
        .then(events => {
            var vectorSource = new ol.source.Vector(); // Store all markers

            events.forEach(event => {
                if (event.lat !== null && event.lon !== null) {
                    var marker = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([event.lon, event.lat])),
                        name: `${event.category} (${event.gender})`,
                        venue: event.venue,
                        country: event.country,
                        date: event.date
                    });

                    // 🎨 Set marker color based on gender
                    var markerStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 6,
                            fill: new ol.style.Fill({ color: event.gender === "Men" ? "blue" : "red" }),
                            stroke: new ol.style.Stroke({ color: "white", width: 2 })
                        })
                    });

                    marker.setStyle(markerStyle);
                    vectorSource.addFeature(marker);
                }
            });

            // 📍 Create a vector layer with all markers
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            map.addLayer(vectorLayer);

            // 🖱️ Click Event to Show Popup
            map.on('click', function (evt) {
                map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    alert(`${feature.get('name')}\n📍 ${feature.get('venue')}, ${feature.get('country')}\n📅 ${feature.get('date')}`);
                });
            });
        })
        .catch(error => console.error("❌ Error loading event data:", error));
});
