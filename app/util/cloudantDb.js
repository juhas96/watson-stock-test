const Cloudant = require('cloudant');
const config = require('../../config.js');

var cloudant;

if (config.usingEnv) {  
  cloudant = Cloudant({
    account  : config.CLOUDANT.key,    
    password : config.CLOUDANT.password
  });
  console.log('Successfully initialized cloudant');
} else if (config.usingVCAP) {
  console.log('Initializing cloudant from VCAP');
  console.log('credentials url: ' + config.CLOUDANT.credentialsURL);
  cloudant = Cloudant(config.CLOUDANT.credentialsURL);
} else {
  console.log('Not initializing cloudant from env or VCAP...');
}

if (cloudant) {
  console.log('trying to create DB with name: ' + config.CLOUDANT.db_name);
  cloudant.db.create(config.CLOUDANT.db_name, function(err, res) {
    if (err) {
      console.log('Could not create new db: ' + config.CLOUDANT.db_name + ', it might already exist.');
    } else {
      console.log('DB created:');
      console.log(res);
    }
  });
}

const db = cloudant.db.use(config.CLOUDANT.db_name);

function getBy(key, value) {
  return new Promise((resolve, reject) => {
    var selector = {};
    selector[key] = value;
    db.find({selector: selector}, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

class DB {
  search() {
    return new Promise((resolve, reject) => {
      db.list({ include_docs: true }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  insertOrUpdate(doc) {
    return new Promise((resolve, reject) => {
      db.insert(doc, function(err, body, header) {
        if (err) {
          console.log('insertion failed: ' + err.message);
          reject(err);
        } else {
          resolve(body, header);
        }
      });
    });
  }

  delete(doc) {
    console.log('deleting: ', doc);
    return new Promise((resolve, reject) => {
      db.destroy(doc._id, doc._rev, function(err, data) {
        if (err) {
          console.log('deletion failed: ' + err.message);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  getByCompanyName(name) {
    return getBy('company', name);
  }
}

module.exports = new DB();
