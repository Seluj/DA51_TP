from socket import *

s = socket(AF_INET, SOCK_STREAM)
s.connect("localhost")  # connect to server (block until accepted)
s.send('Hello, world')  # send some data
data = s.recv(1024)
print(data)
s.close()
# receive the response
# print the result
# close the connectio
