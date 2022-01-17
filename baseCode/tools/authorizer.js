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
const MongoIdCreator = require('./mongoIdCreator.js')
const InputChecker = require('./objectCreator.js')
const MongoOperations = require('./mongoOperations.js')
const PasswordHash = require('password-hash'); //for hasing passwords
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
      MongoOperations.findOne({email: email}, Constants.usersDb, (findOneErrorDoc, findOneReturnDoc)=>{
        Logger.error('2');

        if(findOneErrorDoc){
          Logger.error("Error occurred in MongoOperations.findOne within verifyUser: " + ToType.toString(findOneErrorDoc))
          cb(findOneErrorDoc, null, null);
        }
        else {
          Logger.info("Found the user with email: " + email + ". Now verifiying password")
          if (!PasswordHash.verify(password, findOneReturnDoc.data.attributes.password)){
            Logger.warn('User verification failed (password mismatch)');
            let thisErrorDoc = Constants.newErrorDoc();
            thisErrorDoc.errors.push(Constants.allErrors.incorrectPassword)
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

  //this function verifies if a user owns a campaign by verifying the username/password of the user matches, then by
  //calling findOne on the passed id and checking if the email matches the campaign's creator. If successful, it returns
  //the campaign's data and the campaign's MongoId
  //parameters:
    //email - the user's email
    //password - the user's password (plaintext)
    //id - the mongoID of the campaign
    //cb - the callback function
      //cb returns (error doc, campaign doc, campaign id), some of which will always be null
  verifyCampaignCreator: function verifyCampaignCreator(email, password, id, cb){
    Logger.info("At the top of function verifyCampaignCreator")
    let inputError = InputChecker.checkInputsExist([email, password, id])
    if(inputError !== null){
      cb(inputError, null, null)
    }
    else {
      let idErrorDoc, mongoId = MongoIdCreator.createMongoId(id)
      if(idErrorDoc){
        cb(idErrorDoc, null, null)
      }
      else {
        Logger.info("Converted the id to a MongoDB _id object")
        MongoOperations.findOne({email: email}, Constants.usersDb, (findOneErrorDoc, findOneReturnDoc)=>{
          if(findOneErrorDoc){
            Logger.error("Error occurred in MongoOperations.findOne on user within verifyCampaignCreator" + ToType.toString(findOneErrorDoc))
            cb(findOneErrorDoc, null, null);
          }
          else {
            Logger.info("Found the user with email: " + email + ". Now verifiying password")
            if (!PasswordHash.verify(password, findOneReturnDoc.data.attributes.password)){
              Logger.warn('User verification failed (password mismatch)');
              let thisErrorDoc = Constants.newErrorDoc();
              thisErrorDoc.errors.push(Constants.allErrors.incorrectPassword)
              cb(thisErrorDoc, null, null)
            }
            else{
              Logger.info('User verification succeeded');
              MongoOperations.findOne({_id: mongoId}, Constants.campaignsDb, (findOneErrorDoc2, findOneReturnDoc2)=>{
                if(findOneErrorDoc2){
                  cb(findOneErrorDoc2, null, null);
                }
                else {
                  Logger.info("Found the campaign with id: " + id + ". Verifying creator matches email")
                  if(findOneReturnDoc2.data.attributes.creator !== email){
                    Logger.warn('Campaign creator verifitication failed (email mismatch)');
                    let thisErrorDoc2 = Constants.newErrorDoc();
                    thisErrorDoc2.errors.push(Constants.allErrors.campaignAuthorizationFailed)
                    cb(thisErrorDoc2, null, null)
                  }
                  else {
                    Logger.info('Campaign creator verification succeeded');
                    cb(null, findOneReturnDoc2, findOneReturnDoc2.data.id)
                  }
                }
              })
            }
          }
        })
      }
    }
  },

  //this function verifies that a user is an LL admin by checking if their user is both in constants.leadlynxAdmins and by
  //getting their user and confirming their password is correct. If successful, it returns the user and the user's MongoId
  //parameters:
    //email - the user's email
    //password - the user's password as plaintext
    //cb - the callback function
      //cb returns (error doc, user doc, user id), some of which will always be null
  verifyAdmin: function verifyUser(email, password, cb){
    Logger.info("At the top of function verifyAdmin")
    let inputError = InputChecker.checkInputsExist([email, password])
    if(inputError !== null){
      cb(inputError)
    }
    else {
      if(!Constants.adminEmails.contains(email)){
        Logger.alert('LeadLynx admin verification failed (not in leadLynxAdmins)');
        let thisErrorDoc = Constants.newErrorDoc();
        thisErrorDoc.errors.push(Constants.allErrors.invalidLeadLynxAdministratorCredentials)
        cb(thisErrorDoc)
      }
      MongoOperations.findOne({email: email}, Constants.usersDb, (findOneErrorDoc, findOneReturnDoc)=>{
        if(findOneErrorDoc){
          Logger.error("Error occurred in MongoOperations.findOne within verifyLeadLynxAdmin" + ToType.toString(findOneErrorDoc))
          cb(findOneErrorDoc);
        }
        else {
          Logger.info("Found the user with email: " + email + ". Now verifiying password")
          if (!PasswordHash.verify(password, findOneReturnDoc.data.attributes.password)){
            Logger.alert('LeadLynx admin verification failed (password mismatch)');
            let thisErrorDoc = Constants.newErrorDoc();
            thisErrorDoc.errors.push(Constants.allErrors.incorrectPassword)
            cb(thisErrorDoc)
          }
          else{
            Logger.info('LeadLynx admin verification succeeded');
            cb(null)
          }
        }
      })
    }
  },

  //this function verifies if a user is allowed to access a given feature by getting the user, and checking isGood, isBetter, and isBest
  //parameters:
    //email - the user's email
    //level - the level (isGood/isBetter/isBest/isEnterprise/isFreeTrial) of clearance needed
    //cb - the callback function
      //cb returns (error doc, boolean of whether user is cleared or not)
  verifyAccountLevel: function verifyAccountLevel(email, level, cb){
    Logger.info("At the top of verifyAccountLevel")
    let inputError = InputChecker.checkInputsExist([email, level])
    if(inputError !== null){
      cb(inputError, null)
    }
    else{
      if(level !== "isGood" && level.toLowerCase !== "isBetter" && level.toLowerCase !== "isBest" && level.toLowerCase !== "isFreeTrial" && level.toLowerCase !== "isEnterprise"){
        Logger.error('Bad verifyAccountType level passed');
        let thisErrorDoc = Constants.newErrorDoc();
        thisErrorDoc.errors.push(Constants.allErrors.invalidAccountLevelPassed)
        cb(thisErrorDoc, null)
      }
      MongoOperations.findOne({email: email}, Constants.usersDb, (findOneErrorDoc, findOneReturnDoc)=>{
        if(findOneErrorDoc){
          Logger.error("Error occurred in MongoOperations.findOne within verifyAccountLevel" + ToType.toString(findOneErrorDoc))
          cb(findOneErrorDoc);
        }
        else {
          if(level === "isGood"){
            let user = findOneReturn.data.attributes
            if(user.isGood || user.isBetter || user.isBest || user.isEnterprise || user.isFreeTrial){
              Logger.info("User had isGood true")
              cb(null, true)
            }
            else {
              Logger.info("User had isGood false")
              cb(null, false)
            }
          }
          else if(level === "isBetter"){
            if(user.isBetter || user.isBest || user.isEnterprise || user.isFreeTrial){
              Logger.info("User had isBetter (or greater) true")
              cb(null, true)
            }
            else {
              Logger.info("User had isBetter (or greater) false")
              cb(null, false)
            }
          }
          else if(level === "isBest"){
            if(user.isBest || user.isEnterprise || user.isFreeTrial){
              Logger.info("User had isBetter (or greater) true")
              cb(null, true)
            }
            else {
              Logger.info("User had isBest/isEnterprise/isFreeTrial false")
              cb(null, false)
            }
          }
          else if(level === "isEnterprise"){
            if(user.isEnterprise){
              Logger.info("User had isEnterprise true")
              cb(null, true)
            }
            else {
              Logger.info("User had isEnterprise false")
              cb(null, false)
            }
          }
          else if(level === "isFreeTrial"){
            if(user.isFreeTrial){
              Logger.info("User had isFreeTrial true")
              cb(null, true)
            }
            else {
              Logger.info("User had isFreeTrial false")
              cb(null, false)
            }
          }
        }
      })
    }
  }
}
