var mdb = require('mongodb');

exports.client = mdb.MongoClient;
// local url
exports.url = 'mongodb://192.168.0.12:27017/cypher_db';

exports.client.connect(exports.url, (err, db) => {
  if(err) {
    console.log('Connection could not be established with database.\nNow running in db-less mode.')
    return;
  }
  console.log('Connection established with database');
  exports.db = db;
})