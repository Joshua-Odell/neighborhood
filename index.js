var map;
var service;
var infowindow;

function pull(street, city, state){
    //This function separate those APIs that need coordinates and those that do not
    news(city, state);
    long(street, city, state);
    demographic(city, state);
}

function long(street, city, state){
    //This function uses Open Cage to convert city and state into lon and lat
    //This is then used in later APIs
    let parameter = {
        q:street + " " + city + " " + state,
        key: longAPIKey
    }

    let temp= format(parameter);

    let url= longAPIendpoint + '?' + temp;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            const lat= responseJson.results[0].bounds.northeast.lat;
            const lon= responseJson.results[0].bounds.northeast.lng;
            school(lon, lat, state);
            satellite(lon, lat);
            initMap(lon, lat);
        })
        .catch((error) => {
            console.error;
        });
}

function satellite(lon, lat){
//This shows a satellite image of the coordinates
//The image is dependant on wether there is an applicable image for the search
//If there is no relevant data it logs a message about there being no image
    let parameter = {
        lon: lon,
        lat: lat,
        dim: .025,
        cloud_score: false,
        api_key: nasaAPIKey
    }
    let temp=format(parameter);
    let url= nasaAPIendpoint + '?' +temp;
    fetch(url)
        .then(response => {
            let result = response.url
            if (response.ok){
                imageHandler(result);
            }
            else {
                satellitePrint("No Satellite Images Available")
            }
        })
        .catch((error) => {
            console.error;
        });
}

function demographic(city, state){
    //get demographic information about the provided State
    let mid = $(fips[state]);
    let stand =mid[0];
    let parameter = {
        key: censusAPIKey,
        get: 'POP',
        //for: 'consolidated city:' + city,
        for: 'state:' + stand
    }
    let temp=format(parameter);
    let url = censusAPIendpoint + '?' + temp;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            generalHandler(responseJson[1], state);
        })
        .catch((error) => {
            console.log(error);
        });
}

function school(lon, lat, state){
    //Returns the top five districts that are relevant to the search 
    let parameter = {
        st: state,
        appID: schoolID,
        appKey: schoolAPIKey,
        sortBy: "distance",
        nearLatitude: lat,
        nearLongitude: lon
    }
    let temp= format(parameter);
    let url= schoolEndpoint + '?' + temp;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            schoolHandler(responseJson.districtList); 
        })
        .catch((error) => {
            console.log(error);
        });
}

function news(city, state){
    //uses the city and state as a search parameter to pull news
    //Uses Bing News Search API
    let parameter = {
        q: city + ", " + state
    }
    
    var myHeaders = new Headers();
        myHeaders.append("Ocp-Apim-Subscription-Key", newsAPIKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let temp=format(parameter);
    let url = newsAPIendpoint + '?' + temp;
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(responseJson => {
            newsHandler(responseJson.value); 
        })
        .catch((error) => {
            console.log(error);
        });
}

function initMap(lon, lat) {
    //this uses the google maps API to return a map based on the coordinates calculated
    let options = {
        zoom:13,
        center:{lat: lat, lng: lon}
    }

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(
        document.getElementById('map'), options);

    let marker = new google.maps.Marker({
        position:{lat: lat, lng: lon},
        map: map
    })
    
}

function newsHandler(array){
    //Uses Bing API to return top five regional news stories
    let result = '' 
    for ( i=0; i<array.length && i<5; i++) {
        let title = array[i].name;
        let description = array[i].description
        let site = array[i].url;
        let html = `<li> <h5>${title}</h5> <br> <p>${description}</p> <a href='${site}'>read more</a> </li>`;
        result = result + html;
    }
    newsPrint(result);
    result = '';
}

function schoolHandler(array){
    //iterates through the data returned to display school districts
    let displayLimit = 5;
    let result=''
    for (i=0; i<array.length && i<displayLimit ; i++){
        let temp = `<li> <h4>${array[i].districtName}</h4> <br> <p>Phone Number: ${array[i].phone}</p> <a href=${array[i].url}>Website</a> </li>`
        result += temp;
    }
    schoolPrint(result);
    result = '';
}

function generalHandler(array, state){
    //Takes the return from the census to present user with population data
    let num = numberFormat(array[0])
    let result=`<h4>${state} Population</h4> <p> ${num} </p>`
    generalPrint(result);
    result = '';
}

function imageHandler(image){
    //returns image format
    let result=`<img src="${image}" class="image">`
    satellitePrint(result);
}

function newsPrint(result) {
    $('.newsResultList').empty();
    $('.newsResultList').html(result);
}

function schoolPrint(result) {
    $('.schoolResultList').empty();
    $('.schoolResultList').html(result);
}

function generalPrint(result) {
    $('.generalResultList').empty();
    $('.generalResultList').html(result);
    
}

function satellitePrint(result) {
    $('.satellite').empty();
    $('.satellite').html(result);
}

function format(parameters){
    //used to put various parameters into proper form for .fetch()
    const formattedSearch = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        return formattedSearch.join('&');
}

function numberFormat(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function begin() {
    //starts the chain of functions and handles the information flow for the user
    $('#submit').on('click', function(e) {
        e.preventDefault;
        let street = $('#street').val();
        let city = $('#city').val();
        let state = $('#state').val();
        pull(street, city, state);
        //remove hidden class from links
        $('.response-groups').toggle('hidden');
        $('.searchBar').toggle('hidden');
        $('header').on('click', function(e){
            $('.response-groups').toggle('hidden');
            $('.searchBar').toggle('hidden');
        });
    });
    $('.news-header').on('click', function(e) {
        $('.newsResultList').toggle('hidden');
        // 
    });
    $('.school-header').on('click', function(e) {
        $('.schoolResultList').toggle('hidden');
        // 
    });
    $('.general-header').on('click', function(e) {
        $('.generalResultList').toggle('hidden');
        $('.satellite').toggle('hidden');
        $('#map').toggle('hidden');
        // 
    });
    
    
}

$(begin);
