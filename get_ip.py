 # Works fine... MAYBE = make python write the ip in my server.js & myjs.js everytime before running the server
import socket

host = socket.gethostname()
ip_address = socket.gethostbyname(host)
print(ip_address)