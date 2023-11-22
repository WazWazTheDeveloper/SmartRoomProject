import serial
from numpy import * 

# this will decode the signals send from the arduino into binery and save it into log.log file

def decodeToBinary(arr):
    final = []
    for i in range(int(len(arr)/2)):
        if(arr[2*i+1] < 1000):
            final.append(0)
        if(arr[2*i+1] > 1000):
            if(arr[2*i+1] > 2000):
                print(2*i)
                print(arr[2*i])
                print(2*i+1)
                print(arr[2*i+1])
            final.append(1)
    string = ','.join(str(x) for x in final).replace(',','')
    stringWithSpace = ' '.join(string[i:i+8] for i in range(0, len(string), 8))
    return stringWithSpace

def saveToLog(string):
    f = open("log.log", "a")
    f.write(string+'\n')
    f.close()

def read():
    return Arduino.read()

if __name__ == "__main__":
    Arduino = serial.Serial('com3',115200)
    while True:
        isDone = False
        isPastFirst = 0
        data = b''
        data += Arduino.readline()

        # while not isDone:
        #     byte = Arduino.read()
        #     if byte != b'\n' and byte != b'\r':
        #         data  +=  byte
        #     if byte == b'\n':
        #         isPastFirst +=1
        #     if isPastFirst == 2:
        #         isDone = True

        data = data[0:-2].decode()
        
        # convert to stringarray and stip unnedded stuff
        arrOfStringData = data.strip().replace(' ','').split(',')
        arrOfStringData = arrOfStringData[2:-2]

        # covert array to ints
        arrOfIntData = [int(numeric_string) for numeric_string in arrOfStringData]
        binaryOfData = decodeToBinary(arrOfIntData)
        saveToLog(binaryOfData)
