from flask import Flask, jsonify, request
from threading import Lock, Thread
from datetime import datetime
from time import sleep

# how long to wait for a heartbeat from a server before considering it down
HEARTBEAT_TIMEOUT_S = 5


HEARTBEAT_INTERVAL_S = 0.25

app = Flask(__name__)

# use a lock to ensure the flask request handlers
# don't modify the server list at the same time
lock = Lock()
server_list = {}

# occasionally iterate the server list and remove old
# servers that are no longer answering
def cleanup_old_servers(timeout, interval):
    while True:
        with lock:
            now = datetime.now()
            remove = [name for name in server_list if (now - server_list[name]['lastHb']).total_seconds() > timeout]
            for name in remove: 
                print(f"{name} is down. Latest heartbeat received at {server_list[name]['lastHb']}")
                del server_list[name]
        sleep(interval)

cleanup_thread = Thread(target=cleanup_old_servers, args=[HEARTBEAT_TIMEOUT_S, HEARTBEAT_INTERVAL_S])
cleanup_thread.daemon = True
cleanup_thread.start()


# test route to see the app is alive
@app.route('/')
def main():
    return jsonify({ 'message': 'Hello world', 'success': True })

@app.route('/heartbeat', methods=['POST'])
def heartbeat():
    # we expect servers to send heartbeat messages with the following structure
    # {
    #    name: '',
    #    status: 'active'
    #    port: 4001
    # }

    # use lock to avoid race conditions
    with lock:
        # get the request data from the HTTP payload
        server = request.get_json()


        name = server['name']
        isNew = not name in server_list.keys()

        # if this is a new server, add it to our list
        if isNew:
            server_list[name] = server
            print(f"Discovered new server '{server['name']}' with status '{server['status']}'")
        server_list[name]['lastHb'] = datetime.now()

    # return some JSON data
    return jsonify({'success': True, 'isNew': isNew})

if __name__ == '__main__':
    app.run(debug=True, port=4000)