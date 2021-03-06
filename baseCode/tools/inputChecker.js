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
const Constants = require('../constants.js')
const ToType = require('./toType.js')
const Logger = require('./customLog.js')

module.exports = {
  //checks that all inputs aren't null, undefined, or the empty string
  //if any input is null, returns missingInput error document. Else, returns null
  checkInputsExist: (arrayOfInputs)=>{
    Logger.info("At top of checkInputsExist with: " + ToType.toString(arrayOfInputs));
    if(Array.isArray(arrayOfInputs)){
      return checkInputsExist(arrayOfInputs)
    }
    else {
      return isNullUndefinedOrEmpty(arrayOfInputs)
    }
  },

  isNullUndefinedOrEmpty: (input)=>{return isNullUndefinedOrEmpty(input)}
} 

// Returns an error doc if input is null, undefined, or the empty string. Returns null otherwise
function isNullUndefinedOrEmpty(input){
  if(input === null || input === undefined || input === ""){
    let thisErrorDoc = Constants.newErrorDoc();
    thisErrorDoc.errors.push(Constants.allErrors.invalidInput)
    return thisErrorDoc;
  }
  else {
    return null;
  }
}

// Calls isNullUndefinedorEmpty on each item in arrayOfInputs and returns the error document if any of them are missing
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
    Logger.warn("One or more of the required inputs was missing in checkInputs... Inputs: " + ToType.toString(arrayOfInputs))
    let thisErrorDoc = Constants.newErrorDoc();
    thisErrorDoc.errors.push(Constants.allErrors.invalidInput)
    return thisErrorDoc;
  }
}
