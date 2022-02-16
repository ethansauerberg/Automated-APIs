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
                    ObjectCreator.createNewObject(<<object>>, Constants.<<object>>Fields, (createErrorDoc, createdObject)=>{
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
                    })        
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
        Logger.info("\n\nAt the top of GET/<<object>>s with: " + ToType.toString({email: email, password: password, <<object>>Id: <<object>>Id}))
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

    //gets all <<object>>s owned by the email
    //parameters:
        //req.query.password (the user's password)
        //req.query.email (the user's email)
    router.get('/<<version>>/<<object>>s', (req,res)=>{
        let {email, password} = req.query
        Logger.info("\n\nAt the top of GET/<<object>>s with: " + ToType.toString({email: email, password: password}))
        let inputErrorDoc = InputChecker.checkInputsExist([email, password])
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
                    MongoOperations.find({owner: email}, Constants.<<object>>sCollection, (findErrorDoc, findReturnDoc)=>{
                        if(findErrorDoc !== null){
                            res.send(findErrorDoc)
                            return;
                        }
                        else {
                            res.send(findReturnDoc)
                            return;
                        }
                    })
                }
            })
        }
    })


    //edits a <<object>>
    //parameters:
        //req.body.email (the user’s email)
        //req.body.password (the user's password)
        //req.body.toUpdate (fields of the <<object>> to be updated)
        //req.params.<<object>>Id (the Mongo Id of the <<object>> to be updated)
    // router.put('/<<version>>/<<object>>s/:<<object>>Id', (req, res)=>{
    //     let {<<object>>Id} = req.params
    //     let {email, password, toUpdate} = req.body
    //     Logger.info("\n\nAt the top of PUT/users/:<<object>Id with: " + ToType.toString({email: email, password: password, toUpdate: toUpdate, <<object>>Id: <<object>>Id}))
    //     let inputErrorDoc = InputChecker.checkInputsExist([email, password, <<object>>Id])
    //     if(inputErrorDoc !== null){
    //         res.send(inputErrorDoc)
    //         return;
    //     }
    //     else {
    //         Authorizer.verifyObjectOwner(email, password, <<object>>Id, Constants.<<object>>sCollection, (<<object>>VerifyError, <<object>>VerifyDoc, <<object>>VerifyId)=>{
    //             if(<<object>>VerifyError !== null){
    //                 res.send(<<object>>VerifyError)
    //                 return;
    //             }
    //             else {

    //             }
    //         })
    //     }
    // })

    //deletes a <<object>>
    //parameters:
        //req.body.email (the user’s email)
        //req.body.password (the user's password)
        //req.body.toUpdate (fields of the <<object>> to be updated)
        //req.params.<<object>>Id (the Mongo Id of the <<object>> to be updated)
    router.delete('/<<version>>/<<object>>s/:<<object>>Id', (req, res)=>{
        let {<<object>>Id} = req.params
        let {email, password} = req.body
        Logger.info("\n\nAt the top of DELETE/<<object>>s/:<<object>>Id with: " + ToType.toString({email: email, password: password, <<object>>Id: <<object>>Id}))
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
                    MongoOperations.deleteOne(<<object>>VerifyId, Constants.<<object>>sCollection, (deleteOneErrorDoc, deleteOneReturnDoc)=>{
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
        }
    })
}
  