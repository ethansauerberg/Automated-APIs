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

const authorizer = require("../tools/authorizer")

module.exports=(router, app)=>{
    const Constants = require('../constants.js')
    const MongoOperations = require('../tools/mongoOperations.js')
    const InputChecker = require('../tools/inputChecker.js')
    const Authorizer = require('../tools/authorizer.js')
    const ToType = require('../tools/toType.js')
    const Logger = require('../tools/customLog.js')
    const ObjectCreator = require('../tools/objectCreator.js')


    //inserts a new <<object>>
    //parameters:
        //req.body.email (user's email)
        //req.body.password (user's password)
        //req.body.<<object>> (the <<object>> to add to the <<object>>s database)
    router.post('/<<version>>/<<object>>s', (req,res)=>{
        let {email, password, <<object>>} = req.body
        Logger.info("\n\nAt the top of POST/<<object>>s with: " + ToType.toString({email: email, password: password, <<object>>: <<object>>}))
        let inputErrorDoc = InputChecker.checkInputsExist([email, password, <<object>>])
        if(inputErrorDoc !== null){
            res.send(inputErrorDoc)
            return;
        }
        else {
            Authorizer.verifyUser(email, password, (verifyUserError, verifyUserDoc, verifyUserId)=>{
                if(verifyUserError !== null){
                    res.send(verifyUserError)
                    return;
                }
                else {
                    let createErrorDoc, createdObject = ObjectCreator.createNewObject(<<object>>, Constants.<<object>>Fields)
                    if(createErrorDoc != null){
                        res.send(createErrorDoc)
                        return;
                    }
                    else {
                        createdObject["owner"] = email
                        MongoOperations.insertOne(createdObject, Constants.<<object>>sCollection, (insertErrorDoc, insertReturnDoc)=>{
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
    })

    //gets a <<object>>
    //parameters:
        //req.params.<<object>>Id (the <<object>>'s Mongo ID)
        //req.query.password (the user's password)
        //req.query.email (the user's email)
    router.get('/<<version>>/<<object>>s/:<<object>>Id', (req,res)=>{
        let {<<object>>Id} = req.params
        let {email, password} = req.query
        Logger.info("\n\nAt the top of POST/<<object>>s with: " + ToType.toString({email: email, password: password, <<object>>Id: <<object>>Id}))
        let inputErrorDoc = InputChecker.checkInputsExist([email, password, <<object>>Id])
        if(inputErrorDoc !== null){
            res.send(inputErrorDoc)
            return;
        }
        else {
            Authorizer.verifyObjectOwner(email, password, <<object>>Id, Constants.<<object>>sCollection, (<<object>>VerifyError, <<object>>VerifyDoc, <<object>>VerifyId)=>{
                if(<<object>>VerifyError !== null){
                    res.send(<<object>>VerifyError)
                    return;
                }
                else {
                    res.send(<<object>>VerifyDoc)
                    return;
                }
            })
        }
    })

    // // //edits a user
    // // //parameters:
    // // //req.params.email (the user’s email)
    // // //req.query.password (the user's password)
    // //   //req.body.toUpdate - fields of the user to be updated
    // // router.put('/<<version>>/users/:email', (req, res)=>{
    // //   let {email} = req.params
    // //   let {password, toUpdate} = req.body
    // //   Logger.info("\n\nAt the top of PUT/users:email with: " + ToType.toString({email: email, password: password, toUpdate: toUpdate}))
    // //   Authorizer.verifyUser(email, password, (verifyErrorDoc, verifyUserDoc, verifyId)=>{
    // //     if(verifyErrorDoc !== null){
    // //       res.send(verifyErrorDoc)
    // //       return;
    // //     }
    // //     else {
    // //       MongoOperations.updateOne(verifyId, {$set: toUpdate}, {upsert: false}, constants.usersCollection, (updateOneErrorDoc, updateOneReturnDoc)=>{
    // //         if(updateOneErrorDoc !== null){
    // //           res.send(updateOneErrorDoc)
    // //           return;
    // //         }
    // //         else {
    // //           res.send(updateOneReturnDoc)
    // //           return;
    // //         }
    // //       })
    // //     }
    // //   })
    // // })

    // //deletes a user
    // //parameters:
    //   //req.params.email (the user’s email)
    //      //req.query.password (new user's password)
    // router.delete('/<<version>>/users/:email', (req, res)=>{
    //   let {email} = req.params
    //   let {password} = req.query
    //   Logger.info("\n\nAt the top of DELETE/users:email with: " + ToType.toString({email: email, password: password}))
    //   Authorizer.verifyUser(email, password, (verifyErrorDoc, verifyUserDoc, verifyId)=>{
    //     if(verifyErrorDoc !== null){
    //       res.send(verifyErrorDoc)
    //       return;
    //     }
    //     else {
    //       console.log(verifyId + " first");
    //       MongoOperations.deleteOne(verifyId, Constants.usersCollection, (deleteOneErrorDoc, deleteOneReturnDoc)=>{
    //         if(deleteOneErrorDoc !== null){
    //           res.send(deleteOneErrorDoc)
    //           return;
    //         }
    //         else {
    //           res.send(deleteOneReturnDoc)
    //           return;
    //         }
    //       })
    //     }
    //   })
    // })
}
  