import json

dataJ = {}

with open('dataCompressed.js') as js:
    data = js.read()
    dataJ = json.loads(data)


print(len(dataJ), len(dataJ[0]))
minTemp = 4.41
maxTemp = 67.02

"""
if dataJ:
    with open('prova.bin', 'wb') as f:
        for i in dataJ:
            for j in i:
                f.write(int((j - minTemp) * 100).to_bytes(2, 'little'))
"""