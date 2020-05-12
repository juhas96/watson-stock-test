const AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;
const PLACEHOLDER = 'placeholder';
var alphaVantageAPI;

// INICIALIZACIA ALPHAVANTAGE

function initializeAPI() {

  var API_KEY = process.env.ALPHAVANTAGE_API_KEY;
  if (API_KEY) {
    if (API_KEY == PLACEHOLDER) {
      console.log('ALPHAVANTAGE_API_KEY needs to be set correctly. It is currently set to ' + PLACEHOLDER);
    } else {
      console.log('initializing AlphaVantage with API key: ' + API_KEY);
      alphaVantageAPI = new AlphaVantageAPI(API_KEY, 'compact', true);
    }
  } else {
    console.log('ALPHAVANTAGE_API_KEY needs to be set correctly. It is currently not defined.');
  }
}

function parseDailyData(dailyData) {
  var stockDataMap = {};
  for (var id in dailyData) {
    var dayData = dailyData[id];
    var date = dayData['Timestamp'];
    var dateString = JSON.stringify(date);
    dateString = dateString.slice(1,11);
    delete dayData['Timestamp'];
    stockDataMap[dateString] = dayData;
  }
  return stockDataMap;
}

class AlphaVantage {
  getDataHistoryForTicker(companyTicker) {
     
    return new Promise((resolve, reject) => {

      if (!alphaVantageAPI) {
        initializeAPI();
        
        if (!alphaVantageAPI) {
          reject('AlphaVantage API Not initialized');
          return;
        }
      }

      alphaVantageAPI.getDailyData(companyTicker)
        .then((dailyData) => {
          var stockDataMap = parseDailyData(dailyData);
          resolve(stockDataMap);
        }).catch((err) => {
          reject(err);
        });
    });
  }
}

initializeAPI();
module.exports = new AlphaVantage();
