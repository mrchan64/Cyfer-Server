var http    = require('http'),
    express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    _       = require('underscore'),
    bodyp   = require('body-parser'),
    bs      = require('binaryjs'),
    ws      = require('ws');

/* SETUP PARAMETERS */

exports.app = express();
// exports.app.use('/js', express.static(path.join(__dirname, '../public/js')));
// exports.app.use('/images', express.static(path.join(__dirname, '../public/images')));
// exports.app.use('/css', express.static(path.join(__dirname, '../public/css')));
// exports.app.set('views', path.join(__dirname, '../public/views'));
exports.app.use(bodyp.json());
exports.app.use(bodyp.urlencoded({extended:true}));

exports.server = http.createServer(exports.app);

exports.server.listen(1500);

exports.bs = bs.BinaryServer({server: exports.server, path: '/computation'});

exports.bs.on('connection', function(client) {
  console.log('ALERT: New Binary Connection');

  client.on('stream', function(stream, meta) {
    console.log('ALERT: New Stream');
    var buf = new Buffer(0);
    stream.on('data', function(thing){
      buf = Buffer.concat([buf, thing]);
    })

    stream.on('end', function() {
      console.log('ALERT: Audio Received')
      exports.bscallback(buf);
      buf = new Buffer(0);
    });
  });
});

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
"________/\\\\\\\\\\\\\\\\\\__/\\\\\\________/\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\\\\\____/\\\\\\________/\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\____/\\\\\\\\\\\\\\\\\\_____        \n"+
" _____/\\\\\\////////__\\///\\\\\\____/\\\\\\/__\\/\\\\\\/////////\\\\\\_\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\///////////___/\\\\\\///////\\\\\\___       \n"+
"  ___/\\\\\\/_____________\\///\\\\\\/\\\\\\/____\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\_____________\\/\\\\\\_____\\/\\\\\\___      \n"+
"   __/\\\\\\_________________\\///\\\\\\/______\\/\\\\\\\\\\\\\\\\\\\\\\\\\\/__\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_\\/\\\\\\\\\\\\\\\\\\\\\\_____\\/\\\\\\\\\\\\\\\\\\\\\\/____     \n"+
"    _\\/\\\\\\___________________\\/\\\\\\_______\\/\\\\\\/////////____\\/\\\\\\/////////\\\\\\_\\/\\\\\\///////______\\/\\\\\\//////\\\\\\____    \n"+
"     _\\//\\\\\\__________________\\/\\\\\\_______\\/\\\\\\_____________\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\_____________\\/\\\\\\____\\//\\\\\\___   \n"+
"      __\\///\\\\\\________________\\/\\\\\\_______\\/\\\\\\_____________\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\_____________\\/\\\\\\_____\\//\\\\\\__  \n"+
"       ____\\////\\\\\\\\\\\\\\\\\\_______\\/\\\\\\_______\\/\\\\\\_____________\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_\\/\\\\\\______\\//\\\\\\_ \n"+
"        _______\\/////////________\\///________\\///______________\\///________\\///__\\///////////////__\\///________\\///__\n"
);



/* API ENDPOINTS */

exports.app.get('/', (req, res) => {
  res.send('Base API Endpoint');
})

exports.app.post('/data', (req, res) => {
  console.log(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    'success': true
  }));
});