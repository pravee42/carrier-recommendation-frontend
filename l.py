import httpx, json

finger_server = "https://192.168.0.113:8443"
#finger_server = "https://localhost:8443"

capture = "SGIFPCapture"

payload = {
  "timeout": 10000,
  "quality": 50,
  "licstr": "",
  "templateformat": "ISO",
  "imagewsqrate": 2.25
}

phone ='8778171244'

headers = {
  "accept": "*/*",
  "accept-encoding": "gzip, deflate, br, zstd",
  "accept-language": "en-US,en;q=0.9",
  "connection": "keep-alive",
  "content-type": "text/plain;charset=UTF-8",
  "host": "localhost:8443",
  "origin": "https://webapi.secugen.com",
  "referer": "https://webapi.secugen.com/",
  "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
}

data = httpx.post(f"{finger_server}/{capture}", data=payload, headers=headers, verify=False)
template1 = (data.json())
print("Finger 1 done")

headers = {
    'Content-Type': "application/json"
}

login_payload = {
    'contact': phone,
    'fingerPrintHash': template1.get('TemplateBase64')
}

print(login_payload)

login = httpx.post("http://192.168.0.121:8000/api/users/login", data=json.dumps(login_payload), headers=headers)
print(login.json())