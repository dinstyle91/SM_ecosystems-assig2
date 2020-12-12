const express = require ('express');
const Datastore = require('nedb');
const fetch = require ('node-fetch');
const Twit = require('twit')
//const notifier = require('node-notifier');
const open = require('open');
const franc = require('franc')

const app = express(); // this is the application which can listen
const database = new Datastore('database.db'); // this can just be an array too? const database = [];
const twitData1 = new Datastore('twitData1.db');;
database.loadDatabase(); // this will load the previous db or create one if there is no previous one
twitData1.loadDatabase();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at port ${port}`));
app.use(express.static('public')); // the files in this folder will be available to be sent to the client side, these are static files
app.use(express.json({limit: '1mb'})); // our server now understands incoming data as json

app.get ('/api', (request, response) => { // sends data to the client
    database.find({}, (err, data) => { //making the query to the database
        if (err){ // small error handling
            response.end();
            return; 
        }
        response.json(data);    
    });
});

app.post ('/api', (request, response) => { // retrieves data from the client
    //console.log(request.body); // we only want to see the boy of the request, not the whole dataset with all the meta info
    const myGeoData =request.body; // the things send by the client will be stored in this variable
    const timestamp= Date.now(); // current time
    myGeoData.timestamp = timestamp; // the timestamp data will be added to the things sent by the client
    response.json(myGeoData);
});

app.get ('/all', (request,response) => { //retrieve things from the db
    //response.json({test: 123});
    // We will now query the database to find what we want to return
    database.find({}, (err, data) => { //making the query to the database
        if (err){ // small error handling
            response.end();
            return; 
        }
        response.json(data);    
    });
});

app.get ('/geolocation', async (request,response) => { //retrieve data from the geolocation api, making a route named geolocation to put things in the client
    // geolocation api through a proxy server
    const api_url = 'http://api.ipstack.com/check?access_key=2b3f8bfcb5dc658c9e39e55b1afa7988&language=en';
    const api_response = await fetch (api_url);
    const json_api_response = await  api_response.json(); 
    //console.log(json_api_response.city);
    //const city = json_api_response.city;
    response.json(json_api_response); 
    });
app.get ('/weather/:latlon', async (request,response) => { //retrieve data from the weather api, making a rout named weather to put things in the client
    // weather api through a proxy server
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3bd42af1dfe14c31a167e59ab67372d6`;
    const api_response = await fetch (api_url);
    const json_api_response = await  api_response.json(); 
    response.json(json_api_response);  
});
app.get ('/geolocation2/:myInput', async (request,response) => { //retrieve data from the weather api, making a rout named weather to put things in the client
  // second geolocation api through a proxy server
  const myInput = request.params.myInput;
  const api_url = `http://api.positionstack.com/v1/forward?access_key=d891ccda30e743219b1bb29686ff165e&query=${myInput}`;
  //console.log(api_url);
  const api_response = await fetch (api_url);
  const json_api_response = await  api_response.json(); 
  response.json(json_api_response);  
});



