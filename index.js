const newsAPIKey = '63ed41adf23c46b58f5e7d2b8e7b703d'
const newsAPIendpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/news/search'


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
        myHeaders.append("Ocp-Apim-Subscription-Key", "63ed41adf23c46b58f5e7d2b8e7b703d");

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
            console.log(responseJson); 
        });
}

function format(parameters){
    const formattedSearch = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        return formattedSearch.join('&');
}

function crime(street, city, state){
    // uses location to pull crime stats 
    // Unknown crime API
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
        });
    
}

$(begin);