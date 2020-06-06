const fips = { AK:02, AL:01, AR:05, AS:60, AZ:04, CA:06, CO:08, CT:09, DC:11, DE:10,
    FL:12, GA:13, GU:66, HI:15, IA:19, ID:16, IL:17, IN:18, KS:20, KY:21, LA:22,
    MA:25, MD:24, ME:23, MI:26, MN:27, MO:29, MS:28, MT:30, NC:37, ND:38, NE:31, NH:33,
    NJ:34, NM:35, NV:32, NY:36, OH:39, OK:40, OR:41, PA:42, PR:72, RI:44, SC:45, SD:46,
    TN:47, TX:48, UT:49, VA:51, VI:78, VT:50, WA:53, WI:55, WV:54, WY:56
}

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
const googleMapsEndpoint = "https://maps.googleapis.com/maps/api/place"
const googleMapsAPIKey = 'AIzaSyBwRT-4MXmCBcLWONx8jQ2-Wrf51iJPHKs'
const schoolAPIKey = '500d665142d0594f2fec8c072d58cdbd'
const schoolID = '0f465d1f'
const schoolEndpoint = 'https://api.schooldigger.com/v1.2/districts'