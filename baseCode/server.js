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

const EXPRESS_APP_PORT = 2000

const express = require('express'),
      bodyParser = require('body-parser')

let app = express();
let http = require('http').Server(app);

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));       // to support JSON-encoded bodies
app.use(express.urlencoded({ limit: '50mb',extended: true }));

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
