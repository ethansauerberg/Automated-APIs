from pdb import post_mortem
from random import random
import requests
import json 
import random
import time

def randomEmail():
    emailChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    # passChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!#$%^&*()|:>?,/'[]~`"
    # uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    # lowercaseLetters = "abcdefghijklmnopqrstuvwxyz"
    # numbers = "1234567890"
    # symbols = "!#$%^&*()|:>?,/'[]~`"
    length = random.randint(8, 15)
    email = ""
    while len(email) < length:
        email += emailChars[random.randint(0, len(emailChars) - 1)]
    email += "@"
    length += random.randint(3, 20)
    while len(email) < length:
        email += emailChars[random.randint(0, len(emailChars) - 1)]
    email += "."
    length += random.randint(2, 5)
    while len(email) < length:
        email += emailChars[random.randint(0, len(emailChars) - 1)]
    print("random email generated: " + email)
    return email

def randomPassword():
    # emailChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    passChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!#$%^&*()|:>?,/'[]~`"
    uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lowercaseLetters = "abcdefghijklmnopqrstuvwxyz"
    numbers = "1234567890"
    symbols = "!#$%^&*()|:>?,/'[]~`"
    length = random.randint(4, 96)
    password = ""
    while len(password) < length:
        password += passChars[random.randint(0, len(passChars) - 1)]
    password += uppercaseLetters[random.randint(0, len(uppercaseLetters) - 1)]
    password += lowercaseLetters[random.randint(0, len(lowercaseLetters) - 1)]
    password += numbers[random.randint(0, len(numbers) - 1)]
    password += symbols[random.randint(0, len(symbols) - 1)]
    print("random password generated: " + password)
    return password

def sendRequest(type, fullUrl, data):
    try:
        if type == "post":
            postResponse = requests.post(fullUrl, data = data, headers = {})
            postResponse.raise_for_status()
            responseJson = postResponse.json()
            return responseJson
            # events = responseJson.get('events')
        elif type == "get":
            getResponse = requests.get(fullUrl, params=data, headers = {})
            getResponse.raise_for_status()
            responseJson = getResponse.json()
            return responseJson
            # events = responseJson.get('events')
        elif type == "delete":
            deleteResponse = requests.delete(fullUrl,data=data, headers={})
            deleteResponse.raise_for_status()
            deleteJson = deleteResponse.json()
            return deleteJson
    except requests.exceptions.HTTPError as errh:
        print(errh)
    except requests.exceptions.ConnectionError as errc:
        print(errc)
    except requests.exceptions.Timeout as errt:
        print(errt)
    except requests.exceptions.RequestException as err:
        print(err)

def recursiveSearch(query, input):
    if isinstance(input, list) or isinstance(input, tuple):
        for item in input:
            if(recursiveSearch(query, item)):
                return True
        return False
    elif isinstance(input, dict):
        for key in input:
            if(recursiveSearch(query, input[key])):
                return True
        return False
    else:
        return query in str(input)

def hasErrors(query):
    if hasattr(query, "errors"):
        return True
    else:
        return False

def runTests(tests):
    print("Test results:\n")
    for test in tests: 
        requestReturn = sendRequest(test["testType"], test["testUrl"], test["testData"])
        # if recursiveSearch(test["expectedString"], requestReturn):
        if not hasErrors(requestReturn):
            print(test["testName"] + "success")
            # print("\t" + str(requestReturn) + "\n")

        else:
            print(test["testName"] + "FAILURE")
            print("\t" + str(requestReturn) + "\n")
        time.sleep(2)




post = "post"
get = "get"
delete = "delete"

# testEmail = randomEmail()
# testPassword = randomPassword()
# testBadEmail = randomEmail()
# testBadPassword = randomPassword()
testEmail = "asdf@asdf.asdf"
testPassword = "123ASFasd!@#"

configsFile = open('configsTest.json')
configs = json.load(configsFile)
configs = configs["replacers"]
configsFile.close()

url = "http://" + configs["url"]

usersTests = [
    {"testName": "POST /users good: ", "expectedString": "insertedId", "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},
    {"testName": "POST /users emailTaken: ", "expectedString": "Email Taken", "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},
    {"testName": "GET /users good: ", "expectedString": testEmail, "testType": get, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
    {"testName": "DELETE /users good: ", "expectedString": "deletedCount", "testType": delete, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
]

runTests(usersTests)

 
# users.js:
# post user: one bad email (invalidEmail), one bad password (invalidPassword), one email that already exists (emailTaken), one good (returns user)
# get user: one no results found (requestedResourceDidNotExist), one bad password (invalidEmailOrPassword), one bad ID (invalidMongoId), one good (returns user)
# delete user: one no results found (requestedResourceDidNotExist), one bad password (invalidEmailOrPassword), one bad ID (invalidMongoId), one good (returns deleted user)

# objects.js:
# post object: one bad username (invalidEmailOrPassword), one bad password (invalidEmailOrPassword), one missing input (invalidInput), one good (returns object)
# get one object: one bad username (invalidEmailOrPassword), one bad password (invalidEmailOrPassword), one wrong account (requestedResourceAccessDenied), one bad ID (invalidMongoId), one no results (requstedResourcesDidNotExist), one good (returns object)
# get many objects: one bad username (invalidEmailOrPassword), one bad password (invalidEmailOrPassword), one no results (requestedResourcesDidNotExist), one good (returns objects)
# update one object: one bad username (invalidEmailOrPassword), one bad password (invalidEmailOrPassword), one bad ID (invalidMongoID), one wrong ID (requestedResourcesDidNotExist), one good (returns object)
# delete one object: one bad username (invalidEmailOrPassword), one bad password (invalidEmailOrPassword), one bad ID (invalidMongoID), one wrong ID (requestedResourcesDidNotExist), one good (returns object)

    
# array of objects containing reqType, url, data, and expected string in return.data
# for each object, send it's request, then confirm that it's expected string is in the return.
