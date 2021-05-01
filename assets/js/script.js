// keys
// positionstack api key
const psApiKey = 'afab31918e1ff171dd53ab2f7e43f9d7';
// mapbox token
const mbToken = 'pk.eyJ1Ijoic291cnNsYXciLCJhIjoiY2tscjlwNnB4MDhxaTJvbWsycjIwaG1mYiJ9.sJ7hhTHyRj2y6RkyRhuIsw';


// form 
const searchForm = document.getElementById('searchField');
const searchInput = document.getElementById('searchText');

const mapZoom = document.getElementById('map');

// outside array
let breweries = [];


function getApi(requestUrl, requestUrlDos) {
	Promise.all([
		fetch(requestUrl),
		fetch(requestUrlDos)
	]).then(function (responses) {
			// console.log(responses);
			return Promise.all(responses.map(function (response) {
				return response.json();
			}));
	}).then(function(data) {
		console.log(data);

		let brewData = data[0];
		brews.push(brewData)

		// const lat = `${data[1].data[0].latitude}`;
		// const lon = `${data[1].data[0].longitude}`;
		// console.log(`latitude: ${data[1].data[0].latitude}, longitude: ${data[1].data[0].longitude}`)

		
		// for opencage api, 1/2
		const lat = `${data[1].results[0].geometry.lat}`;
		const lon = `${data[1].results[0].geometry.lng}`;
		console.log(`latitude: ${data[1].results[0].geometry.lat}, longitude: ${data[1].results[0].geometry.lng}`)


		map.flyTo({center: [lon, lat], zoom: 11});


		// attempting to populate map with keys at the right time .  .
		populateMark(brews);

		// setTimeout(() => populateMark(brews), 7000);

		
	});
};

// form hanldig
function handleForm(event) {
	event.preventDefault();
	console.log(`form submitted, search value: ${searchInput.value}`);

	const requestUrl = `https://api.openbrewerydb.org/breweries?by_city=${searchInput.value}&per_page=50`;
	// const requestUrlDos = `http://api.positionstack.com/v1/forward?access_key=${psApiKey}&country=us&query=${searchInput.value}`;
	
	// opencage api for lat/lon since positionstack is down. key is in url (https://opencagedata.com/api), 2/2
	const requestUrlDos = `https://api.opencagedata.com/geocode/v1/json?q=${searchInput.value}&key=eef111c608734d9790eb662afb2657c8`;
	
	getApi(requestUrl, requestUrlDos);
};

// form submission
searchForm.addEventListener('submit', handleForm);

// loads mapbox map on page load
mapboxgl.accessToken = mbToken;

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: [-96, 37.8],
	zoom: 3
});

// breweries
let brews = [
];

// test populate from brews array
function populateMark(brews) {
	brews.forEach(function(marker) {

		for (i =0; i < marker.length; i++) {
			var el = document.createElement('div');
			el.className = 'marker';

			console.log('name: ' + `${marker[i].name}` + ', latitude: ' + `${marker[i].latitude}` + ', longitude: ' + `${marker[i].longitude}`)

			new mapboxgl.Marker(el)
			.setLngLat(JSON.parse('[' + `${marker[i].longitude}` + ', ' + `${marker[i].latitude}` + ']'))
			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
				.setHTML('<h3>' + `${marker[i].name}` + '</h3><p>' + `${marker[i].street}` + '</p>'))
			.addTo(map);

		}
	});
};