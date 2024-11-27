from socket import *

s = socket(AF_INET, SOCK_STREAM)
s.connect(("localhost", 12345))  # connect to server (block until accepted)
s.send('Hello, world'.encode('utf-8'))  # send some data
data = s.recv(1024) # receive the response
print(data) # print the result
s.close() # close the connectio






