var mdb = require('mongodb');

try {
  var config = require('./config.json');
  var username = process.env.dbusername || config.db.username;
  var password = process.env.dbpassword || config.db.password;
}catch(e){
  console.error("No config found for database password and username!");
  return;
}

exports.client = mdb.MongoClient;
// local url
exports.url = 'mongodb://'+username+':'+password+'@ds018538.mlab.com:18538/cyfer-db-v0_1';

var operation = (opcallback) => {
  exports.client.connect(exports.url, (err, db) => {
    if(err) {
      console.log('Connection could not be established with database.\nNow running in db-less mode.')
      return;
    }
    console.log('Connection established with database');
    dbo = db.db('cyfer-db-v0_1')
    coll = dbo.collection("test"); // just records request information for now
    opcallback(coll);
    db.close();
  })
}

exports.drop = () => {
  operation((db) => {
    db.drop((err, dropped) =>{
      if(err)console.log("Could not drop collection.");
      if(dropped)console.log("Collection dropped");
    })
  })
}

exports.insert = (obj) => {
  operation((db) => {
    db.insertOne(obj, (err, res)=>{if(err)console.log("Could not insert")});
  })
}