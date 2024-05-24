// Google Ads Script for Weather-Based Bid Adjustments

// Define your API key and weather API endpoint
var apiKey = "YOUR_API_KEY";
var weatherApiEndpoint = "https://api.openweathermap.org/data/2.5/weather";

// Define campaign settings
var initialBid = 1.0";
var campaignName = "Your Campaign Name";
var locationTargets = ["London"]; // List of locations to target

var weatherConditions = {
  "clouds": {
    bidMultiplier: 1.2,	// Bid adjustment multiplier for cloudy weather
    adCopy: "It's cloudy out there! Shop now for umbrellas."
  },
  "rain": {
    bidMultiplier: 1.3, // Bid adjustment multiplier for rainy weather
    adCopy: "Don't get caught in the rain! Shop now for umbrellas."
  },
  "snow": {
    bidMultiplier: 1.5, // Bid adjustment multiplier for snowy weather
    adCopy: "Stay warm and stylish with our winter gear. Shop now!"
  },
  "clear": {
    bidMultiplier: 1.0, // Default bid adjustment multiplier for other weather conditions
    adCopy: "Enjoy the sunshine! Explore our outdoor collection."
  }
};

function main() {
  var campaign = AdsApp.campaigns().withCondition("Name = '" + campaignName + "'").get().next();
  
  for (var i = 0; i < locationTargets.length; i++) {
    var location = locationTargets[i];
    var weatherData = getWeatherData(location);
    var bidMultiplier = calculateBidMultiplier(weatherData);
    var adCopy = getAdCopy(weatherData);
    
    // Apply bid adjustments and ad customization for each location
    var adGroupIterator = campaign.adGroups().withCondition("TargetingLocation = '" + location + "'").get();
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.bidding().setBidModifier(initialBid * bidMultiplier);
      setAdCustomization(adGroup, adCopy);
    }
  }
}

function getWeatherData(location) {
  // ref: https://openweathermap.org/current#name
  var apiUrl = weatherApiEndpoint + "?q=" + location + "&appid=" + apiKey;
  var response = UrlFetchApp.fetch(apiUrl);
  var data = response.getContentText();
  return JSON.parse(data);
}

function calculateBidMultiplier(weatherData) {
  if(isEmpty(weatherData) == true)
  {
	Logger.log('calculateBidMultiplier--> Found empty weatherData!!');
	return weatherConditions["clear"].bidMultiplier;
  }
  var weatherCondition = weatherData.weather.main.toLowerCase();
  var bidMultiplier = weatherConditions[weatherCondition].bidMultiplier;
  return bidMultiplier || weatherConditions["clear"].bidMultiplier; // Default to 1.0 if condition not found
}

function getAdCopy(weatherData) {
  if(isEmpty(weatherData) == true)
  {
	Logger.log('getAdCopy--> Found empty weatherData!!');
	return weatherConditions["clear"].adCopy;
  }
  
  var weatherCondition = weatherData.weather.main.toLowerCase();
  if(isEmpty(weatherConditions[weatherCondition]) == true) {
	  Logger.log('getAdCopy--> Found no details for weather condition of ' + weatherCondition);
	  return weatherConditions["clear"].adCopy;
  }
  var adCopy = weatherConditions[weatherCondition].adCopy;
  return adCopy || weatherConditions["clear"].adCopy; // Default ad copy if condition not found
}

function setAdCustomization(adGroup, adCopy) {
  var adIterator = adGroup.ads().get();
  while (adIterator.hasNext()) {
    var ad = adIterator.next();
    ad.setAdParameters([{ key: 'weather_ad_copy', value: adCopy }]);
  }
}

function isEmpty(data) {
  if(data == null || data == "" || data==undefined) {
	return true;
  }
  return false;
}
