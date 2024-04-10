from flask import Flask, request, jsonify
import argparse
import threading
import requests
import time

app = Flask(__name__)
data_store = {}

@app.route('/')
def main():
    return 'Hello, World!'

@app.route('/data', methods=['GET','POST'])
def data():
    if request.method == 'POST':
        data = request.json
        if 'key' in data and 'value' in data:
            key = data['key']
            value = data['value']
            data_store[key] = value
            print (data_store)
            return jsonify({'message': f'Data added successfully. Key: {key}, Value: {value}'}), 200
        else:
            return jsonify({'message': 'Invalid JSON format. Please provide "key" and "value".'}), 400
    else:
        data = request.json
        return data_store

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('PORT', type=str, help="The port to use for the sever")
    args = parser.parse_args()

    return args

def heartbeat(PORT):
    while True:
        data = {"name": "server.{PORT}", "status": "active", "port": PORT}
        try:
            response = requests.post('http://localhost:4000/heartbeat', json=data)
            #print("Data posted successfully")
        except Exception as e:
            #print(f"Error posting data: {e}")
            pass
        time.sleep(1)        

if __name__ == '__main__':
    args = parse_args()

    thread = threading.Thread(target= heartbeat, args=[args.PORT])
    thread.daemon = True
    thread.start()

    app.run(debug=True, port=args.PORT)


