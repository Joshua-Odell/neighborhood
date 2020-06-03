const newsAPIKey = '63ed41adf23c46b58f5e7d2b8e7b703d'
const newsAPIendpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/news/search'

let result = ''

function pull(street, city, state){
    //
    news(city, state);
}



function news(city, state){
    //uses the city and state as a search parameter to pull news
    //News API
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
            handler(responseJson.value); 
        });
}

function handler(array){
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
    print(result);
    result = '';
}

function print(result) {
    $('.newsResultList').empty();
    $('.newsResultList').html(result);
}

function format(parameters){
    const formattedSearch = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        return formattedSearch.join('&');
}

function crime(street, city, state){
    // uses location to pull crime stats 
    // Crime Data API https://rapidapi.com/jgentes/api/crime-data/endpoints
    let parameter = {
        apiKey: newsAPIKey,
        q: city + ", " + state
    }
    let temp=format(parameter);
    let url = newsAPIendpoint + '?' + temp;
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