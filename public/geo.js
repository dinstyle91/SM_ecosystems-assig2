var geolocationCountry = document.getElementById('geolCountry')
var city = document.getElementById('geolCity')
var ip = document.getElementById('geolIp')


fetch('http://api.ipstack.com/check?access_key=2b3f8bfcb5dc658c9e39e55b1afa7988')
.then(response => response.json())
.then(data => {
  var theCountry = data['region_name'];
  var theCity = data['city'];
  var theIp = data['ip'];
  
  geolocationCountry.innerHTML = theCountry;
  city.innerHTML = theCity;
  ip.innerHTML = "My IP is: "+theIp;

})

.catch(err => alert("No access"));
