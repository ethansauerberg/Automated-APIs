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
const MongoIdCreator = require('./mongoIdCreator.js')
const InputChecker = require('./inputChecker.js')
const MongoOperations = require('./mongoOperations.js')
const PasswordHash = require('password-hash'); //for hashing passwords
const Logger = require('./customLog.js')
const ToType = require('./toType.js')



module.exports = {
  //this function verifies if a user is the user whose information they requested by finding the user, then
  //checking if the passwords match. If successful, it returns the user and the user's MongoId
  //parameters:
    //email - the user's email
    //password - the user's password as plaintext
    //cb - the callback function
      //cb returns (error doc, user doc, user id), some of which will always be null
  verifyUser: function verifyUser(email, password, cb){
    Logger.info("At the top of function verifyUser")
    let inputError = InputChecker.checkInputsExist([email, password])
    if(inputError !== null){
      cb(inputError, null, null)
    }
    else {
      MongoOperations.findOne({email: email}, Constants.usersCollection, (findOneErrorDoc, findOneReturnDoc)=>{
        if(findOneErrorDoc){
          if(findOneErrorDoc.errors[0].title == "Requested Resource(s) Did Not Exist"){
            Logger.warn('No user found with the email passed.');
            let thisErrorDoc = Constants.newErrorDoc();
            thisErrorDoc.errors.push(Constants.allErrors.invalidEmailOrPassword)
            cb(thisErrorDoc, null, null)
          }
          else {
            Logger.error("Error occurred in MongoOperations.findOne within verifyUser: " + ToType.toString(findOneErrorDoc))
            cb(findOneErrorDoc, null, null);
          }
        }
        else {
          Logger.info("Found the user with email: " + email + ". Now verifiying password")
          if (!PasswordHash.verify(password, findOneReturnDoc.data.attributes.password)){
            Logger.warn('User verification failed (password mismatch)');
            let thisErrorDoc = Constants.newErrorDoc();
            thisErrorDoc.errors.push(Constants.allErrors.invalidEmailOrPassword)
            cb(thisErrorDoc, null, null)
          }
          else{
            Logger.info('User verification succeeded');
            cb(null, findOneReturnDoc, findOneReturnDoc.data.id)
          }
        }
      })
    }
  },

  //this function verifies if a user owns an object by verifying the username/password of the user matches, then by
  //calling findOne on the passed id and checking if the object's owner matches the email. If successful, it returns
  //the object's data and the object's MongoId
  //parameters:
    //email - the user's email
    //password - the user's password (plaintext)
    //id - the mongoID of the campaign
    //cb - the callback function
      //cb returns (error doc, object doc, object id), some of which will always be null
  verifyObjectOwner: function verifyObjectOwner(email, password, id, whichCollection, cb){
    Logger.info("At the top of function verifyObjectOwner")
    let inputError = InputChecker.checkInputsExist([email, password, id])
    if(inputError !== null){
      cb(inputError, null, null)
    }
    else {
      MongoIdCreator.createMongoId(id, (idErrorDoc, mongoId)=>{
        if(idErrorDoc){
          cb(idErrorDoc, null, null)
        }
        else {
          Logger.info("Converted the id to a MongoDB _id object")
          MongoOperations.findOne({email: email}, Constants.usersCollection, (findOneErrorDoc, findOneReturnDoc)=>{
            if(findOneErrorDoc){
              if(findOneErrorDoc.errors[0].title ==  "Requested Resource(s) Did Not Exist"){
                Logger.warn('No user found with the email passed.');
                let thisErrorDoc = Constants.newErrorDoc();
                thisErrorDoc.errors.push(Constants.allErrors.invalidEmailOrPassword)
                cb(thisErrorDoc, null, null)
              }
              else {
                Logger.error("Error occurred in MongoOperations.findOne on user within verifyObjectOwner" + ToType.toString(findOneErrorDoc))
                cb(findOneErrorDoc, null, null);
              }
            }
            else {
              Logger.info("Found the user with email: " + email + ". Now verifying password")
              if (!PasswordHash.verify(password, findOneReturnDoc.data.attributes.password)){
                Logger.warn('User verification failed (password mismatch)');
                let thisErrorDoc = Constants.newErrorDoc();
                thisErrorDoc.errors.push(Constants.allErrors.invalidEmailOrPassword)
                cb(thisErrorDoc, null, null)
              }
              else{
                Logger.info('User verification succeeded');
                MongoOperations.findOne({_id: mongoId}, whichCollection, (findOneErrorDoc2, findOneReturnDoc2)=>{
                  if(findOneErrorDoc2){
                    cb(findOneErrorDoc2, null, null);
                  }
                  else {
                    Logger.info("Found the object with id: " + id + ". Verifying owner matches email")
                    if(findOneReturnDoc2.data.attributes.owner !== email){
                      Logger.warn('Object owner verifitication failed (email mismatch)');
                      let thisErrorDoc2 = Constants.newErrorDoc();
                      thisErrorDoc2.errors.push(Constants.allErrors.requestedResourceAccessDenied)
                      cb(thisErrorDoc2, null, null)
                    }
                    else {
                      Logger.info('Object owner verification succeeded');
                      cb(null, findOneReturnDoc2, findOneReturnDoc2.data.id)
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  },

  //this function verifies that a user is an admin by checking if their user is both in constants.adminEmails and by
  //getting their user and confirming their password is correct. If successful, it returns the user and the user's MongoId
  //parameters:
    //email - the user's email
    //password - the user's password as plaintext
    //cb - the callback function
      //cb returns (error doc, user doc, user id), some of which will always be null
  verifyAdmin: function verifyAdmin(email, password, cb){
    Logger.info("At the top of function verifyAdmin")
    let inputError = InputChecker.checkInputsExist([email, password])
    if(inputError !== null){
      cb(inputError)
    }
    else {
      if(!Constants.adminEmails.contains(email)){
        Logger.alert('Admin verification failed (not in adminEmails array)');
        let thisErrorDoc = Constants.newErrorDoc();
        thisErrorDoc.errors.push(Constants.allErrors.requestedResourceAccessDenied)
        cb(thisErrorDoc)
      }
      MongoOperations.findOne({email: email}, Constants.usersCollection, (findOneErrorDoc, findOneReturnDoc)=>{
        if(findOneErrorDoc){
          Logger.error("Error occurred in MongoOperations.findOne within verifyAdmin" + ToType.toString(findOneErrorDoc))
          cb(findOneErrorDoc);
        }
        else {
          Logger.info("Found the user with email: " + email + ". Now verifiying password")
          if (!PasswordHash.verify(password, findOneReturnDoc.data.attributes.password)){
            Logger.alert('Admin verification failed (password mismatch)');
            let thisErrorDoc = Constants.newErrorDoc();
            thisErrorDoc.errors.push(Constants.allErrors.invalidEmailOrPassword)
            cb(thisErrorDoc)
          }
          else{
            Logger.info('Admin verification succeeded');
            cb(null)
          }
        }
      })
    }
  },

  // //this function verifies if a user is allowed to access a given feature by getting the user, and checking isGood, isBetter, and isBest
  // //parameters:
  //   //email - the user's email
  //   //level - the level (isGood/isBetter/isBest/isEnterprise/isFreeTrial) of clearance needed
  //   //cb - the callback function
  //     //cb returns (error doc, boolean of whether user is cleared or not)
  // verifyAccountLevel: function verifyAccountLevel(email, level, cb){
  //   Logger.info("At the top of verifyAccountLevel")
  //   let inputError = InputChecker.checkInputsExist([email, level])
  //   if(inputError !== null){
  //     cb(inputError, null)
  //   }
  //   else{
  //     if(level !== "isGood" && level.toLowerCase !== "isBetter" && level.toLowerCase !== "isBest" && level.toLowerCase !== "isFreeTrial" && level.toLowerCase !== "isEnterprise"){
  //       Logger.error('Bad verifyAccountType level passed');
  //       let thisErrorDoc = Constants.newErrorDoc();
  //       thisErrorDoc.errors.push(Constants.allErrors.invalidAccountLevelPassed)
  //       cb(thisErrorDoc, null)
  //     }
  //     MongoOperations.findOne({email: email}, Constants.usersCollection, (findOneErrorDoc, findOneReturnDoc)=>{
  //       if(findOneErrorDoc){
  //         Logger.error("Error occurred in MongoOperations.findOne within verifyAccountLevel" + ToType.toString(findOneErrorDoc))
  //         cb(findOneErrorDoc);
  //       }
  //       else {
  //         if(level === "isGood"){
  //           let user = findOneReturn.data.attributes
  //           if(user.isGood || user.isBetter || user.isBest || user.isEnterprise || user.isFreeTrial){
  //             Logger.info("User had isGood true")
  //             cb(null, true)
  //           }
  //           else {
  //             Logger.info("User had isGood false")
  //             cb(null, false)
  //           }
  //         }
  //         else if(level === "isBetter"){
  //           if(user.isBetter || user.isBest || user.isEnterprise || user.isFreeTrial){
  //             Logger.info("User had isBetter (or greater) true")
  //             cb(null, true)
  //           }
  //           else {
  //             Logger.info("User had isBetter (or greater) false")
  //             cb(null, false)
  //           }
  //         }
  //         else if(level === "isBest"){
  //           if(user.isBest || user.isEnterprise || user.isFreeTrial){
  //             Logger.info("User had isBetter (or greater) true")
  //             cb(null, true)
  //           }
  //           else {
  //             Logger.info("User had isBest/isEnterprise/isFreeTrial false")
  //             cb(null, false)
  //           }
  //         }
  //         else if(level === "isEnterprise"){
  //           if(user.isEnterprise){
  //             Logger.info("User had isEnterprise true")
  //             cb(null, true)
  //           }
  //           else {
  //             Logger.info("User had isEnterprise false")
  //             cb(null, false)
  //           }
  //         }
  //         else if(level === "isFreeTrial"){
  //           if(user.isFreeTrial){
  //             Logger.info("User had isFreeTrial true")
  //             cb(null, true)
  //           }
  //           else {
  //             Logger.info("User had isFreeTrial false")
  //             cb(null, false)
  //           }
  //         }
  //       }
  //     })
  //   }
  // }
}
