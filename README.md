# CS4459B-Consistent-Hashing

## Proxy
1. Run with `python3 backend/proxy.py`, a server will start on port 4000.
2. Navigate to [http://localhost:4000/](http://localhost:4000/) to see that the server is alive.
3. Use Postman to send a POST request to [http://localhost:4000/heartbeat](http://localhost:4000/heartbeat) with the following data:
```
{
    "name": "server.003",
    "status": "active",
    "port": 4003
}
```
and the server will be added to the proxy's list. If a new heartbeat isn't received in 5 seconds, the proxy will assume the server no longer exists.
```
Discovered new server 'server.003' with status 'active'
127.0.0.1 - - [09/Apr/2024 18:42:46] "POST /heartbeat HTTP/1.1" 200 -
127.0.0.1 - - [09/Apr/2024 18:42:48] "POST /heartbeat HTTP/1.1" 200 -
server.003 is down. Latest heartbeat received at 2024-04-09 18:42:48.716565
```