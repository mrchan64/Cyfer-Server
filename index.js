var EXA = require('./lib/expressServer')
    AUH = require('./lib/authHandler')
    DBS = require('./lib/dbService');


EXA.dbinsert = DBS.insert;
EXA.dbdrop = DBS.drop;