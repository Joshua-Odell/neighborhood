const newsAPIKey = '63ed41adf23c46b58f5e7d2b8e7b703d'
const newsAPIendpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/news/search' // Bing News search API
const censusAPIKey = 'a95007220d2c9eb1fac73c3590adaea8fe779357'
const censusAPIendpoint = 'https://api.census.gov/data/2019/pep/population' //US census, This limits the app to the US Market
const crimeAPIKey = 'k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG'
const crimeAPIendpoint = 'https://crimeometer.com/sandbox/incidents/raw-data' //CrimeoMeter API Does not support CORS
const longAPIKey = '2c4a3f1979af46d1bbbed1bc3ff8b663'
const longAPIendpoint = 'https://api.opencagedata.com/geocode/v1/json' //OpenCage API
const nasaAPIKey = 'd27jLmmGFDAM1k6g5ZfnfOHrlFcC6yJcrpJLlLbL' 
const nasaAPIendpoint = 'https://api.nasa.gov/planetary/earth/imagery' // Use Nasa to display an image of the area
const googleMapsEndpoint = ""
const googleMapsAPIKey = 'AIzaSyAsROXBiz9KtbUHdEP-wRRtn1hbCDyoA5o'

let count = 0;
let standing = '';


function pull(street, city, state){
    //
    news(city, state);
    long(city,state);
    demographic(city, state);
}

function long(city, state){
    //This function uses Open Cage to convert city and state into lon and lat
    //This is a required parameter for CrimeoMeter 
    //This also may allow for satellite maps to display the location 
    let parameter = {
        q: city + " " + state,
        key: longAPIKey
    }

    let temp= format(parameter);
    let url= longAPIendpoint + '?' + temp;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            let lat= responseJson.results[0].bounds.northeast.lat;
            let lon= responseJson.results[0].bounds.northeast.lng;
            //crime(lon, lat);
            satellite(lon,lat);
            map(lon,lat);
        });
}

function satellite(lon, lat){
//This shows a satellite image of the coordinates, The image quality is poor I will possibly replace this API with the google earth API but there is a waiting period
    let parameter = {
        lon: lon,
        lat: lat,
        dim: .025,
        cloud_score: false,
        api_key: nasaAPIKey
    }
    let temp=format(parameter);
    let url= nasaAPIendpoint + '?' +temp;
    count += 1;
    fetch(url)
        .then(response => {
            let result = response.url
            if (response.ok === true){
                imageHandler(result);
            }
            else {
                satellitePrint("No Satellite Images Available")
            }
        })   
}

function demographic(city, state){
    //get demographic information about the provided city
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
    count += 1;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            generalHandler(responseJson[1], state);
        });
}

function map(lon,lat) {
    let parameter = {
        key: googleMapsAPIKey,
        q: `$(lon), $(lat)`
    }
    let temp=format(parameter);
    let url = googleMapsEndpoint + '?' + temp
    fetch(url)
        .then (response => {
            //console.log(response);
            return response.Json
        })
        .then (responseJson => {
            mapHandler(responseJson)
        });
}

function crime(lon, lat,){
    let range = '7mi';
    let now = new Date();
    let time = now.toISOString();
    let past = now.setFullYear(now.getFullYear()-1);
    console.log(past);
    let parameter = {
        datetime_end: time,
        lon: lon,
        lat: lat,
        distance: range,
        datetime_ini: time, //this needs to be the same format as the previous time but one year earlier
    }

    console.log(parameter.datetime_end);

    let crimeHeaders =  {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "crimeometer.p.rapidapi.com",
            "x-rapidapi-key": "8d49325041msh851e936a17583c6p13d18fjsne9db9126acf3",
            "x-api-key": "k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG",
            "Content-Type": "application/json"
        }
    }

    let temp= format(parameter);
    let url= crimeAPIendpoint + '?' + temp;
    fetch(url, crimeHeaders) //An unknown error is occurring checked: parameters and key
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson.value); 
        });
}

function news(city, state){
    //uses the city and state as a search parameter to pull news
    //Uses Bing News Search API
    //use the from parameter to get information from the past six months
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
        });
}

function mapHandler(array){
    //console.log("map success");
}

function newsHandler(array){
    let result = ''
    //not all items have an image 
    for ( i=0; i<array.length && i<5; i++) {
        let title = array[i].name;
        let description = array[i].description
        //if (array[i].image != undefined){
            //let image = array[i].image.thumbnail.contentUrl;
        //}
        let site = array[i].url;
        let html = `<li> <h5>${title}</h5> <br> <p>${description}</p> <a href='${site}'>read more</a> </li>`;
        result = result + html;
    }
    newsPrint(result);
    result = '';
}

function crimeHandler(array){
    let result=''
    //This will process the results from CrimeoMeter API
    crimePrint(result);
    result = '';
}

function generalHandler(array, state){
    let result=`<h4>${state} Population</h4> <p> ${array[0]} </p>`
    generalPrint(result);
    result = '';
}

function imageHandler(image){
    let result=`<img src="${image}" class="image">`
    satellitePrint(result);
}

function newsPrint(result) {
    $('.newsResultList').empty();
    $('.newsResultList').html(result);
}

function crimePrint(result) {
    $('.crimeResultList').empty();
    $('.crimeResultList').html(result);
}

function generalPrint(result) {
    $('.generalResultList').empty();
    $('.generalResultList').html(result);
    
}

function satellitePrint(result) {
    console.log(result);
    $('.satellite').empty();
    $('.satellite').html(result);
}

function format(parameters){
    const formattedSearch = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        return formattedSearch.join('&');
}



function begin() {
    $('#submit').on('click', function(e) {
        e.preventDefault;
        let street = $('#street').val();
        let city = $('#city').val();
        let state = $('#state').val();
        pull(street, city, state);
        //remove hidden class from links
        $('.results').removeClass('hidden');
        });
    $('.news-header').on('click', function(e) {
        $('.newsResultList').toggle('hidden');

        // 
    });
    $('.crime-header').on('click', function(e) {
        $('.crimeResultList').toggle('hidden');
        // 
    });
    $('.general-header').on('click', function(e) {
        $('.generalResultList').toggle('hidden');
        $('.satellite').toggle('hidden');
        // 
    });
}

$(begin);