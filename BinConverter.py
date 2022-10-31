import json

dataJ = {}

with open('dataCompressed.js') as js:
    data = js.read()
    dataJ = json.loads(data)

print(dataJ)
if dataJ:
    with open('prova.bin', 'wb') as f:
        print(dataJ[0])
        for i in dataJ:
            for j in i:
                f.write(int(j * 100).to_bytes(2, 'little'))