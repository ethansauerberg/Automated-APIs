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

const Logger = require('./winstonModule.js')
const Constants = require('../constants.js')
const ToType = require('./toType.js')

module.exports = {
  info: function info(input1, input2, input3, input4, input5, input6, input7, input8){
    try{
      Logger.info(inputsToLoggable([input1, input2, input3, input4, input5, input6, input7, input8]))
      if(Constants.devMode){
        console.log(toLog)
      }
    }
    catch (e){
      console.log("Exception occured within customLog.js:")
      console.log(e)
    }
  },
  warn: function warn(input1, input2, input3, input4, input5, input6, input7, input8){
    try{
      Logger.warn(inputsToLoggable([input1, input2, input3, input4, input5, input6, input7, input8]))
      if(Constants.devMode){
        console.log(toLog)
      }
    }
    catch (e){
      console.log("Exception occured within customLog.js:")
      console.log(e)
    }
  },
  error: function error(input1, input2, input3, input4, input5, input6, input7, input8){
    try{
      Logger.error(inputsToLoggable([input1, input2, input3, input4, input5, input6, input7, input8]))
      if(Constants.devMode){
        console.log(toLog)
      }
    }
    catch (e){
      console.log("Exception occured within customLog.js:")
      console.log(e)
    }
  },
  alert: function alert(input1, input2, input3, input4, input5, input6, input7, input8){
    try{
      Logger.info(inputsToLoggable([input1, input2, input3, input4, input5, input6, input7, input8]))
      if(Constants.devMode){
        console.log(toLog)
      }
    }
    catch (e){
      console.log("Exception occured within customLog.js:")
      console.log(e)
    }
  }
}

function inputsToLoggable(inputArray){
  var toLog = ""
  inputArray.forEach(element => {
    if(element !== null && element !== undefined && element !== ""){
      toLog += ToType.toString(element)
    }
  })
  toLog = toLog.substring(0, Constants.maxLogLength)
  return toLog
}
