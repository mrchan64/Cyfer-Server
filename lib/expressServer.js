var http    = require('http'),
    express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    _       = require('underscore'),
    bodyp   = require('body-parser'),
    bs      = require('binaryjs'),
    ws      = require('ws');

var DTS     = require('./dataStruct'),
    DBS     = require('./dbService');

/* SETUP PARAMETERS */
exports.port = (process.env.PORT || 1500); // for Heroku operation

exports.app = express();
// exports.app.use('/js', express.static(path.join(__dirname, '../public/js')));
// exports.app.use('/images', express.static(path.join(__dirname, '../public/images')));
// exports.app.use('/css', express.static(path.join(__dirname, '../public/css')));
// exports.app.set('views', path.join(__dirname, '../public/views'));
exports.app.use(bodyp.json());
exports.app.use(bodyp.urlencoded({extended:true}));
exports.app.disable('x-powered-by');

exports.server = http.createServer(exports.app);

exports.server.listen(exports.port);

// exports.bs = bs.BinaryServer({server: exports.server, path: '/computation'});

// exports.bs.on('connection', function(client) {
//   console.log('ALERT: New Binary Connection');

//   client.on('stream', function(stream, meta) {
//     console.log('ALERT: New Stream');
//     var buf = new Buffer(0);
//     stream.on('data', function(thing){
//       buf = Buffer.concat([buf, thing]);
//     })

//     stream.on('end', function() {
//       console.log('ALERT: Audio Received')
//       exports.bscallback(buf);
//       buf = new Buffer(0);
//     });
//   });
// });

exports.wss = new ws.Server({port: 3000});

exports.wssconns = [];
exports.wss.on('connection', function(client) {
  console.log('ALERT: New Websocket Connection');
  exports.wssconns.push(client);
  client.on('close', function(){
    exports.wssconns.splice(exports.wssconns.indexOf(client), 1);
    console.log("ALERT: Websocket Disconnected");
  })
});

console.log("\n"+
"________/\\\\\\\\\\\\\\\\\\__/\\\\\\________/\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\____/\\\\\\\\\\\\\\\\\\_____        \n" + 
" _____/\\\\\\////////__\\///\\\\\\____/\\\\\\/__\\/\\\\\\///////////__\\/\\\\\\///////////___/\\\\\\///////\\\\\\___       \n" + 
"  ___/\\\\\\/_____________\\///\\\\\\/\\\\\\/____\\/\\\\\\_____________\\/\\\\\\_____________\\/\\\\\\_____\\/\\\\\\___      \n" + 
"   __/\\\\\\_________________\\///\\\\\\/______\\/\\\\\\\\\\\\\\\\\\\\\\_____\\/\\\\\\\\\\\\\\\\\\\\\\_____\\/\\\\\\\\\\\\\\\\\\\\\\/____     \n" + 
"    _\\/\\\\\\___________________\\/\\\\\\_______\\/\\\\\\///////______\\/\\\\\\///////______\\/\\\\\\//////\\\\\\____    \n" + 
"     _\\//\\\\\\__________________\\/\\\\\\_______\\/\\\\\\_____________\\/\\\\\\_____________\\/\\\\\\____\\//\\\\\\___   \n" + 
"      __\\///\\\\\\________________\\/\\\\\\_______\\/\\\\\\_____________\\/\\\\\\_____________\\/\\\\\\_____\\//\\\\\\__  \n" + 
"       ____\\////\\\\\\\\\\\\\\\\\\_______\\/\\\\\\_______\\/\\\\\\_____________\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_\\/\\\\\\______\\//\\\\\\_ \n" + 
"        _______\\/////////________\\///________\\///______________\\///////////////__\\///________\\///__\n" + "\n"
);


function usageVerification(delta) {
  if(delta.keys == undefined || delta.value == undefined || delta.submissiontime == undefined) return false;
  if(typeof(delta.keys) != "string") return false;
  delta.keys = delta.keys.split(',');
  if(DTS.findUser(delta.keys[0])==undefined) return false;
  return true;
}

function parseCookies(req) {
  cookies = req.headers.cookie;
  console.log(cookies);
}

function send400(res) {
  res.status(400);
  res.send('Bad Request');
}

function send401(res) {
  res.status(401);
  res.send('Unauthorized');
}



/* API ENDPOINTS */

exports.app.get('/', (req, res) => {
  res.send('Base API Endpoint. Make sure to use /data');
});

exports.app.use('/data*', (req, res, next) => {
  // if(req.headers.cookie, contains(''))
  //find authtoken
  next();
})

exports.app.post('/data/usage', (req, res) => {
  var delta = req.body;
  console.log(req.headers)
  console.log(delta);
  if(!usageVerification(delta)){
    send400(res);
    return;
  }
  delta.order = DTS.dbNum++;
  DTS.setUsage(delta.keys, delta.value);
  DBS.insert('usage', delta);

  // SUCCESS 
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    'success': true
  }));
});

exports.app.get('/data/usage', (req, res) => {
  username = req.query.user;
  if(DTS.findUser(username) == undefined){
    send400(res);
    return;
  }
  data = DTS.getUsage(username);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    'success': true,
    'username': username,
    'data': data
  }));
})



/* PRELIMINARY TESTING */

// exports.app.get('/data', (req, res) => {
//   var testo = {
//     headers: req.headers,
//     type: 'GET'
//   }
//   exports.dbinsert(testo);
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({
//     'success': true
//   }));
// });

// exports.app.post('/data', (req, res) => {
//   var testo = {
//     headers: req.headers,
//     type: 'POST',
//     body: req.body
//   }
//   exports.dbinsert(testo);
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({
//     'success': true
//   }));
// });

// exports.app.get('/drop', (req, res) => {
//   exports.dbdrop();
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({
//     'success': true
//   }));
// });