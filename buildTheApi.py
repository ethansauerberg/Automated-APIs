# Necessary imports
from array import array
import shutil
import os
import json

# # path
path = 'C:/Users/ethan/Documents/PersonalProjects/Automated-APIs/'
# Source path
src = 'C:/Users/ethan/Documents/PersonalProjects/Automated-APIs/baseCode'
# Destination path
dest = 'C:/Users/ethan/Documents/PersonalProjects/Automated-APIs/newAPICode'

# testingPath = 'C:/Users/ethan/Documents/PersonalProjects/Automated-APIs/testing/'

# # Keys of things to replace
replaceKeysDict = {
    "version": "<<version>>",
    "url": "<<siteUrl>>",
    "docsUrl": "<<siteDocsUrl>>",
    "adminEmail": "<<adminEmail>>",
    "mongoUser": "<<mongoUser>>",
    "mongoPass": "<<mongoPass>>",
    "mongoClusterName": "<<mongoClusterName>>",
    "mongoDatabaseName": "<<mongoDatabaseName>>",
    "otherCollections": "//<<otherCollections>>",
    "invalidInputMessage": "<<invalidInputMessage>>",
    "invalidEmailOrPasswordMessage": "<<invalidEmailOrPasswordMessage>>",
    "emailTakenMessage": "<<emailTakenMessage>>",
    "requestedResourcesDidNotExistMessage": "<<requestedResourcesDidNotExistMessage>>",
    "requestedResourceAccessDenied": "<<requestedResourceAccessDeniedMessage>>",
    "internalServerErrorMessage": "<<internalServerErrorMessage>>",
    "invalidEmailMessage": "<<invalidEmailMessage>>",
    "invalidPasswordMessage": "<<invalidPasswordMessage>>",
    "invalidMongoIdMessage": "<<invalidMongoIdMessage>>",
    "author": "<<author>>",
    "otherDbCollectionExports": "<<otherDbCollectionExports>>",
    "fields": "//<<fields>>",
    "routesImportLines": "//<<routesImportLines>>",
}

def replaceAndRewrite(filesList, location):
    for item in filesList:
        if not "." in item:
            # print("found directory '" + item + "', recursing on files: ")
            # print(os.listdir(location +"/"+ item))
            replaceAndRewrite(os.listdir(location +"/"+ item), location +"/"+ item)
        else:
            with open(location + "/" + item, "r") as file:
                fileData = file.read()
            for key in replaceKeysDict:
                fileData = fileData.replace(replaceKeysDict[key], replacers[key])
            with open(location + "/" + item, "w") as file:
                file.write(fileData)
            print("Wrote: ..." + location[len(location)-16:] + "/" + item)

def replaceAndRewriteObjectsJs(fileName, location, replacer):
    with open(location + "/routes/objects.js", "r") as file:
        fileData = file.read() 
    fileData = fileData.replace("<<object>>", replacer)
    with open(location + "/routes/" + fileName, "w") as file:
        file.write(fileData)
    print("Wrote: ..." + location[len(location)-10:] + "/routes/" + fileName + " (objects.js)")

# What to replace each with
configsFile = open('configsTest.json')
configs = json.load(configsFile)
replacers = configs["replacers"]
configsFile.close()
objectsArr = configs["objects"]

# print(configs)
missingAKey = False
for key in replaceKeysDict:
    if not key in replacers:
        missingAKey = True
        print("Error: missing data in configs.json. Missing key: " + key)
    elif not replacers[key]:
        missingAKey = True
        print("Error: missing data in configs.json. Missing key: " + key)


if not missingAKey:
    # duplicate baseCode to newAPICode
    destination = shutil.copytree(src, dest)

# combining the code lines for each object into one string to put in replacers
toPutInFields = ""
toPutInRoutesImportLines = ""
for item in objectsArr:
    toPutInFields += item["code"] + "\n\n"
    if item["getsRoutes"]:
        toPutInRoutesImportLines += "require('./routes/" + item["name"] + ".js')(router, app) //CRUD routes for " + item["name"] + "s"
replacers["fields"] = toPutInFields
replacers["routesImportLines"] = toPutInRoutesImportLines

# find and replace the <<__>> with the proper replacers
files = os.listdir("newAPICode")
replaceAndRewrite(files, dest)

# create a new ___.js for each of the objects that should get a routes file
for item in objectsArr:
    if(item["getsRoutes"]):
        fileName = item["name"] + ".js"
        # shutil.copy(src + "/routes/objects.js", dest + "/routes/" + fileName)
        replaceAndRewriteObjectsJs(fileName, dest, item["name"])




#left to do:::

#might have to mess with the way objects are put in the json, that seems sketch
#but should be pretty close to trying it!!!
#might also have to enable waterman IP on mongo's website

#for each object
#   make a copy of objects.js and do the apropriate things (rename routes, etc)
#   make objectFields in constants.js
#   add route to server imports
#iterate through every file and update all <<>> things








# bad? way to trying to create ___Fields code
# def createObjectFieldLines(input):
#     output = []
#     for field in input:

        

# def createObjectRecursiveHelper(input):
#     if isinstance(input, dict):
#         out = ""
#         for field in input:
#             out += createObjectFieldLines(input[field])
#     elif isinstance(input, list):
#         out = ""
#         for item in input: 
#             out += createObjectFieldLines(item)
#     if isinstance(input, int) or isinstance(input, float):
#         return ""

# for field in givenObjects:
#     print(field + "Fields: " + createObjectFieldLines(givenObjects[field]))
#     "objectToCode": {
    #     "testObject": {"field1Str": "", "field2Num": 0, "field3Obj": [{"field4Bool": true, "field5Obj": {"field6Num": 0}}]}
    # }