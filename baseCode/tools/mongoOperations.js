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

const MongoClient = require('mongodb').MongoClient;
const Constants = require('../constants.js')
const InputChecker = require('./inputChecker.js')
const MongoIdCreator = require('./mongoIdCreator.js')
const ToType = require('./toType.js')
const Logger = require('./customLog.js')

module.exports = {
  // Find the item (the first if multiple match) in whichColleciton that satisfied findFilter
  findOne: function findOne(findFilter, whichCollection, cb){
    Logger.info("At the top of findOne in mongoOperations.js")
    let inputErrorDoc = InputChecker.checkInputsExist([findFilter, whichCollection])
    if(inputErrorDoc !== null){
      cb(inputErrorDoc, null)
    }
    else {
      let thisErrorDoc = Constants.newErrorDoc();
      const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      db.connect(dbErr => {
        if (dbErr){
          console.log(dbErr)
          Logger.error('There was an error connecting to mongo error: '+ToType.toString(dbErr))
          thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
          db.close()
          cb(thisErrorDoc, null)
        }
        else {
          let collection = db.db(Constants.dbName).collection(whichCollection);
          if(typeof findFilter !== 'object' || findFilter === null){
            Logger.error("The findFilter passed was not an object: " + ToType.toString(findFilter))
            thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
            db.close()
            cb(thisErrorDoc, null)
          }
          else {
            Logger.info("findFilter is: " + ToType.toString(findFilter))
            collection.findOne(findFilter, (findErr, findRes)=>{
              if(findErr){
                Logger.error("An error occured in findOne: " + ToType.toString(findErr))
                thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
                db.close()
                cb(thisErrorDoc, null)
              }
              else if(findRes){
                let returnDoc = Constants.newReturnDoc();
                returnDoc.data.attributes = findRes;
                returnDoc.data.type = whichCollection;
                returnDoc.data.id = findRes._id;
                Logger.info("Full success for this findOne, doc to return: " + ToType.toString(returnDoc))
                db.close()
                cb(null, returnDoc);
              }
              else {
                Logger.info("No result was found in findOne")
                thisErrorDoc.errors.push(Constants.allErrors.requestedResourcesDidNotExist)
                db.close()
                cb(thisErrorDoc, null)
              }
            })
          }
        }
      });
    }
  },

  // Finds all items in whichCollection that satisfy findFilter.
  find: function find(findFilter, whichCollection, cb){
    Logger.info("At the top of find in mongoOperations.js")
    let inputErrorDoc = InputChecker.checkInputsExist([findFilter, whichCollection])
    if(inputErrorDoc !== null){
      cb(inputErrorDoc, null)
    }
    else {
      let thisErrorDoc = Constants.newErrorDoc();
      const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      db.connect(dbErr => {
        if (dbErr){
          console.log(dbErr)
          Logger.error('There was an error connecting to mongo error: '+ToType.toString(dbErr))
          thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
          db.close()
          cb(thisErrorDoc, null)
        }
        else {
          let collection = db.db(Constants.dbName).collection(whichCollection);
          if(typeof findFilter !== 'object' || findFilter === null){
            Logger.error("The findFilter passed was not an object: " + findFilter)
            thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
            db.close()
            cb(thisErrorDoc, null)
          }
          else {
            Logger.info("findFilter is: " + ToType.toString(findFilter))
            collection.find(findFilter, {}).toArray()
            .then((findRes)=>{
              let returnDoc = Constants.newArrayReturnDoc()
              findRes.forEach(element=>{
                let resourceDoc = Constants.newResourceDoc()
                resourceDoc.type = whichCollection
                resourceDoc.id = element._id
                resourceDoc.attributes = element
                returnDoc.data.push(resourceDoc)
              })
              Logger.info("Full success for this find, doc to return: " + ToType.toString(returnDoc))
              db.close()
              cb(null, returnDoc);
            })
            // collection.find(findFilter, {}, (findErr, findRes)=>{
            //   if(findErr){
            //     Logger.error("An error occured in find: " + findErr)
                // thisErrorDoc.errors.push(constants.allErrors.internalServerError)
            //     db.close()
            //     cb(thisErrorDoc, null)
            //   }
            //   else if(findRes){
            //     let returnDoc = constants.newArrayReturnDoc()
            //     findRes.forEach(element=>{
            //       let resourceDoc = constants.newResourceDoc()
            //       resourceDoc.type = whichCollection
            //       resourceDoc.id = element._id
            //       resourceDoc.attributes = element
            //       returnDoc.data.push(resourceDoc)
            //     })
            //     Logger.info("Full success for this find, doc to return: ")
            //     Logger.info(returnDoc)
            //     db.close()
            //     cb(null, returnDoc);
            //   }
            //   else {
            //     Logger.info("No results were found in find")
                // thisErrorDoc.errors.push(constants.allErrors.requestedResourcesDidNotExist)
            //     db.close()
            //     cb(thisErrorDoc, null)
            //   }
            // })
          }
        }
      });
    }
  },

  // Inserts toInsert into whichCollection.
  insertOne: function insertOne(toInsert, whichCollection, cb){
    Logger.info("At the top of insertOne in mongoOperations.js")
    let inputErrorDoc = InputChecker.checkInputsExist([toInsert, whichCollection])
    if(inputErrorDoc !== null){
      cb(inputErrorDoc, null)
    }
    else {
      let thisErrorDoc = Constants.newErrorDoc();
      const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      db.connect(dbErr => {
        if (dbErr){
          Logger.error('There was an error connecting to mongo error: '+ToType.toString(dbErr))
          thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
          db.close()
          cb(thisErrorDoc, null)
        }
        else {
          let collection = db.db(Constants.dbName).collection(whichCollection);
          if(typeof toInsert !== 'object' || toInsert === null){
            Logger.error("The toInsert passed was not an object: " + ToType.toString(toInsert))
            thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
            db.close()
            cb(thisErrorDoc, null)
          }
          else {
            //here is where we actually perform the operation
            collection.insertOne(toInsert, (insertErr, insertRes)=>{
              if(insertErr){
                Logger.error("An error occured in insertOne: " + ToType.toString(insertErr))
                thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
                db.close()
                cb(thisErrorDoc, null)
              }
              else if(insertRes){
                Logger.info("Return from insertOne operation: " + ToType.toString(insertRes))
                if(insertRes.acknowledged){
                  let returnDoc = Constants.newReturnDoc();
                  returnDoc.data.type = whichCollection;
                  returnDoc.data.id = insertRes.insertedId;
                  returnDoc.data.attributes = insertRes;
                  Logger.info("Full success for this findOne, doc to return: " + ToType.toString(returnDoc))
                  db.close()
                  cb(null, returnDoc);
                }
                else {
                  Logger.error("insertRes.acknowledged was false in return from mongo in insertOne")
                  thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
                  db.close()
                  cb(thisErrorDoc, null)
                }
              }
              else {
                Logger.error("No insertRes was returned from mongo in insertOne")
                thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
                db.close()
                cb(thisErrorDoc, null)
              }
            })
          }
        }
      });
    }
  },

  // Inserts each item in toInsertArray into the collection specified by whichCollection
  // insertMany: function insertMany(toInsertArray, whichCollection, cb){
  //   Logger.info("At the top of insertMany in mongoOperations.js")
  //   let inputErrorDoc = InputChecker.checkInputsExist([toInsertArray, whichCollection])
  //   if(inputErrorDoc !== null){
  //     cb(inputErrorDoc, null)
  //   }
  //   else {
  //     let thisErrorDoc = Constants.newErrorDoc();
  //     const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  //     db.connect(dbErr => {
  //       if (dbErr){
  //         Logger.error('There was an error connecting to mongo error: '+ToString.toString(dbErr))
  //         thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //         db.close()
  //         cb(thisErrorDoc, null)
  //       }
  //       else {
  //         let collection = db.db(Constants.dbName).collection(whichCollection);
  //         if(!toInsertArray){
  //           Logger.warn("The toInsertArray passed was null or empty")
  //           thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //           db.close()
  //           cb(thisErrorDoc, null)
  //         }
  //         else if(!toInsertArray.isArray || toInsertArray === null){
  //           Logger.warn("An item in toInsertArray was not an object: " + ToString.toString(element))
  //           thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //           db.close()
  //           cb(thisErrorDoc, null)
  //         }
  //         else {
  //           toInsertCleaned = []
  //           toInsertArray.forEach(element=>{
  //             if(typeof element !== 'object' || element === null){
  //               Logger.warn("An item in toInsertArray was not an object: " + ToString.toString(element))
  //               thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //               db.close()
  //               cb(thisErrorDoc, null)
  //             }
  //           })
  //           toInsertArray = toInsertCleaned
  //           collection.insertMany(toInsertArray, (insertErr, insertRes)=>{
  //             if(insertErr){
  //               Logger.error("An error occured in insertMany: " + ToString.toString(insertErr))
  //               thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //               db.close()
  //               cb(thisErrorDoc, null)
  //             }
  //             else if(insertRes){
  //               Logger.info("Return from insertMany operation: " + ToString.toString(insertRes))
  //               if(insertRes.insertedCount == 0){
  //                 Logger.error("insertedCount was 0, insert failed")
  //                 thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //                 db.close()
  //                 cb(thisErrorDoc, null)
  //               }
  //               else if(insertRes.insertedCount != toInsertArray.length){
  //                 Logger.error("InsertedCount was not equal to toInsertArray.length, one or more inserts failed (though some may have inserted successfully!!)")
  //                 thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //                 db.close()
  //                 cb(thisErrorDoc, null)
  //               }
  //               else {
  //                 let returnDoc = Constants.newReturnDoc();
  //                 returnDoc.data = [];
  //                 for(const property in insertRes.insertedIds){
  //                   let resourceDoc = {
  //                     type: whichCollection,
  //                     id: insertRes.insertedIds[property]
  //                   }
  //                   returnDoc.data.push(resourceDoc)
  //                 }
  //                 Logger.info("Full success for this insertMany, doc to return: " + ToString.toString(returnDoc))
  //                 db.close()
  //                 cb(null, returnDoc);
  //               }
  //             }
  //             else {
  //               Logger.error("No insertRes was returned in insertMany")
  //               thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //               db.close()
  //               cb(thisErrorDoc, null)
  //             }
  //           })
  //         }
  //       }
  //     });
  //   }
  // },

  // Updates the item with MongoId id from whichCollection with new data specified in update, and update options specified in options
  // updateOne: function updateOne(id, update, options, whichCollection, cb){
  //   Logger.info("At the top of updateOne in mongoOperations.js")
  //   let inputErrorDoc = InputChecker.checkInputsExist([id, update, whichCollection])
  //   if(inputErrorDoc !== null){
  //     cb(inputErrorDoc, null)
  //   }
  //   else {
  //     let thisErrorDoc = Constants.newErrorDoc();
  //     const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  //     db.connect(dbErr => {
  //       if (dbErr){
  //         Logger.error('There was an error connecting to mongo error: '+ToType.toString(dbErr))
  //         thisErrorDoc.errors.push(Constants.allErrors.databaseConnectionError)
  //         db.close()
  //         cb(thisErrorDoc, null)
  //       }
  //       else {
  //         let collection = db.db(Constants.dbName).collection(whichCollection);
  //         MongoIdCreator.createMongoId(id, (idErrorDoc, mongoId)=>{
  //           if(idErrorDoc){
  //             db.close()
  //             cb(idErrorDoc, null)
  //           }
  //           else {
  //             Logger.info("updateOne mongoId is: " + ToType.toString(mongoId))
  //             collection.updateOne({_id: mongoId}, update, options, (updateErr, updateRes)=>{
  //               if(updateErr){
  //                 Logger.error("An error occured in updateOne: " + ToType.toString(updateErr))
  //                 thisErrorDoc.errors.push(Constants.allErrors.databaseOperationError)
  //                 db.close()
  //                 cb(thisErrorDoc, null)
  //               }
  //               else if(updateRes){
  //                 let returnDoc = Constants.newReturnDoc();
  //                 returnDoc.data.attributes = updateRes;
  //                 returnDoc.data.id = id;
  //                 returnDoc.data.type = whichCollection
  //                 Logger.info("Full success for this updateOne, doc to return: " + ToType.toString(returnDoc))
  //                 db.close()
  //                 cb(null, returnDoc);
  //               }
  //               else {
  //                 Logger.error("No updateRes was returned from mongo in updateOne")
  //                 thisErrorDoc.errors.push(Constants.allErrors.databaseOperationError)
  //                 db.close()
  //                 cb(thisErrorDoc, null)
  //               }
  //             })
  //           }
  //         })
  //       }
  //     });
  //   }
  // },

  // Deletes the item with MongoId id from whichCollection
  deleteOne: function deleteOne(id, whichCollection, cb){
    Logger.info("At the top of deleteOne in mongoOperations.js")
    let inputErrorDoc = InputChecker.checkInputsExist([id, whichCollection])
    if(inputErrorDoc !== null){
      cb(inputErrorDoc, null)
    }
    else {
      let thisErrorDoc = Constants.newErrorDoc();
      const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      db.connect(dbErr => {
        if (dbErr){
          Logger.error('There was an error connecting to mongo error: '+ToType.toString(dbErr))
          thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
          db.close()
          cb(thisErrorDoc, null)
        }
        else {
          let collection = db.db(Constants.dbName).collection(whichCollection);
          MongoIdCreator.createMongoId(id, (idErrorDoc, mongoId)=>{
            if(idErrorDoc){
              db.close()
              cb(idErrorDoc, null)
            }
            else {
              Logger.info("deleteOne mongoId is: " + ToType.toString(mongoId))
              collection.deleteOne({_id: mongoId}, (deleteErr, deleteRes)=>{
                if(deleteErr){
                  Logger.error("An error occured in deleteOne: " + ToType.toString(deleteErr))
                  thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
                  db.close()
                  cb(thisErrorDoc, null)
                }
                else if(deleteRes){
                  let returnDoc = Constants.newReturnDoc();
                  returnDoc.data.attributes = deleteRes;
                  returnDoc.data.id = null
                  returnDoc.data.type = null
                  Logger.info("Full success for this deleteOne, doc to return: " + ToType.toString(returnDoc))
                  db.close()
                  cb(null, returnDoc);
                }
                else {
                  Logger.error("No deleteRes was returned from mongo in deleteOne")
                  thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
                  db.close()
                  cb(thisErrorDoc, null)
                }
              })
            }

          })
        }
      });
    }
  },


  // Deletes all items in whichCollection that meet the passed deleteFilter
  // deleteMany: function deleteMany(deleteFilter, whichCollection, cb){
  //   Logger.info("At the top of deleteMany in mongoOperations.js")
  //   let inputErrorDoc = InputChecker.checkInputsExist([deleteFilter, whichCollection])
  //   if(inputErrorDoc !== null){
  //     cb(inputErrorDoc, null)
  //   }
  //   else {
  //     let thisErrorDoc = Constants.newErrorDoc();
  //     const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  //     db.connect(dbErr => {
  //       if (dbErr){
  //         Logger.error('There was an error connecting to mongo error: '+ToString.toString(dbErr))
  //         thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //         db.close()
  //         cb(thisErrorDoc, null)
  //       }
  //       else {
  //         let collection = db.db(Constants.dbName).collection(whichCollection);
  //         if(typeof deleteFilter !== 'object' || deleteFilter === null){
  //           Logger.error("The deleteFilter passed was not an object: " + ToString.toString(deleteFilter))
  //           thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //           db.close()
  //           cb(thisErrorDoc)
  //         }
  //         else {
  //           Logger.info("deleteFilter is: " + ToString.toString(deleteFilter))
  //           collection.updateOne(deleteFilter, (deleteErr, deleteRes)=>{
  //             if(deleteErr){
  //               Logger.error("An error occured in updateOne: " + ToString.toString(deleteErr))
  //               thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //               db.close()
  //               return thisErrorDoc
  //             }
  //             else if(deleteRes){
  //               let returnDoc = Constants.newReturnDoc();
  //               returnDoc.data.id = null
  //               returnDoc.data.type = null
  //               returnDoc.data.attributes = deleteRes;
  //               Logger.info("Full success for this deleteMany, doc to return: " + ToString.toString(returnDoc))
  //               db.close()
  //               cb(null, returnDoc);
  //             }
  //             else {
  //               Logger.error("No deleteRes was returned from mongo in deleteMany")
  //               thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //               db.close()
  //               cb(thisErrorDoc, null)
  //             }
  //           })
  //         }
  //       }
  //     });
  //   }
  // },

  // Drops a collection, specificed by whichCollection.
  // dropCollection: function dropCollection(whichCollection, cb){
  //   Logger.info("At the top of dropCollection in mongoOperations.js")
  //   let inputErrorDoc = InputChecker.checkInputsExist([whichCollection])
  //   if(inputErrorDoc !== null){
  //     cb(inputErrorDoc, null)
  //   }
  //   else {
  //     let thisErrorDoc = Constants.newErrorDoc();
  //     const db = new MongoClient(Constants.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  //     db.connect(dbErr => {
  //       if (dbErr){
  //         Logger.error('There was an error connecting to mongo error: '+ToType.toString(dbErr))
  //         thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //         db.close()
  //         cb(thisErrorDoc, null)
  //       }
  //       else {
  //         let collection = db.db(Constants.dbName).collection(whichCollection);
  //         collection.drop((dropErr, dropSuccess)=>{
  //           if(dropErr){
  //             Logger.error(dropErr)
  //             thisErrorDoc.errors.push(Constants.allErrors.internalServerError)
  //             db.close()
  //             cb(thisErrorDoc, null)
  //           }
  //           else {
  //             let returnDoc = Constants.newReturnDoc();
  //             returnDoc.data.id = null
  //             returnDoc.data.type = null
  //             returnDoc.data.attributes = dropSuccess;
  //             Logger.info("Full success for this dropCollection, doc to return: " + ToType.toString(returnDoc))
  //             db.close()
  //             cb(null, returnDoc);
  //           }
  //         })
  //       }
  //     })
  //   }
  // }
}
