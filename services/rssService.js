var request = require('request');
var parser = require('node-feedparser');

var getRssInformation = function (rssFeedUrl, callback) {
		
		request (rssFeedUrl, function (error, resp, body){
    		
			//Need to handle this error better
    		
			//Parses body of text returned by request
    		parser (body, function (error, ret){
        	
        		callback(ret.items);

    		})
		})

};


var saveEachRssFeed = function (array){

	array.forEach

}

module.exports = {

	getRssInformation: getRssInformation
	
};