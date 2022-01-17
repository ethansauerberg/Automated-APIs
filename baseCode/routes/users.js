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

module.exports=(router, app)=>{
    const constants = require('../constants.js')
    const MongoOperations = require('../tools/mongoOperations.js')
    const InputChecker = require('../tools/objectCreator.js')
    const Authorizer = require('../tools/authorizer.js')
    const ToType = require('../tools/toType.js')
    const PasswordHash = require('password-hash'); //for hasing passwords
    const EmailValidator = require("email-validator"); //for validating emails
    const Logger = require('../tools/customLog.js')
  
  
  
    //inserts a new user (this is our register route)
    //parameters:
      //req.body.email (new user's email)
      //req.body.password (new user's password in plain text, which will be hashed by password-hash)
    router.post('/v1/users', (req,res)=>{
      let {email, password} = req.body
      Logger.info("\n\nAt the top of POST/users with: " + ToType.toString({email: email, password: password}))
      let inputErrorDoc = InputChecker.checkInputsExist([email, password])
      if(inputErrorDoc !== null){
        res.send(inputErrorDoc)
        return;
      }
      else {
        if(!EmailValidator.validate(email)){
          Logger.warn("Email failed to pass email validator")
          let thisErrorDoc = constants.newErrorDoc();
          thisErrorDoc.errors.push(constants.allErrors.invalidEmail)
          res.send(thisErrorDoc)
          return;
        }
        if(constants.validatePassword(password) == false){
          Logger.warn("Password failed to pass password validator")
          let thisErrorDoc = constants.newErrorDoc();
          thisErrorDoc.errors.push(constants.allErrors.invalidPassword)
          res.send(thisErrorDoc)
          return;
        }
        else {
          Logger.info("Username and password both passed the validators")
          Logger.info("Using MongoOperations.find() to check if a user exists with the username")
          MongoOperations.find({email: email}, constants.usersCollection, (findErrorDoc, findReturnDoc)=>{
            if(findErrorDoc !== null){
              res.send(findErrorDoc);
              return;
            }
            else {
              Logger.info("MongoOperations.find() was successful")
              if(findReturnDoc.data.length != 0){
                Logger.warn("A user already existed with the email: " + email + ". Returning an error doc.")
                let thisErrorDoc = constants.newErrorDoc();
                thisErrorDoc.errors.push(constants.allErrors.emailTaken)
                res.send(thisErrorDoc)
                return;
              }
              else {
                Logger.info("The email was not taken. Hashing password and calling MongoOperations.insertOne()")
                let userDoc = constants.newUserDoc()
                userDoc.email = email;
                userDoc.password = PasswordHash.generate(password)
                MongoOperations.insertOne(userDoc, constants.usersCollection, (insertErrorDoc, insertReturnDoc)=>{
                  if(insertErrorDoc !== null){
                    res.send(insertErrorDoc)
                    return;
                  }
                  else {
                    res.send(insertReturnDoc)
                    return;
                  }
                })
              }
            }
          })
        }
      }
    })
  
    //gets a user
    //parameters:
      //req.params.email (the user’s email)
         //req.query.password (the user's password)
    router.get('/v1/users/:email', (req, res)=>{
      let {email} = req.params
      let {password} = req.query
      Logger.info("\n\nAt the top of GET/users/:email with with: " + ToType.toString({email: email, password: password}))
      console.log(email, password)
      Authorizer.verifyUser(email, password, (verifyErrorDoc, verifyUserDoc, verifyId)=>{
        if(verifyErrorDoc !== null){
          res.send(verifyErrorDoc)
          return;
        }
        else {
          res.send(verifyUserDoc)
          return;
        }
      })
  
    })
  
    // //edits a user
    // //parameters:
    // //req.params.email (the user’s email)
    // //req.query.password (the user's password)
    //   //req.body.toUpdate - fields of the user to be updated
    // router.put('/v1/users/:email', (req, res)=>{
    //   let {email} = req.params
    //   let {password, toUpdate} = req.body
    //   Logger.info("\n\nAt the top of PUT/users:email with: " + ToType.toString({email: email, password: password, toUpdate: toUpdate}))
    //   Authorizer.verifyUser(email, password, (verifyErrorDoc, verifyUserDoc, verifyId)=>{
    //     if(verifyErrorDoc !== null){
    //       res.send(verifyErrorDoc)
    //       return;
    //     }
    //     else {
    //       MongoOperations.updateOne(verifyId, {$set: toUpdate}, {upsert: false}, constants.usersCollection, (updateOneErrorDoc, updateOneReturnDoc)=>{
    //         if(updateOneErrorDoc !== null){
    //           res.send(updateOneErrorDoc)
    //           return;
    //         }
    //         else {
    //           res.send(updateOneReturnDoc)
    //           return;
    //         }
    //       })
    //     }
    //   })
    // })
  
    //deletes a user
    //parameters:
      //req.params.email (the user’s email)
         //req.query.password (new user's password)
    router.delete('/v1/users/:email', (req, res)=>{
      let {email} = req.params
      let {password} = req.query
      Logger.info("\n\nAt the top of DELETE/users:email with: " + ToType.toString({email: email, password: password}))
      Authorizer.verifyUser(email, password, (verifyErrorDoc, verifyUserDoc, verifyId)=>{
        if(verifyErrorDoc !== null){
          res.send(verifyErrorDoc)
          return;
        }
        else {
          console.log(verifyId + " first");
          MongoOperations.deleteOne(verifyId, constants.usersCollection, (deleteOneErrorDoc, deleteOneReturnDoc)=>{
            if(deleteOneErrorDoc !== null){
              res.send(deleteOneErrorDoc)
              return;
            }
            else {
              res.send(deleteOneReturnDoc)
              return;
            }
          })
        }
      })
    })
  }
  