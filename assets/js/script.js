// var Submitbox = document.querySelector('#SearchBox')
// var submmitbutton = document.querySelector('#submmitbtn')
// var Cervecerias = document.querySelector('#listofB')

// var State = function() {
//     var userinput = Submitbox.value.trim()
//     console.log(userinput)

//     var state = 'https://api.openbrewerydb.org/breweries?by_state=' + userinput

//     fetch(state)
//         .then(response => {
//             console.log(response);
//             response.json().then(function(data) {
//                     console.log(data);
//                     Display(data, userinput)

//                 })
//                 .catch(err => {
//                     console.error(err);
//                 })
//         })



// }

// var Display = function(data, userinput) {
//     console.log(userinput)
//     console.log(data)

//     for (let i = 0; i < data.length; i++) {
//         var breweriesName = data[i].name
//         var breweriesstreet = data[i].street + ', ' + data[i].city

//         var ListofB = document.createElement('li')
//         ListofB.innerHTML = '<h2>' + breweriesName + '</h2>' + '<h3>' + breweriesstreet + '</h3>' + '<br>'
//         Cervecerias.appendChild(ListofB)
//     }
// }

// submmitbutton.addEventListener('click', State)
// keys
// positionstack api key
const psApiKey = 'afab31918e1ff171dd53ab2f7e43f9d7';
// mapbox token
const mbToken = 'pk.eyJ1Ijoic291cnNsYXciLCJhIjoiY2tscjlwNnB4MDhxaTJvbWsycjIwaG1mYiJ9.sJ7hhTHyRj2y6RkyRhuIsw';
// form 
const searchForm = document.getElementById('searchField');
const searchInput = document.getElementById('searchText');
// outside array
let breweries = [];
// promise all (https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/)
function getApi(requestUrl, requestUrlDos, requestUrlTres) {

    Promise.all([
        fetch(requestUrl),
        fetch(requestUrlDos)
    ]).then(function(responses) {
        // console.log(responses);
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function(data) {
        // console.log(data);
        let brewData = data[0];
        brews.push(brewData)
            // console.log(data[1].data[0].latitude);
            // console.log(data[1].data[0].longitude);
        const lat = `${data[1].data[0].latitude}`;
        const lon = `${data[1].data[0].longitude}`;
        // console.log(`latitude: ${data[1].data[0].latitude}, longitude: ${data[1].data[0].longitude}`)
        // var map = new mapboxgl.Map({
        //     container: 'map',
        //     style: 'mapbox://styles/mapbox/light-v10',
        //     center: [lon, lat],
        //     zoom: 11
        // });
        // Option for zooming
        map.flyTo({ center: [lon, lat], zoom: 11 });
    });
    populateMark(brews)
};
// form hanldig
function handleForm(event) {
    event.preventDefault();
    // console.log(`form submitted, search value: ${searchInput.value}`);
    const requestUrl = `https://api.openbrewerydb.org/breweries?by_city=${searchInput.value}`;
    const requestUrlDos = `http://api.positionstack.com/v1/forward?access_key=${psApiKey}&country=us&query=${searchInput.value}`;

    getApi(requestUrl, requestUrlDos);
};
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
let brews = [];
// geoJSON data array
// var geojson = {
// 	type: 'FeatureCollection',
// 	features: [{
// 		type: 'Feature',
// 		geometry: {
// 		type: 'Point',
// 		coordinates: [-121.4811835, 38.57323961]
// 		},
// 		properties: {
// 		title: 'alaro craft brewery',
// 		description: 'address'
// 		}
// 	},
// 	{
// 		type: 'Feature',
// 		geometry: {
// 		type: 'Point',
// 		coordinates: [-121.4263334, 38.68887875]
// 		},
// 		properties: {
// 		title: 'Big Stump Brewing Company',
// 		description: 'address'
// 		}
// 	}]
// };
// function that adds markers to map
// function populateMark(geojson) {
// 	geojson.features.forEach(function(marker) {
// 		// create a HTML element for each feature
// 		var el = document.createElement('div');
// 		el.className = 'marker';
// 		// make a marker for each feature and add to the map
// 		new mapboxgl.Marker(el)
// 			.setLngLat(marker.geometry.coordinates)
// 			.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
// 				.setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
// 			.addTo(mapB);
// 	});
// };
// populateMark(geojson);
// test populate from brews array
function populateMark(brews) {
    brews.forEach(function(marker) {
        //$(brews).each(function() {

        // create a HTML element for each feature
        // var el = document.createElement('div');
        // el.className = 'marker';
        //console.log(marker);
        console.log(this)
        for (i = 0; i < marker.length; i++) {
            var el = document.createElement('div');
            el.className = 'marker';
            console.log('name: ' + `${marker[i].name}` + ', latitude: ' + `${marker[i].latitude}` + ', longitude: ' + `${marker[i].longitude}`)
            new mapboxgl.Marker(el)
                .setLngLat(JSON.parse('[' + `${marker[i].longitude}` + ', ' + `${marker[i].latitude}` + ']'))
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML('<h3>' + `${marker[i].name}` + '</h3><p>' + `${marker[i].street}` + '</p>'))
                .addTo(map);
            // console.log('[' + `${marker[i].longitude}` + ', ' + `${marker[i].latitude}` + ']');
            // console.log(typeof(JSON.parse('[' + `${marker[i].longitude}` + ', ' + `${marker[i].latitude}` + ']')));
            // console.log(`${marker[i].longitude}, ${marker[i].latitude}`);
        }
        // make a marker for each feature and add to the map
        // new mapboxgl.Marker(el)
        // 	.setLngLat(`${marker[i].longitude}, ${marker[i].latitude}`)
        // 	.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        // 		.setHTML('<h3>' + `${marker[i].name}` + '</h3><p>' + `${marker[i].street}` + '</p>'))
        // 	.addTo(map);
    });
};