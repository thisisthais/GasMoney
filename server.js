var express = require('express');
var app = express();
var sys = require('sys');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var parseString = require('xml2js').parseString;
app.use(express.bodyParser());

var engines = require('consolidate');
app.engine('html', engines.hogan);
app.set('views', __dirname+'/templates');

app.use(express.static(__dirname + '/public'));

app.post('/result', function(req,res) {
	/*console.log(req.body.start);
	console.log(req.body.end);
	console.log(req.body.year);
	console.log(req.body.make);
	console.log(req.body.model);*/

	var url = "http://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year="+req.body.year+"&make="+req.body.make+"&model="+req.body.model;
	//console.log(url);

	var xml = httpGet(url);
	//console.log(xml);

    var carID;
	parseString(xml, function (err, result) {
    //console.dir(result);
    console.log(result.menuItems.menuItem[0].value);//Just automatically  using the first car, yuck
    carID = result.menuItems.menuItem[0].value;
    //console.log(Object.prototype.toString(carID));
	});
    console.log("carID: " + carID);

    url = "http://www.fueleconomy.gov/ws/rest/vehicle/" + carID[0];
    console.log(url);

    xml = httpGet(url);

    var carMPG;
    parseString(xml, function (err, result) {
        //console.dir("Ucity: " + result.vehicle.UCity);
        carMPG = result.vehicle.UCity;
    });
    console.log("carMPG: " + carMPG[0]);

    url = "http://www.fueleconomy.gov/ws/rest/fuelprices";
    xml = httpGet(url);

    var gasPrice;
    parseString(xml, function(err, result) {
        //console.dir(result);
        gasPrice = result.fuelPrices.regular;
    });
    console.log("gasPrice: " + gasPrice);

});


function httpGet(theUrl) {
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function GetObjectKeyIndex(obj, keyToFind) {
    var i = 0, key;
    for (key in obj) {
        if (key == keyToFind) {
            return i;
        }
        i++;
    }
    return null;
}


app.listen(8080);
console.log("Listening on app 8080");