from socket import *

s = socket(AF_INET, SOCK_STREAM)
s.bind(("127.0.0.1", 12345))
s.listen(5)
while True:  # forever
    (conn, addr) = s.accept()  # accept connection from client
    data = conn.recv(1024)  # receive data from client
    if not data: break  # stop if client stopped
    print(data)
    conn.send((str(data) + "*").encode('utf-8'))  # return sent data plus an "*"
conn.close()  # close the connection

