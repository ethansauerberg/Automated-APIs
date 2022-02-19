# Necessary imports
from array import array
import shutil
import os
import json
from tkinter import N

# # path

path = os.getcwd()
# Source path
src = path + '/baseCode'
# Destination path
dest = path + '/newAPICode'

# # Keys of things to replace
replaceKeysDict = {
    "version": "<<version>>",
    "url": "<<siteUrl>>",
    "docsUrl": "<<siteDocsUrl>>",
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
    "otherDbCollectionExports": "//<<otherDbCollectionExports>>",
    "fieldsExports": "//<<objectExports>>",
    "fields": "//<<objectFields>>",
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
configsFile = open('configs.json')
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
    newDest = dest
    count = 0
    while os.path.isdir(newDest):
        count = count + 1
        newDest = dest + str(count)
        print(newDest)
    # duplicate baseCode to newAPICode
    dest = newDest
    destination = shutil.copytree(src, dest)

# combining the code lines for each object into one string to put in replacers
toPutInFieldsExports = ""
toPutInFields = ""
toPutInRoutesImportLines = ""
toPutInOtherDbCollectionExports = ""
toPutInOtherCollections = ""
for item in objectsArr:
    toPutInFieldsExports += item["name"] + "Fields : " + item["name"] + "Fields, \n\t"
    toPutInFields += item["code"] + "\n\n"
    if item["getsRoutes"]:
        toPutInRoutesImportLines += "require('./routes/" + item["name"] + ".js')(router, app) //CRUD routes for " + item["name"] + "s\n"
        toPutInOtherDbCollectionExports += item["name"] + "sCollection: " + item["name"] + "sCollection,\n\t"
        toPutInOtherCollections += "const " + item["name"] + "sCollection = '" + item["name"] + "'\n" 
replacers["fields"] = toPutInFields
replacers["routesImportLines"] = toPutInRoutesImportLines
replacers["fieldsExports"] = toPutInFieldsExports
replacers["otherDbCollectionExports"] = toPutInOtherDbCollectionExports
replacers["otherCollections"] = toPutInOtherCollections

# find and replace the <<__>> with the proper replacers
files = os.listdir(dest)
replaceAndRewrite(files, dest)

# create a new ___.js for each of the objects that should get a routes file
for item in objectsArr:
    if(item["getsRoutes"]):
        fileName = item["name"] + ".js"
        # shutil.copy(src + "/routes/objects.js", dest + "/routes/" + fileName)
        replaceAndRewriteObjectsJs(fileName, dest, item["name"])
    if(item["name"] == "objects"):
        print("ERROR: Invalid object name (object named objects).")
os.remove(dest + "/routes/objects.js")








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