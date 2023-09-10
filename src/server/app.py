import sys
import os
sys.path.insert(0, os.path.abspath('./scripts'))

import subprocess
import random
import json
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
from download_and_process_dataset import process_dataset
from chatgpt_model import generate_response, inform_design_system

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask application

dir_path = os.path.dirname(os.path.realpath(__file__))  # Get the directory of app.py

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/get', methods=['GET'])
def get_data():
    return {"data": "This is some data"}

@app.route('/api/post', methods=['POST'])
def post_data():
    data = request.get_json()  # Get the JSON body of the request

    # Save the data as a JSON file
    data_path = os.path.join(dir_path, 'data.json')  # Get the absolute path of data.json
    with open(data_path, 'w') as f:
        json.dump(data, f)

    return {"status": 200, "message": "Data received and printed"}, 200

@app.route('/api/rico', methods=['POST'])
def update_rico():
    labels = process_dataset()

    if labels is None:
        return jsonify(error='The semantic_annotations folder does not exist. Please download the RICO dataset', link='http://www.interactionmining.org/rico.html'), 404

    # Run the script
    subprocess.run(['python', 'download_and_process_dataset.py'])

    # Save the labels as a JSON file
    labels_path = os.path.join(dir_path, 'labels.json')  # Get the absolute path of labels.json
    with open(labels_path, 'w') as f:
        json.dump(labels, f)

    return jsonify(status=200, message="Script executed and labels.json file created"), 200

@app.route('/api/generateMappingTable', methods=['POST'])
def generate_mapping_table():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    data_path = os.path.join(dir_path, 'data.json')
    
    if not os.path.exists(data_path):
        return jsonify(error='data.json does not exist'), 404

    with open(data_path, 'r') as f:
        data = json.load(f)

    data_extracted = [node for node in data["nodes"]]
    inform_design_system(data_extracted)

    directory = './datasets'
    all_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                all_files.append(file_path)

    selected_files = random.sample(all_files, 5)

    for file_path in selected_files:
        with open(file_path, 'r') as f:
            data = json.load(f)
            for object in data:
                object_str = json.dumps(object)
                result = generate_response(object_str)
                print(f"Result: {result}")
                matched_item = json.loads(result)
                object.update(matched_item)

        with open(file_path, 'w') as f:
            json.dump(data, f)

    return jsonify(status=200, message="All objects in the selected RICO dataset files have been processed and updated"), 200


if __name__ == '__main__':
    app.run(debug=True)