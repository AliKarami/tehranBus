let bsCodes = require('./data/busStopCodes.json');
let bsNames = require('./data/busStopNames.json');
//send get Request to: https://application2.irantracking.com/FrontEndETA/MOBIL/api/ETA/GetETAPlusTripText2?currentStopId=4331&identifier=1&sequence=1
let _getRemainingTimesByBSCode = () => {

};

let _getRemainingTimesByBSName = () => {

};

module.exports = {
	getRemainingTimesByBSCode: _getRemainingTimesByBSCode,
	getRemainingTimesByBSName: _getRemainingTimesByBSName
};
