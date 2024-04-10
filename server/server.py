from flask import Flask, request, jsonify
import argparse
import threading
import requests
import time

app = Flask(__name__)
data_store = {}
thread = None
heartbeat_active = True

@app.route('/')
def main():
    return 'Hello, World!'

@app.route('/data', methods=['GET','POST', 'DELETE'])
def data():
    if request.method == 'POST':
        data = request.json
        if 'key' in data and 'value' in data:
            key = data['key']
            value = data['value']
            data_store[key] = value
            print(f"Adding {key}, {value}")
            return jsonify({'message': f'Data added successfully. Key: {key}, Value: {value}'}), 200
        else:
            return jsonify({'message': 'Invalid JSON format. Please provide "key" and "value".'}), 400
    elif request.method == 'DELETE':
        data = request.json
        for key in data:
            print(f"Deleting {key}")
            data_store.pop(key, None)
        return jsonify(data_store)
    else:
        data = request.json
        return jsonify(data_store)

@app.route('/status', methods=['POST'])
def update_status():
    global heartbeat_active
    global data_store
    
    data = request.json

    if 'status' not in data:
        return jsonify({'error': True, 'message': 'Please provide "status"'}), 400

    status_check = data['status']

    if status_check == 'activate':
        heartbeat_active = True
        return jsonify(data_store)

    if status_check == 'deactivate':
        temp_dict = data_store.copy()
        data_store.clear()
        heartbeat_active = False
        return jsonify(temp_dict)          

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('PORT', type=str, help="The port to use for the sever")
    args = parser.parse_args()
    return args

def heartbeat(PORT):
    while True:
        status = "active" if heartbeat_active else "inactive"
        data = {"name": f"server.{PORT}", "status": status, "port": PORT}
        try:
            response = requests.post('http://localhost:4000/heartbeat', json=data)
        except Exception as e:
            pass
        time.sleep(1)        

if __name__ == '__main__':
    args = parse_args()

    thread = threading.Thread(target= heartbeat, args=[args.PORT])
    thread.daemon = True
    thread.start()

    app.run(debug=True, port=args.PORT, use_reloader=False)