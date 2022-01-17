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
    "docsUrl": "<<siteDocsUrl>>",
    "adminEmail": "<<adminEmail>>",
    "mongoUser": "<<mongoUser>>",
    "mongoPass": "<<mongoPass>>",
    "mongoClusterName": "<<mongoClusterName>>",
    "otherCollections": "//<<otherCollections>>",
    "invalidInputMessage": "<<invalidInputMessage>>",
    "invalidUsernameOrPasswordMessage": "<<invalidUsernameOrPasswordMessage>>",
    "requestedResourcesDidNotExistMessage": "<<requestedResourcesDidNotExistMessage>>",
    "internalServerErrorMessage": "<<internalServerErrorMessage>>",
    "author": "<<author>>",
    "otherDbCollectionExports": "<<otherDbCollectionExports>>",
    "fields": "//<<fields>>",
    "routesImportLines": "//<<routesImportLines>>"
}

# What to replace each with
configsFile = open('configsTest.json')
configs = json.load(configsFile)
replacers = configs["replacers"]
configsFile.close()
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
    # Copy the content from source to destination
    destination = shutil.copytree(src, dest)

files = os.listdir("newAPICode")
# print(files)

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

replaceAndRewrite(files, dest)



#left to do:::

#might have to mess with the way objects are put in the json, that seems sketch
#but should be pretty close to trying it!!!
#might also have to enable waterman IP on mongo's website

#for each object
#   make a copy of objects.js and do the apropriate things (rename routes, etc)
#   make objectFields in constants.js
#   add route to server imports
#iterate through every file and update all <<>> things