app.get ('/seCovid/:region', async (request,response) => { //my server will retrieve data from the swedish covid api
    const region = request.params.region;
    //console.log('I am in the weather api back end. My region is: ');    
    const newRegion = region.replace(/\s/g, '_');
    //console.log(newRegion);
    const api_url = `https://services5.arcgis.com/fsYDFeRKu1hELJJs/arcgis/rest/services/FOHM_Covid_19_FME_1/FeatureServer/1/query?where=1%3D1&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=Statistikdatum+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=10&sqlFormat=none&f=pjson&token=`;
    const api_response = await fetch (api_url);
    const json_api_response = await  api_response.json(); 
    //console.log(json_api_response.features[5].attributes.Gävleborg);
    //console.log(newRegion=='Västra_Götaland');
    const Blekinge = [json_api_response.features[0].attributes.Blekinge,json_api_response.features[1].attributes.Blekinge,json_api_response.features[2].attributes.Blekinge,json_api_response.features[3].attributes.Blekinge,json_api_response.features[4].attributes.Blekinge,json_api_response.features[5].attributes.Blekinge];
    const Dalarna = [json_api_response.features[0].attributes.Dalarna,json_api_response.features[1].attributes.Dalarna,json_api_response.features[2].attributes.Dalarna,json_api_response.features[3].attributes.Dalarna,json_api_response.features[4].attributes.Dalarna,json_api_response.features[5].attributes.Dalarna];
    const Gotland = [json_api_response.features[0].attributes.Gotland,json_api_response.features[1].attributes.Gotland,json_api_response.features[2].attributes.Gotland,json_api_response.features[3].attributes.Gotland,json_api_response.features[4].attributes.Gotland,json_api_response.features[5].attributes.Gotland];
    const Gävleborg = [json_api_response.features[0].attributes.Gävleborg,json_api_response.features[1].attributes.Gävleborg,json_api_response.features[2].attributes.Gävleborg,json_api_response.features[3].attributes.Gävleborg,json_api_response.features[4].attributes.Gävleborg,json_api_response.features[5].attributes.Gävleborg];
    const Halland = [json_api_response.features[0].attributes.Halland,json_api_response.features[1].attributes.Halland,json_api_response.features[2].attributes.Halland,json_api_response.features[3].attributes.Halland,json_api_response.features[4].attributes.Halland,json_api_response.features[5].attributes.Halland];
    const Jämtland = [json_api_response.features[0].attributes.Jämtland,json_api_response.features[1].attributes.Jämtland,json_api_response.features[2].attributes.Jämtland,json_api_response.features[3].attributes.Jämtland,json_api_response.features[4].attributes.Jämtland,json_api_response.features[5].attributes.Jämtland];
    const Jönköping = [json_api_response.features[0].attributes.Jönköping,json_api_response.features[1].attributes.Jönköping,json_api_response.features[2].attributes.Jönköping,json_api_response.features[3].attributes.Jönköping,json_api_response.features[4].attributes.Jönköping,json_api_response.features[5].attributes.Jönköping];
    const Kalmar = [json_api_response.features[0].attributes.Kalmar,json_api_response.features[1].attributes.Kalmar,json_api_response.features[2].attributes.Kalmar,json_api_response.features[3].attributes.Kalmar,json_api_response.features[4].attributes.Kalmar,json_api_response.features[5].attributes.Kalmar];
    const Kronoberg = [json_api_response.features[0].attributes.Kronoberg,json_api_response.features[1].attributes.Kronoberg,json_api_response.features[2].attributes.Kronoberg,json_api_response.features[3].attributes.Kronoberg,json_api_response.features[4].attributes.Kronoberg,json_api_response.features[5].attributes.Kronoberg];
    const Norrbotten = [json_api_response.features[0].attributes.Norrbotten,json_api_response.features[1].attributes.Norrbotten,json_api_response.features[2].attributes.Norrbotten,json_api_response.features[3].attributes.Norrbotten,json_api_response.features[4].attributes.Norrbotten,json_api_response.features[5].attributes.Norrbotten];
    const Skåne = [json_api_response.features[0].attributes.Skåne,json_api_response.features[1].attributes.Skåne,json_api_response.features[2].attributes.Skåne,json_api_response.features[3].attributes.Skåne,json_api_response.features[4].attributes.Skåne,json_api_response.features[5].attributes.Skåne];
    const Stockholm = [json_api_response.features[0].attributes.Stockholm,json_api_response.features[1].attributes.Stockholm,json_api_response.features[2].attributes.Stockholm,json_api_response.features[3].attributes.Stockholm,json_api_response.features[4].attributes.Stockholm,json_api_response.features[5].attributes.Stockholm];
    const Södermanland = [json_api_response.features[0].attributes.Södermanland,json_api_response.features[1].attributes.Södermanland,json_api_response.features[2].attributes.Södermanland,json_api_response.features[3].attributes.Södermanland,json_api_response.features[4].attributes.Södermanland,json_api_response.features[5].attributes.Södermanland];
    const Uppsala = [json_api_response.features[0].attributes.Uppsala,json_api_response.features[1].attributes.Uppsala,json_api_response.features[2].attributes.Uppsala,json_api_response.features[3].attributes.Uppsala,json_api_response.features[4].attributes.Uppsala,json_api_response.features[5].attributes.Uppsala];
    const Värmland = [json_api_response.features[0].attributes.Värmland,json_api_response.features[1].attributes.Värmland,json_api_response.features[2].attributes.Värmland,json_api_response.features[3].attributes.Värmland,json_api_response.features[4].attributes.Värmland,json_api_response.features[5].attributes.Värmland];
    const Västerbotten = [json_api_response.features[0].attributes.Västerbotten,json_api_response.features[1].attributes.Västerbotten,json_api_response.features[2].attributes.Västerbotten,json_api_response.features[3].attributes.Västerbotten,json_api_response.features[4].attributes.Västerbotten,json_api_response.features[5].attributes.Västerbotten];
    const Västernorrland = [json_api_response.features[0].attributes.Västernorrland,json_api_response.features[1].attributes.Västernorrland,json_api_response.features[2].attributes.Västernorrland,json_api_response.features[3].attributes.Västernorrland,json_api_response.features[4].attributes.Västernorrland,json_api_response.features[5].attributes.Västernorrland];
    const Västmanland = [json_api_response.features[0].attributes.Västmanland,json_api_response.features[1].attributes.Västmanland,json_api_response.features[2].attributes.Västmanland,json_api_response.features[3].attributes.Västmanland,json_api_response.features[4].attributes.Västmanland,json_api_response.features[5].attributes.Västmanland];
    const Västra_Götaland = [json_api_response.features[0].attributes.Västra_Götaland,json_api_response.features[1].attributes.Västra_Götaland,json_api_response.features[2].attributes.Västra_Götaland,json_api_response.features[3].attributes.Västra_Götaland,json_api_response.features[4].attributes.Västra_Götaland,json_api_response.features[5].attributes.Västra_Götaland];
    const Örebro = [json_api_response.features[0].attributes.Örebro,json_api_response.features[1].attributes.Örebro,json_api_response.features[2].attributes.Örebro,json_api_response.features[3].attributes.Örebro,json_api_response.features[4].attributes.Örebro,json_api_response.features[5].attributes.Örebro];
    const Östergötland = [json_api_response.features[0].attributes.Östergötland,json_api_response.features[1].attributes.Östergötland,json_api_response.features[2].attributes.Östergötland,json_api_response.features[3].attributes.Östergötland,json_api_response.features[4].attributes.Östergötland,json_api_response.features[5].attributes.Östergötland];

    if (newRegion=='Blekinge') {
        response.json(Blekinge);
      } else if (newRegion=='Dalarna'){
        response.json(Dalarna);
      } else if (newRegion=='Gotland'){
        response.json(Gotland);
      }else if (newRegion=='Gävleborg'){
        response.json(Gävleborg);
      }else if (newRegion=='Halland'){
        response.json(Halland);
      }else if (newRegion=='Jämtland'){
        response.json(Jämtland);
      }else if (newRegion=='Jönköping'){
        response.json(Jönköping);
      }else if (newRegion=='Kalmar'){
        response.json(Kalmar);
      }else if (newRegion=='Kronoberg'){
        response.json(Kronoberg);
      }else if (newRegion=='Norrbotten'){
        response.json(Norrbotten);
      }else if (newRegion=='Skåne'){
        response.json(Skåne);
      }else if (newRegion=='Stockholm'){
        response.json(Stockholm);
      }else if (newRegion=='Södermanland'){
        response.json(Södermanland);
      }else if (newRegion=='Uppsala'){
        response.json(Uppsala);
      }else if (newRegion=='Värmland'){
        response.json(Värmland);
      }else if (newRegion=='Västerbotten'){
        response.json(Västerbotten);
      }else if (newRegion=='Västernorrland'){
        response.json(Västernorrland);
      }else if (newRegion=='Västmanland'){
        response.json(Västmanland);
      }else if (newRegion=='Västra_Götaland'){
        response.json(Västra_Götaland);
      }else if (newRegion=='Örebro'){
        response.json(Örebro);
      }else if (newRegion=='Östergötland'){
        response.json(Östergötland);
      }else {
        response.json(Stockholm);
    }
    
      
});
app.get ('/twitter/:latlon', async (request,response) => { //my server will retrieve data from the twitter api
    const apikey = '8XXJHFRURVsUHbDAlefwXRPC6'
    const apiSecretKey = '1brtOdwR4uKZ1jznvt4dSRntjUa79Iu5Y41XiFKaJq7kHE4gJm'
    const accessToken = '1092534610796441600-8pY431ZPTkPErnx22WHtElQCxnDDpu'
    const accessTokenSecret = 'DicfEUovlNVWlstuEdQ3QXEyApCvgNvMGUR7aplAe2htm'
    // bear token=AAAAAAAAAAAAAAAAAAAAAISZJwEAAAAAv65W8OFWKQXlzNwp6%2FGkkJG82%2Bk%3DDqsRWBzhYzJUt0QGdO10mR02XvjMG99I6eTVKvnq5pruXjv2b7
    var T = new Twit({
        consumer_key:         apikey,
        consumer_secret:      apiSecretKey,
        access_token:         accessToken,
        access_token_secret:  accessTokenSecret,
    });  
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    var params = {
	    q: 'Covid since:2019-11-1',
	    geocode: "37.983810,23.727539,10mi",
	    count: 5
    }
    T.get('search/tweets', params,  gotData);    
    function gotData(err, data, response){	
        var tweets = data.statuses;
        var array1 = [];
        var array2 = [];
	    for(var i=0; i<tweets.length; i++){
	        //console.log(tweets[i].created_at);
            //console.log(tweets[i].text);
            array1[i]=tweets[i].text;
            database.insert(tweets[i].text);
            //console.log(tweets[i].text);
            array2[i]=tweets[i].created_at;
	        //console.log("");
	        //console.log("");
        }
        //console.log(array1);
    }
    response.end();
     
    
});