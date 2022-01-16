#copy baseCode
#for each object
#   make a copy of objects.js and do the apropriate things (rename routes, etc)
#   make objectFields in constants.js
#   add route to server imports
#iterate through every file and update all <<>> things



# Necessary imports
import shutil
import os
import sys
import json

# path
path = 'C:/Users/ethan/Dropbox/PC/Documents/PersonalProjects/Automated-APIs/'
# Source path
src = 'C:/Users/ethan/Dropbox/PC/Documents/PersonalProjects/Automated-APIs/baseCode'
# Destination path
dest = 'C:/Users/ethan/Dropbox/PC/Documents/PersonalProjects/Automated-APIs/newAPICode'

# Keys of things to replace
replaceKeysDict = {
    "url": "<<siteUrl>>",
    "docsUrl": "<<siteDocsUrl",
    "adminEmail": "<<adminEmail>>",
    "mongoUser": "<<mongoUser>>",
    "mongoPass": "<<mongoPass>>",
    "mongoDbName": "<<mongoDbName>>",
    "otherCollections": "//<<otherCollections>>",
    "invalidInputMessage": "<<invalidInputMessage>>",
    "invalidUsernameOrPasswordMessage": "<<invalidUsernameOrPasswordMessage>>",
    "requestedResourcesDidNotExistMessage": "<<requestedResourcesDidNotExistMessage>>",
    "internalServerErrorMessage": "<<internalServerErrorMessage>>",
    "author": "<<author>>",
    "otherDbCollectionExports": "<<otherDbCollectionExports>>",
    "fields": "//<<fields>>",
    "routesRequireLines": "//<<routesImportLines>>"
}

# What to replace each with
replaceDataDict = json.load("configs.json")

missingAKey = False
for key in replaceKeysDict:
    if not key in replaceDataDict:
        missingAKey = True
        print("Error: missing data in configs.json. Missing key: " + key)
    elif replaceDataDict[key] == "":
        missingAKey = True
        print("Error: missing data in configs.json. Missing key: " + key)

if not missingAKey:
    # Copy the content from source to destination
    destination = shutil.copytree(src, dest)
