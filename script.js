document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([48.8566, 2.3522], 4); // Center map in Europe

    // Load map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Load event data
    fetch('events.json')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                L.marker([event.lat, event.lon])
                    .addTo(map)
                    .bindPopup(`<b>${event.category}</b><br>${event.date}<br>${event.venue}, ${event.country}`);
            });
        })
        .catch(error => console.error("Error loading event data:", error));
});
