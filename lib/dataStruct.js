// DICTIONARY STORAGE FOR CYFER

var DBS = require('./dbService');

var usage = {};
var account = {};
var settings = {};

var authentication = {};

exports.setUsage = (keys, value) => {
  if (account[keys[0]] == undefined) {
    console.error('In setting usage data: User ['+keys[0]+'] does not exists in the database!');
    return;
  }

  var curr_obj = usage;
  var last_key = keys[keys.length-1];
  keys.forEach((key) => {
    if (curr_obj[key] == undefined) curr_obj[key] = {};
    if (key == last_key) curr_obj[key] = value;
    else curr_obj = curr_obj[key];
  })
}

exports.getUsage = (username) => {
  if (account[username] == undefined) {
    console.error('In getting usage data: User ['+username+'] does not exists in the database!');
    return;
  }

  return usage[username] || {};
}

exports.newUser = (username, new_settings) => {
	if (account[username] != undefined) {
		console.error('User ['+username+'] already exists in the database!');
    return;
	}
  account[username] = {
    'created': new Date().getTime(),
    'logins': [],
    'activeTokens': []
  };
  settings[username] = new_settings || {'defaultSettings': true};
}

exports.findUser = (username) => {
  return account[username];
}

/** Run Through Database **/
exports.newUser('tester1');

var dbNum = exports.dbNum = 0;

DBS.operation('usage', (db) => {
  console.log('Successful connection to database server!');
  db.find({}, {sort: {order: 1}}).toArray((err, updates)=>{
    if(err)console.error('Mongo Error!\n'+err);
    if(updates && updates.length>0){
      updates.forEach((el)=>{
        if(dbNum != 0 && dbNum != el.order) console.warn('Database out of order! Skipping from '+dbNum+' to '+el.order+'...');
        dbNum = el.order+1;
        exports.setUsage(el.keys, el.value);
      })
      console.log('Loaded '+updates.length+' updates from the database.');
      console.log('Currently '+Object.keys(usage).length+' unique users.');
    }
  })
});