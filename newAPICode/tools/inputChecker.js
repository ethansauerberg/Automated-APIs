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
const Constants = require('../constants.js')
const TypeParser = require('./typeParser.js')
const ToString = require('./toString.js')
const LynxOptionsResultsGetter = require('./LynxOptionsResultsGetter.js')
const Logger = require('./customLog.js')

module.exports = {
  //checks that all inputs aren't null, undefined, or the empty string
  //if any input is null, returns missingInput error document. Else, returns null
  checkInputsExist: (arrayOfInputs)=>{
    if(Array.isArray(arrayOfInputs)){
      return checkInputsExist(arrayOfInputs)
    }
    else {
      return isNullUndefinedOrEmpty(arrayOfInputs)
    }
  }
} 


function isNullUndefinedOrEmpty(input){
  if(input === null || input === undefined || input === ""){
    Logger.warn("One or more of the required inputs was missing. Inputs: " + ToString.toString(input))
    let thisErrorDoc = Constants.newErrorDoc();
    thisErrorDoc.errors.push(Constants.allErrors.missingInput)
    return thisErrorDoc;
  }
  else {
    return null;
  }
}

function checkInputsExist(arrayOfInputs){
  let success = true;
  arrayOfInputs.forEach(element =>{
    if(isNullUndefinedOrEmpty(element)){
      success = false;
    }
  })
  if(success){
    Logger.info("All of the required inputs were present")
    return null;
  }
  else {
    Logger.warn("One or more of the required inputs was missing. Inputs: " + ToString.toString(arrayOfInputs))
    let thisErrorDoc = Constants.newErrorDoc();
    thisErrorDoc.errors.push(Constants.allErrors.missingInput)
    return thisErrorDoc;
  }
}
