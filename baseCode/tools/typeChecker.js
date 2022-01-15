/*************************************************************************
*
* CONFIDENTIAL
* __________________
*
*  Copyright (C) 2021
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
let types = ["string", "number", "boolean", "array", "object"]
const Logger = require('../tools/customLog.js')

module.exports = {
  checkType: function checkType(input, type){
    if(input === null || input === undefined){
      Logger.error('Missing input typeChecker.checkType');
      let thisErrorDoc = constants.newErrorDoc();
      thisErrorDoc.errors.push(constants.allErrors.missingInput)
      return thisErrorDoc;
    }
    if(!types.contains(type)){
      Logger.error('Bad type input in typeChecker.checkType');
      let thisErrorDoc = constants.newErrorDoc();
      thisErrorDoc.errors.push(constants.allErrors.invalidTypeCheckerType)
      return thisErrorDoc;
    }
    else {
      if(type === "string" || type === "boolean" || type === "number"){
        if(type !== typeof input){
          Logger.warn('Data was wrong type in typeChecker');
          let thisErrorDoc = constants.newErrorDoc();
          thisErrorDoc.errors.push(constants.allErrors.inputOfWrongType)
          return thisErrorDoc;
        }
        else {
          return null;
        }
      }
      else if(type === "array"){
        if(!Array.isArray(input)){
          Logger.warn('Data was wrong type in typeChecker');
          let thisErrorDoc = constants.newErrorDoc();
          thisErrorDoc.errors.push(constants.allErrors.inputOfWrongType)
          return thisErrorDoc;
        }
        else {
          return null;
        }
      }
      else { //type is "object"
        if(Array.isArray(input) || typeof input !== "object"){
          Logger.warn('Data was wrong type in typeChecker');
          let thisErrorDoc = constants.newErrorDoc();
          thisErrorDoc.errors.push(constants.allErrors.inputOfWrongType)
          return thisErrorDoc;
        }
        else {
          return null;
        }
      }
    }
  }
}
