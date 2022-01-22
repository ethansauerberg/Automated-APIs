from random import random
import requests
import json 
import random

configsFile = open('configsTest.json')
configs = json.load(configsFile)
configs = configs["replacers"]
configsFile.close()

url = "http://" + configs["url"]

emailChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
passChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!#$%^&*()|:>?,/'[]~`"
uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
lowercaseLetters = "abcdefghijklmnopqrstuvwxyz"
numbers = "1234567890"
symbols = "!#$%^&*()|:>?,/'[]~`"

def randomEmail():
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

testEmail = randomEmail()
testPassword = randomPassword()
testBadEmail = randomEmail()
testBadPassword = randomPassword()

testEmail = "asdf@asdf.asdf"
testPassword = "123ASFasd!@#"

try:
    getResponse = requests.post(url + "/" + configs["version"] + "/users",
    data = {
        "email": testEmail,
        "password": testPassword,
    },
        headers = {}
        )
    getResponse.raise_for_status()
    responseJson = getResponse.json()
    print(responseJson)
    events = responseJson.get('events')
except requests.exceptions.HTTPError as errh:
    print(errh)
except requests.exceptions.ConnectionError as errc:
    print(errc)
except requests.exceptions.Timeout as errt:
    print(errt)
except requests.exceptions.RequestException as err:
    print(err)


try:
    getResponse = requests.get(url + "/" + configs["version"] + "/users/:" + testEmail,
    params={
        "password": testPassword,
    },
        headers = {}
        )
    getResponse.raise_for_status()
    responseJson = getResponse.json()
    print(responseJson)
    events = responseJson.get('events')
except requests.exceptions.HTTPError as errh:
    print(errh)
except requests.exceptions.ConnectionError as errc:
    print(errc)
except requests.exceptions.Timeout as errt:
    print(errt)
except requests.exceptions.RequestException as err:
    print(err)

# try:
#     postResponse = requests.post("",
#         data = {},
#         headers = {'Content-type': 'application/json;charset=utf-8', 'Accept': '*/*'}
#         )
#     print(postResponse.json())
#     postResponse.raise_for_status()
#     if postResponse.status_code == 200:
#         print("200 returned; data posted")
#     else: 
#         print(postResponse)
# except requests.exceptions.HTTPError as errh:
#     print(errh)
# except requests.exceptions.ConnectionError as errc:
#     print(errc)
# except requests.exceptions.Timeout as errt:
#     print(errt)
# except requests.exceptions.RequestException as err:
#     print(err)