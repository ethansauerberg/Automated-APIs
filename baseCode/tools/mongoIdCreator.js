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

const Constants = require('../constants.js')
const ObjectId = require("mongodb").ObjectId;
const Logger = require('./customLog.js')

module.exports = {
  //takes a mongo id string and turns it into an id object
  //returns an error doc and an idObject, one of which will be null
  createMongoId: function createMongoId(id, cb){
    let idObject = ObjectId(id)
    if(idObject){
      Logger.info("Converted the id to a MongoDB _id object")
      cb(null, idObject);
    }
    else{
      Logger.error("An unknown error occurred with Mongo's ObjectId's ObjectId(filter) function")
      let thisErrorDoc = Constants.newErrorDoc();
      thisErrorDoc.errors.push(Constants.allErrors.invalidIdFilter)
      cb(thisErrorDoc, null);
    }
  }
}
