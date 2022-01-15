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
const constants = require('../constants.js')
const ToString = require('./toString.js')
const Logger = require('./customLog.js')

const maxRecursions = 5;


module.exports = {
  toType: (item, type)=>{
    if(type === 'boolean'){
      if(item === "true" || item === "True" || item === true){
        return true
      }
      else {
        return false
      }
    }
    else if(type === 'string'){
      return toStringRecursive(item, 1)
    }
    else if(type === 'number'){
      let toRet = Number(item)
      if(!toRet) {
        return parseInt(item)
      }
      else {
        return toRet
      }
    }
    else { //if it's something else, just return it back
      return item
    }
  },

  toString: (input)=>{
    return toStringRecursive(input, 1)
  }, 

  toDotNotation: (input)=>{
    toDotNotation(input)
  }
}

function toDotNotation(input){
  let toRet = {};
  for(const prop in input){
    if(InputChecker.checkInputsExist([input[prop]])){
      if(typeof input[prop] === 'object' && !Array.isArray(input[prop])){
        let out = toDotNotation(input[prop])
        for(const prop2 in out){
          toRet[prop+"."+prop2] = out[prop2]
        }
      }
      else {
        toRet[prop] = input[prop]
      }
    }
  }
  return toRet
}

function toStringRecursive(input, numRecursions){
  if(numRecursions > maxRecursions){
    return "<max recurs>"
  }
  else {
    if(input === null){
      return "NULL"
    }
    else if(input === undefined){
      return "UNDEFINED"
    }
    else if(typeof input === 'number'){
      return String(input);
    }
    else if(typeof input === 'string'){
      return "'" + input + "'"
    }
    else if(typeof input === 'boolean'){
      return String(input)
    }
    else if(typeof input === 'object'){
      if(Array.isArray(input)){ //input is an array
        let out = "["
        input.forEach(element =>{
          out += toStringRecursive(element, numRecursions+1) + ", " //add each element of the array to the string, separated by a comma
        })
        if(out == '['){ //this means there were no elements (empty array)
          return '[]';
        }
        else {
          out = out.slice(0, -2) + "]" //to remove redundant ", " and append "]"
          return out;
        }
      }
      else { //input is an object
        let out = "{"
        for(const property in input) {
          if(property.includes("password")){
            out += property + ": (hidden), "
          }
          else {
            out += property + ": " + toStringRecursive(input[property], numRecursions+1) + ", "
          }
        }
        if(out == '{'){ //this means there were no properties (empty object)
          return '{}';
        }
        else {
          out = out.slice(0, -2) + "}" //to remove redundant ", " and append "}"
          return out;
        }
      }
    }
    else {
      return "<invalid type>"
    }
  }
}

