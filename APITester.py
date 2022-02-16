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

def randomString():
    stringChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890" ##!$%^&*()|:>?,/'[]~`"
    toReturn = ""
    length = random.randint(1, 15)
    while len(toReturn) < length:
        toReturn += stringChars[random.randint(0, len(stringChars) - 1)]
    return toReturn

def randomNumber():
    if(random.random() > 0.5):
        return random.random()*100
    else:
        return random.randint(0, 100)

def randomBoolean():
    return random.random() > 0.5

def sendRequest(type, fullUrl, data):
    try:
        if type == "post":
            postResponse = requests.post(fullUrl, data = json.dumps(data), headers = {'Content-type': 'application/json'})
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
    if "errors" in query:
        return True
    else:
        return False

def runTests(tests, verbose):
    for test in tests: 
        # print(f"sending {test['testType']} to {test['testUrl']} with {test['testData']}")
        requestReturn = sendRequest(test["testType"], test["testUrl"], test["testData"])
        if(requestReturn):
            if test["shouldSucceed"] != hasErrors(requestReturn):
                print(test["testName"] + "success")
                if verbose:
                    print("\t" + str(requestReturn) + "\n")
            else:
                print(test["testName"] + "FAILURE")
                print("\t" + str(requestReturn) + "\n")
        else: 
            print(f"No request return. RequestReturn: {requestReturn}")
        time.sleep(3)




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
objects = configs["objects"]
configs = configs["replacers"]
configsFile.close()

url = "http://" + configs["url"]

# usersTests = [
#     {"testName": "POST /users good: ", "expectedString": "insertedId", "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},
#     {"testName": "POST /users emailTaken: ", "expectedString": "Email Taken", "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},
#     {"testName": "GET /users good: ", "expectedString": testEmail, "testType": get, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
#     {"testName": "DELETE /users good: ", "expectedString": "deletedCount", "testType": delete, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
# ]

postGetDeleteUsersTests = [
    {"testName": "POST /users good: ", "shouldSucceed": True, "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},
    {"testName": "POST /users emailTaken: ", "shouldSucceed": False, "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},
    {"testName": "GET /users good: ", "shouldSucceed": True, "testType": get, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
    {"testName": "DELETE /users good: ", "shouldSucceed": True, "testType": delete, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
]

postObjectsTests = [
    # {"testName": "POST /users good: ", "shouldSucceed": True, "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},

    {"testName": "POST /testObjects good: ", "shouldSucceed": True, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObjects", "testData": {"email": testEmail, "password": testPassword, "testObject":{"field1": randomString(), "field3": randomBoolean(), "field4": [randomNumber(), randomNumber(), randomNumber()], "field5": [{"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}]}}},
    # {"testName": "POST /testObjects missing input: ", "shouldSucceed": False, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObjects", "testData": {"email": testEmail, "password": testPassword, "testObject":{"field1": randomString(), "field2": "a10", "field4": [randomNumber(), randomNumber(), randomNumber()], "field5": [{"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}]}}},
    # {"testName": "POST /testObjects missing pass and input: ", "shouldSucceed": False, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObjects", "testData": {"email": testEmail, "password": "", "testObject":{"field2": randomNumber(), "field3": randomBoolean(), "field4": [randomNumber(), randomNumber(), randomNumber()], "field5": [{"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}]}}},
    # {"testName": "POST /testObjects good: ", "shouldSucceed": True, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObjects", "testData": {"email": testEmail, "password": testPassword, "testObject":{"field1": randomString(), "field3": randomBoolean(), "field4": [randomNumber(), randomNumber(), randomNumber()], "field5": [{"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}, {"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}, {"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}]}}},
    # {"testName": "POST /testObjects missing input: ", "shouldSucceed": False, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObjects", "testData": {"email": testEmail, "password": testPassword, "testObject":{"field1": randomString(), "field2": "a10", "field4": [randomNumber(), randomNumber(), randomNumber()], "field5": [{"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}]}}},
    # {"testName": "POST /testObjects bad email: ", "shouldSucceed": False, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObjects", "testData": {"email": testEmail + "asdf", "password": testPassword, "testObject":{"field1": randomString(), "field3": randomBoolean(), "field4": [randomNumber(), randomNumber(), randomNumber()], "field5": [{"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}]}}},
    # {"testName": "POST /testObjects bad password: ", "shouldSucceed": False, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObjects", "testData": {"email": testEmail, "password": testPassword + "asdf", "testObject":{"field1": randomString(), "field3": randomBoolean(), "field4": [randomNumber(), randomNumber(), randomNumber()], "field5": [{"nestedField1": randomString(), "nestedField2": randomNumber(), "nestedField4": {"doubleNestedField1": randomString()}}]}}},

    # {"testName": "DELETE /users good: ", "shouldSucceed": True, "testType": delete, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
]

