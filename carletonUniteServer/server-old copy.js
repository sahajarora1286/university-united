var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');

var allowInsecureHTTP = true;

var app1 = new ParseServer({
    databaseURI: 'mongodb://localhost:27017/carletonunite',
    appId: "carletonunite1286",
    "masterKey": "masterKey",
    serverURL: 'http://localhost:8020/carletonuniteserver'
});

var parseDashboardSettings = {
    "apps": [{
        "serverURL": "http://localhost:8020/carletonuniteserver",
        "appId": "carletonunite1286",
        "masterKey": "masterKey",
        "appName": "Carleton Unite"
    }],
    "users": [{
        "user": "sahaj",
        "pass": "root",
        "masterKey": "masterKey",
        "apps": [{
            "appId": "carletonunite1286"
        }]
    }]
}

var dashboard = new ParseDashboard(parseDashboardSettings, allowInsecureHTTP);

var app = express();

//make the Parse server available at /carletonunite
app.use('/carletonuniteserver', app1, function(req, res, next){
    return next();
});

//make the Parse dashboard available at /dashboard
app.use('/dashboard', dashboard);

var httpServer = require('http').createServer(app);
httpServer.listen(8020);