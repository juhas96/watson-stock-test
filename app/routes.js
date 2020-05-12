const stockService = require('./services/stockService');

function prepareDocForClient(doc) {
  return {
    company : doc.company,
    ticker  : doc.ticker,
    history : doc.history || [],
    categories : doc.categories || [],
    price_history : doc.price_history || {}
  };
}

module.exports = function(app, publicRoot) {

  // server routes

  /**
   * Retrieves the stock data
   */
  app.get('/api/stocks', (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    stockService.getStocks().then((stocks) => {
      var prettyStocks = stocks.map((rawStock) => {
        return prepareDocForClient(rawStock.doc);
      });
      res.send(prettyStocks);
    }).catch((error) => {
      console.log(error);
      res.send('Stocks Error: There was an error retrieving stocks');
    });
  });

  /**
   * Retrieves the list of all companies
   */
  app.get('/api/companies', (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    var companies = stockService.getAllCompanies();
    res.send(companies);
  });

  /**
   * Retrieves the list of all companies
   */
  app.post('/api/companies/add', (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    var companyName = req.body.name;
    console.log('Trying to add company "' + companyName + '"');
    stockService.addCompany(companyName).then((result) => {
      if (result) {
        res.send(prepareDocForClient(result));
      } else {
        res.send('Add Error: There was an error getting the new company data');
      }
    }).catch((error) => {
      console.log(error);
      res.send(new Error('Add Error', error));
    });
  });

  /**
   * Deletes a company by name
   */
  app.post('/api/companies/delete', (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    var companyName = req.body.name;
    console.log('Deleting company "' + companyName + '"');
    stockService.deleteCompany(companyName);
    res.send(companyName);
  });

  /**
   * Returns the homepage
   */
  app.get('*', function(req, res) {
    res.sendFile('index.html', { root: publicRoot});
  });

};
