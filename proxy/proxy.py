from flask import Flask, jsonify, request
from flask_cors import CORS
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

    def get_server(self, key_hash):
        if not self.nodes:
            return None
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
    
    def get_next_higher_node(self, node):
        hash_value = self.hash(node)
        # If the node's hash is greater than the last in the list, wrap around to the first node
        for node_hash in self.nodes:
            if hash_value < node_hash:
                return self._find_server_by_hash(node_hash)
        # Wrap around to the first node in the list
        return self._find_server_by_hash(self.nodes[0]) if self.nodes else None

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


@app.route('/heartbeat', methods=['POST'])
def heartbeat():
    with lock:
        server_data = request.json
        name = server_data['name']

        isNew = name not in server_list
        if isNew:
            hashing.add_node(name)
            server_list[name] = server_data
            print(f"Discovered new server '{server_data['name']}' on port '{server_data['port']}'")

        state_change_to_active = server_data['status'] == 'active' and server_list[name]['status'] == 'inactive'


        if state_change_to_active:
            hashing.add_node(name)
            # Implement redistribution logic here
            redistribute_data_on_activation(name)

        server_list[name]['lastHb'] = datetime.now()
        server_list[name]['status'] = server_data['status']

        return jsonify({'isNew': isNew, 'stateChangeToActive': state_change_to_active})

def redistribute_data_on_activation(server_name):
    # Assuming server_name is the name of the server that has just become active
    # This function encapsulates the logic for redistributing the data accordingly

    server_hash = hashing.hash(server_name)
    next_higher_node_info = hashing.get_next_higher_node(server_name)

    if next_higher_node_info:
        try:
            # Retrieve data from the next higher node
            higher_node_data_response = requests.get(f"http://localhost:{next_higher_node_info['port']}/data", json={})
            if higher_node_data_response.status_code == 200:
                data_items = higher_node_data_response.json()

                # Determine which items should be moved to the newly active server
                items_to_transfer = {k: v for k, v in data_items.items() if hashing.hash(k) <= server_hash}

                # Remove items from the higher node and add them to the newly active server
                for key, value in items_to_transfer.items():
                    # Assuming deletion is handled or silently ignored if not needed
                    requests.delete(f"http://localhost:{next_higher_node_info['port']}/data", json={key: key})
                    add_data(key, value)

        except requests.exceptions.RequestException as e:
            print(f'Error redistributing data: {e}')
            # Handle exception or logging

# Ensure add_data is defined as previously outlined or updated accordingly

def add_data(key, value):
    key_hash = hashing.hash(key)
    server_info = hashing.get_server(key_hash)
    
    if not server_info:
        return jsonify({'error': True, 'message': 'No servers available'}), 503
    
    url = f"http://localhost:{server_info['port']}/data"

    try:
        requests.post(url, json={'key': key, 'value': value})
        return jsonify(success=True)
    except requests.exceptions.RequestException as e:
        return jsonify({ 'error': True, 'message': f'Failed to POST data: {e}' })

@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        data = request.json
        if 'key' not in data or 'value' not in data:
            return jsonify({ 'error': True, 'message': 'Please provide "key" and "value"'} ), 400
        
        return add_data(data['key'], data['value'])
    
    else:  # GET
        server_data = []
        with lock:
            for name, info in server_list.items():
                try:
                    response = requests.get(f"http://localhost:{info['port']}/data", json={})
                    if response.status_code == 200:
                        data_items = response.json()
                        data_list = [
                            {
                                "key": key,
                                "value": value,
                                "hash": hashing.hash(key)
                            }
                            for key, value in data_items.items()
                        ]
                        server_data.append({
                            "name": name,
                            "hash": hashing.hash(name),
                            "data": data_list,
                            "port": info['port'],
                            "status": info['status'],
                            "lastHb": info['lastHb']
                        })
                except requests.exceptions.RequestException:
                    continue

        return jsonify(server_data)

@app.route('/status', methods=['POST'])
def status():

    data = request.json

    if 'server' not in data or 'status' not in data:
        return jsonify({ 'error': True, 'message': 'Please provide "server" and "status"'} ), 400

    server_name = data['server']
    status = data['status']

    if status != 'activate' and status != 'deactivate':
        return jsonify({ 'error': True, 'message': '"status" must be "activate" or "deactivate"'} ), 400
    
    with lock:
        if server_name in server_list:
            server_info = server_list[server_name]
            hashing.remove_node(server_name)
            if server_info:
                try:
                    url = f"http://localhost:{server_info['port']}/status"
                    response = requests.post(url, json={'status': status})
                    if status == 'activate':
                        return jsonify({'success': True, 'message': 'Status updated'})
                    
                    data = response.json()
                    for key, value in data.items():
                        add_data(key, value)
                    return jsonify({'success': True, 'message': 'Status updated and data redistributed'})
                except requests.exceptions.RequestException as e:
                    return jsonify({'error': True, 'message': f'Failed to update status: {e}'}), 500
                
        return jsonify({'error': True, 'message': 'Server not found'}), 404


if __name__ == '__main__':
    CORS(app)
    app.run(debug=True, port=4000, use_reloader=False)