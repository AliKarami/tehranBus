let bsCodes = require('./data/busStopCodes.json');
let bsNames = require('./data/busStopNames.json');
let request = require('request');
let xmlReader = require('xmlreader');
let _ = require('underscore');
let jsdom = require('jsdom');

let correctXML = (xmlString) => {
	return xmlString.split('\\\"').join('\"').split('\\r').join('').split('\\n').join('').split('\\t').join('').slice(1,-1);
};

let _getStopInfoByCode = (code) => {
	return new Promise((resolve, reject)=>{
		request({
			method: 'GET',
			uri: 'https://application2.irantracking.com/FrontEndETA/MOBIL/api/ETA/GetETAPlusTripText2?currentStopId='+code+'&identifier=1&sequence=1'
		},(err,response,body)=>{
			if (err) reject(err);
			else {
				xmlReader.read(correctXML(body),(xmlError,xmlResponse)=>{
					if (xmlError) reject(xmlError);
					let result = xmlResponse.ETARoot.attributes().Result;
					let requestDate = xmlResponse.ETARoot.attributes().RequestDate;
					let currentStopName = xmlResponse.ETARoot.CurrentStop.attributes().Name;
					let currentStopCode = xmlResponse.ETARoot.CurrentStop.attributes().Code;
					let currentStopLng = xmlResponse.ETARoot.CurrentStop.attributes().Lng;
					let currentStopLat = xmlResponse.ETARoot.CurrentStop.attributes().Lat;
					let numberOfStops = xmlResponse.ETARoot.Stops.Stop.count();
					let stops = [];
					for (let i=0;i<numberOfStops;i++) {
						stops.push({
							routeCode: xmlResponse.ETARoot.Stops.Stop.at(i).attributes().RouteCode,
							originationName: xmlResponse.ETARoot.Stops.Stop.at(i).attributes().OriginationName,
							destinationName: xmlResponse.ETARoot.Stops.Stop.at(i).attributes().DestinationName,
							order: xmlResponse.ETARoot.Stops.Stop.at(i).attributes().Order,
							routeType: xmlResponse.ETARoot.Stops.Stop.at(i).attributes().RouteType,
							text: xmlResponse.ETARoot.Stops.Stop.at(i).ETA.attributes().Text,
							value: xmlResponse.ETARoot.Stops.Stop.at(i).ETA.attributes().Value,
							bus: xmlResponse.ETARoot.Stops.Stop.at(i).ETA.attributes().Bus
						});
					}
					resolve({
						result: result,
						requestDate: requestDate,
						currentStopName: currentStopName,
						currentStopCode: currentStopCode,
						currentStopLng: currentStopLng,
						currentStopLat: currentStopLat,
						numberOfStops: numberOfStops,
						stops: stops
					});
				})
			}
		})
	});
};

let _getStopRemainingTimesByCode = (code) => {
	return _getStopInfoByCode(code).then((stopInfo)=>{
		return stopInfo.stops;
	})
};

let _getStopRemainingTimesByName = (name) => {
	return _getStopRemainingTimesByCode(bsCodes[name]);
};

let _getRemainingTimes = (codeOrName) => {
	return !!Number(codeOrName)?_getStopRemainingTimesByCode(Number(codeOrName)):_getStopRemainingTimesByName(codeOrName);
};

let _updateStops = () => {
	return new Promise((resolve,reject)=>{
		jsdom.env('http://services20.tehran.ir/زمانبندی-حرکت-اتوبوس-ها/جدول-زمان-بندی-حرکت-اتوبوس-زنده',
			['http://code.jquery.com/jquery.js'],
			(err,window)=>{
				if (err) reject(err);
				else {
					// let $ = window.$;
					// Where are you fucking last script text?!
				}
			});
	});
};

let _getStopNames = () => {
	return _.keys(bsCodes);
};

let _getStops = () => {
	return bsNames;
};
//send get Request to: https://application2.irantracking.com/FrontEndETA/MOBIL/api/ETA/GetBusStopStaticTimeTable?currentStopId=1662&routeId=273&direction=82
let _getStopTimeTable = (stopCode,route,direction) => {

};

let _getStopLocationByName = (name) => {

};

let _getStopLocationByCode = (code) => {

};

let _getStopLocation = (codeOrName) => {
	return !!Number(codeOrName)?_getStopLocationByCode(Number(codeOrName)):_getStopLocationByName(codeOrName);
};

module.exports = {
	getRemainingTimes: _getRemainingTimes,
	updateStops: _updateStops,
	stopNames: _getStopNames(),
	stops: _getStops(),
	getStopTimeTable: _getStopTimeTable,
	getStopLocation: _getStopLocation
};

_updateStops();