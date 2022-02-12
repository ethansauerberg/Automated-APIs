/*************************************************************************
 *
 * CONFIDENTIAL
 * __________________
 *
 *  Copyright (C) 2022
 *  Ethan Sauerberg
 *  All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Ethan Sauerberg. The intellectual and technical
 * concepts contained herein are proprietary to Ethan Sauerberg
 * and may be covered by U.S. and Foreign Patents, patents in process,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Ethan Sauerberg
 *
*************************************************************************/

// AutoAPI Server v.1.0.0!

const EXPRESS_APP_PORT = 2000, //2001,
      PUBLIC_DIR = 'public',
      STATIC_DIR = 'static',
      REDIS_HOST = 'localhost',//'127.0.0.1'
      REDIS_PORT = 6379;
      // refererSecret = "dkmn343vksjkvjrkj75nf48@!lkcjdlkjedklj!w@ZXZXwkdjk@";

const express = require('express'),
      redis = require("redis"), //TODO should be able to get rid of all the sessions / redis stuff?
      session = require('express-session'),
      redisStore = require('connect-redis')(session),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      Logger = require('./tools/customLog.js');

// for auth
let passwordHash = require('password-hash');
let passwordValidator = require('password-validator');
let validator = require("email-validator");

// let request = require('request')


//express plugins
let client = redis.createClient();
let app = express();



//for real time capabilities:
let http = require('http').Server(app);


// let path = require('path'),
// nodeMailer = require('nodemailer');

app.set('views', PUBLIC_DIR);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);


//add dependencies to express app
// app.use(cookieParser("asdfasdfasdfqwerqwerqwer"));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));       // to support JSON-encoded bodies
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use(require('morgan')('combined'));


// Make statics readable
// app.use(express.static(STATIC_DIR));

// create the router
let router = express.Router();

//import routes from routes folder
require('./routes/users.js')(router, app) //CRUD routes for users
//<<routesImportLines>>

//uses our router:
app.use('/', router);

// startup the server
let server = http.listen(EXPRESS_APP_PORT, ()=>{
  console.log('Server now running on port: ' + server.address().port);
});
