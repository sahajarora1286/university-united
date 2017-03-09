const resolve = require('path').resolve;


var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');

var allowInsecureHTTP = true;

var app1 = new ParseServer({
    databaseURI: 'mongodb://192.168.0.15:27017/carletonunite',
    appId: "carletonunite1286",
    "masterKey": "masterKey",
    serverURL: 'http://192.168.0.15:8020/carletonuniteserver',
    liveQuery: {
        classNames: ['Message']
    },
    "push": {
      "android":{
         "senderId": "294166891765",
         "apiKey": "AIzaSyAMo2AhkeNNuCs7DDPw9puzhuIRRD_E0yA"
      }
      },
    emailAdapter: {
    module: 'parse-server-mailgun',
    options: {
      // The address that your emails come from 
      fromAddress: 'Team <postmaster@sandbox06511f1efd644835b6bea3453303b826.mailgun.org>',
      // Your domain from mailgun.com 
      domain: 'sandbox06511f1efd644835b6bea3453303b826.mailgun.org',
      // Your API key from mailgun.com 
      apiKey: 'key-36e842a3801f6285e3316093e6ef5acb',
      // The template section 
      templates: {
        passwordResetEmail: {
          subject: 'Reset your password',
          pathPlainText: resolve(__dirname, 'password_reset_email.txt'),
          pathHtml: resolve(__dirname, 'password_reset_email.html'),
          callback: (user) => { return { firstName: user.get('firstName') }}
          // Now you can use {{firstName}} in your templates 
        },
        verificationEmail: {
          subject: 'Confirm your account',
          pathPlainText: resolve(__dirname, 'verification_email.txt'),
          pathHtml: resolve(__dirname, 'verification_email.html'),
          callback: (user) => { return { firstName: user.get('firstName') }}
          // Now you can use {{firstName}} in your templates 
        },
        customEmailAlert: {
          subject: 'Urgent notification!',
          pathPlainText: resolve(__dirname, 'custom_email.txt'),
          pathHtml: resolve(__dirname, 'custom_email.html'),
        }
      }
    }
    }
});

var parseDashboardSettings = {
    "apps": [{
        "serverURL": "http://192.168.0.15:8020/carletonuniteserver",
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
ParseServer.createLiveQueryServer(httpServer);