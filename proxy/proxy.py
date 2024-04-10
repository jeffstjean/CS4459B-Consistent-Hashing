from flask import Flask, jsonify, request
from threading import Lock, Thread
from datetime import datetime
import hashlib
import requests
from time import sleep

class ConsistentHashing:
    def __init__(self):
        self.nodes = []

    def add_node(self, node):
        hash_value = self.hash(node)
        if hash_value not in self.nodes:
            self.nodes.append(hash_value)
            self.nodes.sort()

    def remove_node(self, node):
        hash_value = self.hash(node)
        if hash_value in self.nodes:
            self.nodes.remove(hash_value)

    def get_server(self, key):
        if not self.nodes:
            return None
        key_hash = self.hash(key)
        for node_hash in self.nodes:
            if key_hash <= node_hash:
                return self._find_server_by_hash(node_hash)
        # If key's hash is greater than any server's, wrap around to the first server in the sorted list
        return self._find_server_by_hash(self.nodes[0])

    @staticmethod
    def hash(name):
        """Get a constrained hash value of a name (key or server)."""
        return int(hashlib.md5(name.encode()).hexdigest(), 16) % 10000

    def _find_server_by_hash(self, hash_value):
        for server_name, server_info in server_list.items():
            if self.hash(server_name) == hash_value:
                return server_info
        return None

# how long to wait for a heartbeat from a server before considering it down
HEARTBEAT_TIMEOUT_S = 5
HEARTBEAT_INTERVAL_S = 0.25

app = Flask(__name__)

# use a lock to ensure the flask request handlers
# don't modify the server list at the same time
lock = Lock()
server_list = {}
hashing = ConsistentHashing()

# occasionally iterate the server list and remove old
# servers that are no longer answering
def cleanup_old_servers(timeout, interval):
    while True:
        # use the global lock so we avoid race conditions
        with lock:

            # figure out which servers haven't responded in awhile
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
    return jsonify({ 'message': 'Hello world', 'error': False })

@app.route('/servers', methods=['GET'])
def servers():
    # save a locally copy using the lock
    with lock:
        servers = server_list
    
    converted_list = [{'name': key, 'hash': ConsistentHashing.hash(key), **value} for key, value in servers.items()]

    return jsonify(converted_list)

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
        server = request.json

        name = server['name']
        isNew = not name in server_list.keys()
        hashing.add_node(name)

        # if this is a new server, add it to our list
        if isNew:
            server_list[name] = server
            print(f"Discovered new server '{server['name']}' on port '{server['port']}'")
        server_list[name]['lastHb'] = datetime.now()

    # return some JSON data
    return jsonify({ 'isNew': isNew })


@app.route('/data', methods=['GET', 'POST'])
def data():
    key = request.args.get('key', '')
    server_info = hashing.get_server(key)
    if not server_info:
        return jsonify({'error': 'No servers available'}), 503
    
    url = f"http://localhost:{server_info['port']}/data?key={key}"

    if request.method == 'POST':
        response = requests.post(url, json=request.get_json())
    else:
        response = requests.get(url)

    return jsonify(response.json()), response.status_code

    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True, port=4000)