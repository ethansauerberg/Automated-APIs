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
  //creates a new object from input and list of required fields, or errors if fields are missing
  //returns errorDoc, object (one of these will be null)
  createNewObject: (input, fields)=>{  //This cannot handle fields that are arrays of arrays, or arrays with multiple types of objects inside
    Logger.info("At the top of objectFromTemplate with: " + ToType.toString({input: input, fields: fields}))
    let checkInputsReturn = checkInputsExist([input, fields])
    if(checkInputsReturn !== null){
      return checkInputsReturn
    }
    else {
      let typeErr = TypeChecker.checkType(input, "object")
      if(typeErr !== null){
        return typeErr, null
      }
      else {
        let newObject = {};
        fields.forEach(element=>{
          if((element.required === true) && isNullUndefinedOrEmpty(input[element.name])){ //if it's required and null, error
            Logger.error("A required field was missing")
            let thisErrorDoc = Constants.newErrorDoc();
            thisErrorDoc.errors.push(Constants.allErrors.invalidInput)
            return thisErrorDoc, null;
          }
          else if(!isNullUndefinedOrEmpty(input[element.name])){ //only continue if field exists b/c if it's not required and missing, nothing to do
            if(element.type === "array"){
              newObject[element.name] = [];
              if(element.nestedType === "object"){ //for arrays of objects, recurse on each then push
                input[element.name].forEach(element2 => {
                  let recursiveError, recursiveDoc = objectFromTemplate(element2, element.nestedFields)
                  if(recursiveError !== null){
                    return recursiveError, null;
                  }
                  else {
                    newObject[element.name].push(recursiveDoc)
                  }
                })
              }
              else if(element.nestedType === "string" || element.nestedType === "number" || element.nestedType === "boolean"){ //for arrays of basic types, type each and push
                input[element.name].forEach(item=>{
                  newObject[element.name].push(ToType.toType(item, element.nestedType))
                })
              }
              else { //element.nestedType is missing, is array, or is some other invalid type
                Logger.error("objectFromTemplate was fed a document with an array whose nestedType was not 'object', 'string', 'number', or 'boolean'")
                let thisErrorDoc = Constants.newErrorDoc();
                thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
                return thisErrorDoc, null;
              }
            }
            else if(element.type === "object"){ //for objects, just recurse
              let recursiveError2, recursiveDoc2 = objectFromTemplate(input[element.name], element.nestedFields)
              if(recursiveError2 !== null){
                return recusiveError2
              }
              else {
                newObject[element.name] = recusiveDoc2;
              }
            }
            else if(element.type === "string" || element.type === "number" || element.type === "boolean"){ //for basic types, just type them
              newObject[element.name] = ToType.toType(input[element.name], element.type)
            }
            else { //if it's not an array, object, or basic type, something is wrong
              Logger.error("objectFromTemplate was fed a document with a type that was none of 'object', 'array', 'number', 'string', and 'boolean'")
              let thisErrorDoc = Constants.newErrorDoc();
              thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
              return thisErrorDoc, null;
            }
          }
        })
        Logger.info("The required fields were all present and have now been typed")
        return null, toReturn
      }
    }
  }
} 