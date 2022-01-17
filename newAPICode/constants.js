/*************************************************************************
*
* CONFIDENTIAL
* __________________
*
*  Copyright (C) 2022
*  Ethan Sauerberg
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Ethan Sauerberg.  The intellectual and technical
* concepts contained herein are proprietary to Ethan Sauerberg
* and may be covered by U.S. and Foreign Patents, patents in process,
* and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Ethan Sauerberg
*
*************************************************************************/
//site url
const siteUrl = '<<siteUrl>>'
const siteDocsUrl = '<<siteDocsUrl>>'

// //the users who have access to admin routes
const adminEmails = ["<<adminEmail>>"]

//password validation schema:
//passwords must be 8-100 non-space characters and have one or more of each: uppercase letters, lowercase letters, digits, symbols
const passwordValidator = require('password-validator');
let passwordValidatorSchema = new passwordValidator()
passwordValidatorSchema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()
  .has().not().spaces()


//for database and authorization and operation
const mongoClusterName = '<<mongoClusterName>>' //your mongodb cluster name
const mongoUser = '<<mongoUser>>' //your mongodb cloud username
const mongoPass = '<<mongoPass>>' //your mongodb cloud password
const dbName = '<<mongoDbName>>' //your mongodb cloud database name
const usersCollection = 'users' //your mongodb users collection name
//<<otherCollections>> 


//for logging
const allLogFile = "serverLogs/all.log" //logs everything
const warnLogFile = "serverLogs/warnings.log" //logs warnings and up (warning = client error)
const errorLogFile = "serverLogs/errors.log" //logs errors and up (error = server error)
const alertLogFile = "serverLogs/alerts.log" //logs alerts and up (alert = security alert)
const maxLogLength = 3000;


const allErrors = { //all of the errors that we may return from our API
  //bad input, invalid username/password, item/items did not exist, ineternal server error 
  invalidInput: {
    id: 1,
    links: {
      link: "<<siteDocsUrl>>"
    },
    status: 400,
    title: "Invalid Input",
    detail: "<<invalidInputMessage>>"
  },
  invalidUsernameOrPassword: {
    id: 2,
    links: {
      link: "<<siteDocsUrl>>"
    },
    status: 400,
    title: "Invalid Username or Password",
    detail: "<<invalidUsernameOrPasswordMessage>>"
  },
  requestedResourcesDidNotExist: {
    id: 3,
    links: {
      link: "<<siteDocsUrl>>"
    },
    status: 400,
    title: "Requested Resource(s) Did Not Exist",
    detail: "<<requestedResourcesDidNotExistMessage>>"
  },
  internalServerError: {
    id: 4,
    links: {
      link: "<<siteDocsUrl>>"
    },
    status: 500,
    title: "InternalServerError",
    detail: "<<internalServerErrorMessage>>"
  }
}

//errorDoc, returnDoc, arrayReturnDoc, and resourceDoc for API returns
const errorDoc = { //empty error document for jsonapi.org compliant API returns
  errors: [],
  meta: {
    Copyright: "Copyright (C) 2022, Ethan Sauerberg, All Rights Reserved.",
    Authors: ["Ethan Sauerberg", "<<author>>"]
  }
}
const returnDoc = { //empty success document for jsonapi.org compliant API returns (single resource document)
  data: {
    type: "", //object type
    id: "", //mongoId
    attributes: { //full object document goes here
    },
  },
  meta: {
    Copyright: "Copyright (C) 2021, Ethan Sauerberg, All Rights Reserved.",
    Authors: ["Ethan Sauerberg", "<<author>>"]
  }
}
const arrayReturnDoc = { //empty success document for jsonapi.org compliant API returns (multiple resource documents)
  data: [],
  meta: {
    Copyright: "Copyright (C) 2021, Ethan Sauerberg, All Rights Reserved.",
    Authors: ["Ethan Sauerberg", "<<author>>"]
  }
}
const resourceDoc = { //empty resource document for jsonapi.org compliant API returns
  type: "", //object type
  id: "", //mongoId
  attributes: { //the full object document goes here
  }
}


//____Fields are used to ensure required fields are present and set them to the right type
//<<fields>>  
//format: 
//const objectFields = [ //the fields for a new queryEffect that is being created
//  {name: "field1", type: "string", required: true},
//  {name: "field2", type: "boolean", required: true},
//  {name: "field3", type: "number", required: false},
//]


//users JSON.parse and JSON.stringify to deep copy an object.
function deepCopy(item){
  if(typeof item === 'object' && item !== null){
    return JSON.parse(JSON.stringify(item))
  }
  else {
    return {};
  }
}

module.exports = {
  //all of our constants.....

  //for database and authorization and operation
  mongoClusterName: mongoClusterName,
  mongoUser: mongoUser,
  mongoPass: mongoPass,
  dbName: dbName,
  usersCollection: usersCollection,
  //<<otherDbCollectionExports>>

  //for logging
  allLogFile: allLogFile,
  warnLogFile: warnLogFile,
  errorLogFile: errorLogFile,
  alertLogFile: alertLogFile,
  maxLogLength: maxLogLength,

  //ensures a password meets our requirements
  validatePassword: function validatePassword(password){
    return passwordValidatorSchema.validate(password)
  },

  //all of our potential error documents
  allErrors: allErrors,

  //returns an empty error document
  newErrorDoc: function newErrorDoc(){
    return deepCopy(errorDoc)
  },

  //returns an empty return document for a single resource
  newReturnDoc: function newReturnDoc(){
    return deepCopy(returnDoc)
  },

  //returns an empty return document for multiple resources
  newArrayReturnDoc: function newArrayReturnDoc(){
    return deepCopy(arrayReturnDoc)
  },

  //returns an empty return document for multiple resources
  newResourceDoc: function newResourceDoc(){
    return deepCopy(resourceDoc)
  },
}
