angular.module('MainModule').factory('StockService', ['$http', function($http) {

  var service = {};

  function handlePromise(promise) {
    return new Promise((resolve, reject) => {
      promise.then((result) => {
        resolve(result.data);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  function get(path) {
    var promise = $http.get(path);
    return handlePromise(promise);
  }

  function post(path, params) {
    var promise = $http.post(path, params);
    return handlePromise(promise);
  }

  service.getStocks = function() {
    return get('/api/stocks');
  };

  service.getAllCompanies = function() {
    return get('/api/companies');
  };

  service.add = function(company) {
    return post('/api/companies/add', {
      name : company
    });
  };

  service.delete = function(company) {
    return post('/api/companies/delete', {
      name : company
    });
  };

  return service;
}]);
