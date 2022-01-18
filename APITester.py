import requests
# import json

from requests.api import post
sessionDuration = 600000

try:
    getResponse = requests.get('', timeout=5)
    getResponse.raise_for_status()
    responseJson = getResponse.json()
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
    postResponse = requests.post("",
        data = {},
        headers = {'Content-type': 'application/json;charset=utf-8', 'Accept': '*/*'}
        )
    print(postResponse.json())
    postResponse.raise_for_status()
    if postResponse.status_code == 200:
        print("200 returned; data posted")
    else: 
        print(postResponse)
except requests.exceptions.HTTPError as errh:
    print(errh)
except requests.exceptions.ConnectionError as errc:
    print(errc)
except requests.exceptions.Timeout as errt:
    print(errt)
except requests.exceptions.RequestException as err:
    print(err)