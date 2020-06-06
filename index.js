let count = 0;// A weird error is occurring when i delete this unconnected variable

function pull(street, city, state){
    //
    news(city, state);
    long(street, city, state);
    demographic(city, state);
}

function long(street, city, state){
    //This function uses Open Cage to convert city and state into lon and lat
    
    //This also may allow for satellite maps to display the location 
    let parameter = {
        q:street + " " + city + " " + state,
        key: longAPIKey
    }

    let temp= format(parameter);
    let url= longAPIendpoint + '?' + temp;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            let lat= responseJson.results[0].bounds.northeast.lat;
            let lon= responseJson.results[0].bounds.northeast.lng;
            school(lon, lat, state);
            satellite(lon, lat);
            //map(lon, lat); not cors capable
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
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            generalHandler(responseJson[1], state);
        });
}

// function map(lon,lat) {
//     let parameter = {
//         key: googleMapsAPIKey,
//         location: {
//             "lat": lat,
//             "lon": lon
//         }
//     }
//     let temp=format(parameter);
//     let url = googleMapsEndpoint + '?' + temp
//     fetch(url)
//         .then (response => {
//             console.log(response);
//             return response.Json
//         })
//         .then (responseJson => {
//             mapHandler(responseJson)
//         });
// }

function school(lon, lat, state){
    let parameter = {
        st: state,
        nearLongitude: lon,
        nearLatitude: lat,
        appID: schoolID,
        appKey: schoolAPIKey,
        sortBy: "distance"
    }
    let temp= format(parameter);
    let url= schoolEndpoint + '?' + temp;
    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            schoolHandler(responseJson.districtList); 
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

// function mapHandler(array){
//     //console.log("map success");
// }

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

function schoolHandler(array){
    let result=''
    for (i=0; i<array.length; i++){
        let temp = `<li> <h4>${array[i].districtName}</h4> <br> <p>Phone Number: ${array[i].phone}</p> <a href=${array[i].url}>Website</a> </li>`
        result += temp;
    }
    schoolPrint(result);
    result = '';
}

function generalHandler(array, state){
    let num = numberFormat(array[0])
    let result=`<h4>${state} Population</h4> <p> ${num} </p>`
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
    const formattedSearch = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        return formattedSearch.join('&');
}

function numberFormat(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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
    $('.school-header').on('click', function(e) {
        $('.schoolResultList').toggle('hidden');
        // 
    });
    $('.general-header').on('click', function(e) {
        $('.generalResultList').toggle('hidden');
        $('.satellite').toggle('hidden');
        // 
    });
}

$(begin);