getObjectsTestsSetup = [
    {"testName": "DELETE /users good: ", "shouldSucceed": True, "testType": delete, "testUrl": url + "/" + configs["version"] + "/users/" + testEmail, "testData": {"password": testPassword}},
    {"testName": "POST /users good: ", "shouldSucceed": True, "testType": post, "testUrl": url + "/" + configs["version"] + "/users", "testData" : {"email": testEmail, "password": testPassword,}},
    {"testName": "POST /testObject2s good: ", "shouldSucceed": True, "testType": post, "testUrl": url + "/" + configs["version"] + "/testObject2s", "testData": {"email": testEmail, "password": testPassword, "testObject2":{"fieldA": randomString()}}},
]

runTests(postObjectsTests, True)
# runTests(postGetDeleteUsersTests + postObjectsTests + getObjectsTestsSetup, True)

testObject2Id = '620c9d8dfc32888052ce1493'

getObjectsTests = [
    {"testName": "GET /testObject2s/:testObject2Id good: ", "shouldSucceed": True, "testType": get, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + testObject2Id, "testData": {"email": testEmail, "password": testPassword}},
    {"testName": "GET /testObject2s/:testObject2Id bad Id: ", "shouldSucceed": False, "testType": get, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + testObject2Id + "a", "testData": {"email": testEmail, "password": testPassword}},
    {"testName": "GET /testObject2s/:testObject2Id bad email: ", "shouldSucceed": False, "testType": get, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + testObject2Id, "testData": {"email": testEmail + "a", "password": testPassword}},
    {"testName": "GET /testObject2s/:testObject2Id bad password: ", "shouldSucceed": False, "testType": get, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + testObject2Id, "testData": {"email": testEmail, "password": testPassword + "a"}},
]

getAllObjectsTests = [
    {"testName": "GET /testObject2s good: ", "shouldSucceed": True, "testType": get, "testUrl": url + "/" + configs["version"] + "/testObject2s", "testData": {"email": testEmail, "password": testPassword}},
    {"testName": "GET /testObject2s bad password: ", "shouldSucceed": False, "testType": get, "testUrl": url + "/" + configs["version"] + "/testObject2s", "testData": {"email": testEmail, "password": testPassword + "a"}},
    {"testName": "GET /testObject2s bad email: ", "shouldSucceed": False, "testType": get, "testUrl": url + "/" + configs["version"] + "/testObject2s", "testData": {"email": testEmail + "a", "password": testPassword}},
]

deleteObjectsTests = [
    {"testName": "DELETE /testObject2s/:testObject2Id bad Id: ", "shouldSucceed": False, "testType": delete, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + '620bf24522f849f736828767', "testData": {"email": testEmail, "password": testPassword}},
    {"testName": "DELETE /testObject2s/:testObject2Id bad email: ", "shouldSucceed": False, "testType": delete, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + testObject2Id, "testData": {"email": testEmail + "a", "password": testPassword}},
    {"testName": "DELETE /testObject2s/:testObject2Id bad password: ", "shouldSucceed": False, "testType": delete, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + testObject2Id, "testData": {"email": testEmail, "password": testPassword + "a"}},
    {"testName": "DELETE /testObject2s/:testObject2Id good: ", "shouldSucceed": True, "testType": delete, "testUrl": url + "/" + configs["version"] + "/testObject2s/" + testObject2Id, "testData": {"email": testEmail, "password": testPassword}},
]
# runTests(getObjectsTestsSetup, True)
# runTests(getObjectsTests, True)
# runTests(getAllObjectsTests, True)
# runTests(deleteObjectsTests, True)
# runTests(, True)


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
