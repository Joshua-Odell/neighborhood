const newsAPIKey = '63ed41adf23c46b58f5e7d2b8e7b703d'
const newsAPIendpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/news/search' // Bing News search API
const censusAPIKey = 'a95007220d2c9eb1fac73c3590adaea8fe779357'
const censusAPIendpoint = 'https://api.census.gov/data/2019/pep/population' //US census, This limits the app to the US Market
const crimeAPIKey = 'k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG'
const crimeAPIendpoint = 'https://crimeometer.p.rapidapi.comstats/' //CrimeoMeter API
const longAPIKey = '2c4a3f1979af46d1bbbed1bc3ff8b663'
const longAPIendpoint = 'https://api.opencagedata.com/geocode/v1/json' //OpenCage API



function pull(street, city, state){
    //
    news(city, state);
    long(city,state);
}

function long(city, state){
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
            crime(lon, lat);
        });
}

function demographic(city, state){
    //get demographic information about the provided city
    let parameter = {
        apiKey: newsAPIKey,
        q: city + ", " + state
    }
    let temp=format(parameter);
    let url = newsAPIendpoint + '?' + temp;
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
            "x-api-key": "k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG"
        }
    }

    let temp= format(parameter);
    let url= crimeAPIendpoint + '?' + temp;
    fetch(url, crimeHeaders) //An unkown error is occuring checked: parameters and key
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

function generalHandler(array){
    let result=''
    //This will process the results from CrimeoMeter API
    generalPrint(result);
    result = '';
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
        console.log("crime");
        // 
    });
    $('.general-header').on('click', function(e) {
        $('.generalResultList').toggle('hidden');
        console.log("general");
        // 
    });
}

$(begin);