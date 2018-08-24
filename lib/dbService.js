var mdb = require('mongodb');

try {
  if(process.env.dbusername == null || process.env.dbpassword == null){
    var config = require('./config.json');
    var username = config.db.username;
    var password = config.db.password;
  }else {
    var username = process.env.dbusername;
    var password = process.env.dbpassword;
  }
}catch(e){
  console.error("No config found for database password and username!");
  return;
}

exports.client = mdb.MongoClient;
// local url
exports.url = 'mongodb://'+username+':'+password+'@ds018538.mlab.com:18538/cyfer-db-v0_1';

var operation = exports.operation = (collection, opcallback) => {
  exports.client.connect(exports.url, { useNewUrlParser: true }, (err, db) => {
    if(err) {
      console.error('Connection could not be established with database. Check that database is running or URL string is correct')
      return;
    }
    console.log('Connection established with database');
    dbo = db.db('cyfer-db-v0_1')
    coll = dbo.collection(collection);
    opcallback(coll);
    db.close();
  })
}

exports.drop = () => {
  operation((db) => {
    db.drop((err, dropped) =>{
      if(err)console.error("Could not drop collection.");
      if(dropped)console.log("Collection dropped");
    })
  })
}

exports.insert = (collection, obj) => {
  operation(collection, (db) => {
    db.insertOne(obj, (err, res)=>{if(err)console.error("Could not insert")});
  })
}