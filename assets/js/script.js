// keys
// positionstack api key
const psApiKey = 'afab31918e1ff171dd53ab2f7e43f9d7';
// mapbox token
const mbToken = 'pk.eyJ1Ijoic291cnNsYXciLCJhIjoiY2tscjlwNnB4MDhxaTJvbWsycjIwaG1mYiJ9.sJ7hhTHyRj2y6RkyRhuIsw';

// form 
const searchForm = document.getElementById('searchField');
const searchInput = document.getElementById('searchText');

const mapZoom = document.getElementById('map');


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
		
		// for opencage api, 1/2
		const lat = `${data[1].results[0].geometry.lat}`;
		const lon = `${data[1].results[0].geometry.lng}`;
		// console.log(`latitude: ${data[1].results[0].geometry.lat}, longitude: ${data[1].results[0].geometry.lng}`)

		map.flyTo({center: [lon, lat], zoom: 11});

		// attempting to populate map with keys at the right time .  .
		populateMark(brews);
		// setTimeout(() => populateMark(brews), 7000);
		return fetch (`https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=99&offset=0&lat=${lat}&lng=${lon}`);
		
	}).then(function(response) {
		return response.json();

	}).then(function(newData) {
		console.log(newData)

		const restRoomsData = newData;

		restRooms.push(restRoomsData);

	});
};

// form handling
function handleForm(event) {
	event.preventDefault();
	console.log(`form submitted, search value: ${searchInput.value}`);

	const requestUrl = `https://api.openbrewerydb.org/breweries?by_city=${searchInput.value}&per_page=50`;
	
	// opencage api for lat/lon since positionstack is down. key is in url (https://opencagedata.com/api), 2/2
	const requestUrlDos = `https://api.opencagedata.com/geocode/v1/json?q=${searchInput.value}&key=eef111c608734d9790eb662afb2657c8`;
	
	getApi(requestUrl, requestUrlDos);

	clear();
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
// restrooms
let restRooms = [
];

const restroomToggle = document.getElementById('restroomToggle');

// event listener for restrooms display checkbox
restroomToggle.addEventListener('change', function() {

	if(this.checked) {
		populateRestrooms(restRooms);
	} else {
		document.querySelectorAll('.otherMarker').forEach(function(marker){
			marker.remove()
		});
	};
});

// populates restrooms to map
function populateRestrooms(restRooms) {
	restRooms.forEach(function(marker) {

		for (i =0; i < marker.length; i++) {

			var el = document.createElement('div');
			el.className = 'otherMarker';

			new mapboxgl.Marker(el)
			.setLngLat(JSON.parse('[' + `${marker[i].longitude}` + ', ' + `${marker[i].latitude}` + ']'))
			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
				.setHTML('<h3>' + `${marker[i].name}` + '</h3><p>' + `${marker[i].street}` + ', ' + `${marker[i].city}` + ', ' + `${marker[i].state}` + '</p>' + '<br>' + 
				'<p>' + `${marker[i].directions}` + '</p><br>' + '<p>' + `${marker[i].comment}` + '</p>'))
			.addTo(map);
		}
	});
};

// test populate from brews array
function populateMark(brews) {
	brews.forEach(function(marker) {

		for (i =0; i < marker.length; i++) {

			var el = document.createElement('div');
			el.className = 'marker';

			// console.log('name: ' + `${marker[i].name}` + ', latitude: ' + `${marker[i].latitude}` + ', longitude: ' + `${marker[i].longitude}`)

			new mapboxgl.Marker(el)
			.setLngLat(JSON.parse('[' + `${marker[i].longitude}` + ', ' + `${marker[i].latitude}` + ']'))
			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
				.setHTML('<h3>' + `${marker[i].name}` + '</h3><p>' + `${marker[i].street}` + ', ' + `${marker[i].city}` + ', ' + `${marker[i].state}` + '</p>' + '<br>' + '<button class="parking-b">Check for Parking </button>'))
			.addTo(map);

			mainCard(brews);

		}
	});
};

const brewsList = document.getElementById('brewsList');
// function to populate list of brewries
function mainCard(brews) {
	
	const cardContainer = document.createElement('li');
	cardContainer.className = '';
	// cardContainer.setAttribute('style', 'width: 35%;');
	cardContainer.setAttribute('id', '');

	const cardClass = document.createElement('div');
	cardClass.setAttribute('class', 'card');

	const pOne = document.createElement('h4');
	pOne.setAttribute('id', 'brewery');
	pOne.innerText = `${brews[0][i].name}`;

	const pTwo = document.createElement('p');
	pTwo.setAttribute('id', 'street');
	pTwo.innerText = `${brews[0][i].street}`;

	const pThree = document.createElement('p');
	pThree.setAttribute('id', 'city');
	pThree.innerText = `${brews[0][i].city}, ${brews[0][i].state}, ${brews[0][i].postal_code}`;

	const pFour = document.createElement('p');
	pFour.setAttribute('id', 'phone');
	pFour.innerText = `${brews[0][i].phone}`;

	cardContainer.append(cardClass);

	cardClass.append(pOne);
	cardClass.append(pTwo);
	cardClass.append(pThree);
	cardClass.append(pFour);

	brewsList.append(cardContainer);
};

// removes brewery ul list elements, clears brews and restrooms arrays, unchecks restroom checkbox if checked
function clear() {

	const byeMain = document.getElementById('brewsList');
	while (byeMain.firstChild) {
		byeMain.removeChild(byeMain.firstChild);
	};

	brews = [];
	restRooms = [];

	document.querySelectorAll('.otherMarker').forEach(function(marker){
		marker.remove()
	});

	restroomToggle.checked = false;
};