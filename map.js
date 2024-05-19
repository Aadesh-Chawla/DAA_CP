// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define city coordinates
var cities = [
  { name: 'New York', coordinates: [40.7128, -74.0060] },
  { name: 'London', coordinates: [51.5074, -0.1278] },
  { name: 'Tokyo', coordinates: [35.6895, 139.6917] },
  { name: 'Sydney', coordinates: [-33.8688, 151.2093] },
  { name: 'Cairo', coordinates: [30.0444, 31.2357] },
  { name: 'Paris', coordinates: [48.8566, 2.3522] },
  { name: 'Beijing', coordinates: [39.9042, 116.4074] },
  { name: 'Moscow', coordinates: [55.7558, 37.6173] },
  { name: 'Rio de Janeiro', coordinates: [-22.9068, -43.1729] },
  { name: 'Cape Town', coordinates: [-33.9249, 18.4241] },
  { name: 'Mumbai', coordinates: [19.0760, 72.8777] },
  { name: 'Los Angeles', coordinates: [34.0522, -118.2437] },
  { name: 'Buenos Aires', coordinates: [-34.6037, -58.3816] },
  { name: 'Toronto', coordinates: [43.651070, -79.347015] },
  { name: 'Dubai', coordinates: [25.2048, 55.2708] },
  { name: 'Berlin', coordinates: [52.5200, 13.4050] }
];

// Function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(coord1, coord2) {
  var R = 6371; // Radius of the Earth in km
  var dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  var dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

// Function to generate a random number between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to find the shortest path using Dijkstra's algorithm
function dijkstra(graph, start) {
  var distances = {};
  var prev = {};
  var pq = new PriorityQueue();

  // Initialize distances and priority queue
  graph.forEach((_, index) => {
    distances[index] = Infinity;
    prev[index] = null;
  });
  distances[start] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    var minNode = pq.dequeue().element;
    graph[minNode].forEach(neighbor => {
      var alt = distances[minNode] + neighbor.distance;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        prev[neighbor.node] = minNode;
        pq.enqueue(neighbor.node, alt);
      }
    });
  }

  return { distances, prev };
}

// Priority queue implementation for Dijkstra's algorithm
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    var queueElement = { element, priority };
    var added = false;
    for (var i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 1, queueElement);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Event listener for map click
var startSelected = false;
var startCoords;
var endCoords;
map.on('click', function(e) {
  // Clear previous markers and paths
  map.eachLayer(function(layer) {
    if (!(layer instanceof L.TileLayer)) {
      map.removeLayer(layer);
    }
  });

  if (!startSelected) {
    startCoords = [e.latlng.lat, e.latlng.lng];
    L.marker(startCoords).addTo(map).bindPopup('Start Point').openPopup();
    startSelected = true;

    // Add markers for defined cities
    cities.forEach(function(city) {
      L.marker(city.coordinates, {icon: grayIcon}).addTo(map).bindPopup(city.name);
    });
  } else {
    endCoords = [e.latlng.lat, e.latlng.lng];
    L.marker(endCoords).addTo(map).bindPopup('End Point').openPopup();

    // Create a graph for Dijkstra's algorithm
    var graph = [];
    cities.forEach((city, index) => {
      var neighbors = cities.map((neighbor, neighborIndex) => {
        return { node: neighborIndex, distance: calculateDistance(city.coordinates, neighbor.coordinates) };
      });
      graph.push(neighbors);
    });

    // Find the shortest path
    var { distances, prev } = dijkstra(graph, 0);

    // Trace the shortest path back
    var path = [];
    var endIndex = findClosestCityIndex(endCoords);
    for (var at = endIndex; at !== null; at = prev[at]) {
      path.push(at);
    }
    path.reverse();

    // Visualize the path
    var pathCoords = path.map(index => cities[index].coordinates);
    pathCoords.unshift(startCoords);
    L.polyline(pathCoords, { color: 'blue' }).addTo(map);
  }
});

// Function to find index of the closest city to given coordinates
function findClosestCityIndex(coords) {
  var minDistance = Infinity;
  var closestIndex = null;
  for (var i = 0; i < cities.length; i++) {
    var distance = calculateDistance(coords, cities[i].coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }
  return closestIndex;
}

// Custom icon for defined
