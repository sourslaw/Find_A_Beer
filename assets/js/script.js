var Submitbox = document.querySelector('#SearchBox')
var submmitbutton = document.querySelector('#submmitbtn')
var Cervecerias = document.querySelector('#listofB')

var State = function() {
    var userinput = Submitbox.value.trim()
    console.log(userinput)

    var state = 'https://api.openbrewerydb.org/breweries?by_state=' + userinput

    fetch(state)
        .then(response => {
            console.log(response);
            response.json().then(function(data) {
                    console.log(data);
                    Display(data, userinput)

                })
                .catch(err => {
                    console.error(err);
                })
        })



}

var Display = function(data, userinput) {
    console.log(userinput)
    console.log(data)

    for (let i = 0; i < data.length; i++) {
        var breweriesName = data[i].name
        var breweriesstreet = data[i].street + ', ' + data[i].city

        var ListofB = document.createElement('li')
        ListofB.innerHTML = '<h2>' + breweriesName + '</h2>' + '<h3>' + breweriesstreet + '</h3>' + '<br>'
        Cervecerias.appendChild(ListofB)
    }
}

submmitbutton.addEventListener('click', State)