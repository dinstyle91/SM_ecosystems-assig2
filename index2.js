const express = require ('express');

const app = express(); // this is the application which can listen
const database = [];

app.listen(3000, () => console.log('listening at port 3000'));
app.use(express.static('public')); // the files in this folder will be available to be sent to the client side, these are static files
app.use(express.json({limit: '1mb'})); // our server now understands incoming data as json

app.post ('/api', (request, response) => { // retrieves data from the cleint
    const myGeoData =request.body; // the things send by the client will be stored in this variable
    const timestamp= Date.now(); // current time
    myGeoData.timestamp = timestamp; // the timestamp data will be added to the things sent by the client
    database.push(myGeoData);    
    console.log('A client has accessed the web page');
    console.log(database);

    response.json({ //this is the response we will send to the client side after we get a request
        status: 'Server hast pushed geolocation data in an array.'
    });   
});

app.get ('/myrequest', (request, response) => { // sends data to the client
    
   response.json({ //this is the response we will send to the client side after we get a request
    status: 'server is sending data',
    latitude: database[0].lat,
    longtitude: database[0].lon,
    timestamp: database[0].timestamp
    });
});