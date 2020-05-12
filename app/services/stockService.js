const db = require('../util/cloudantDb');
const update = require('./stockUpdate');
const stockUpdate = new update();
const utils = require('../util/utils');
const config = require('../../config');

class StockService {

  getStocks() {
    return db.search();
  }

  getStockByCompanyName(companyName) {
    return db.getByCompanyName(companyName);
  }

  addCompany(companyName) {
    return new Promise((resolve, reject) => {
      db.search().then((rows)  => {
        var docs = rows.map(function(row) {
          return row.doc;
        });

        if (docs.length >= config.MAX_COMPANIES) {
          reject('No more than ' + config.MAX_COMPANIES + ' companies may be watched.');
        } else {
          //check that the company is not already being watched
          if (utils.findStockDatum(docs, companyName)) {
            reject('This company is already being watched');
          } else {
            stockUpdate.run([companyName]).then((results) => {
              var newResult = utils.findStockDatum(results, companyName);
              resolve(newResult);
            }).catch((error) => {
              reject(error);
            });
          }
        }
      });
    });
  }

  deleteCompany(companyName) {

    return new Promise((resolve, reject) => {
      this.getStockByCompanyName(companyName).then((stocks) => {
        var companyDoc = stocks.docs[0];
        if (companyDoc) {
          db.delete(companyDoc).then(() => {
            resolve();
          }).catch((error) => {
            console.log(error);
            reject();
          });
        }
      }).catch((error) => {
        console.log(error);
        reject();
      });
    });
  }

  getAllCompanies() {
    return config.companies;
  }

}

module.exports = new StockService();