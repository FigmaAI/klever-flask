import sys
import os
sys.path.insert(0, os.path.abspath('./scripts'))

import subprocess
import random
import json
import glob
from flask import Flask, request, jsonify, send_from_directory
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

def process_object(obj, data_extracted):
    if isinstance(obj, dict):
        if 'componentLabel' in obj:
            object_str = json.dumps(obj)
            matched_item = generate_response(object_str, data_extracted)
            if isinstance(matched_item, str):
                matched_item = json.loads(matched_item)
            obj.update(matched_item)
        for key in obj:
            process_object(obj[key], data_extracted)
    elif isinstance(obj, list):
        for item in obj:
            process_object(item, data_extracted)

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

    selected_files = random.sample(all_files, 2)

    new_directory = './figma'
    if not os.path.exists(new_directory):
        os.makedirs(new_directory)

    for file_path in selected_files:
        with open(file_path, 'r') as f:
            data = json.load(f)
            process_object(data, data_extracted)

        new_file_path = os.path.join(new_directory, os.path.basename(file_path))
        with open(new_file_path, 'w') as f:
            json.dump(data, f)

    return jsonify(status=200, message="All objects in the selected RICO dataset files have been processed and updated"), 200


@app.route('/api/getFigmaFile', methods=['POST'])
def get_figma_file():
    index = request.json.get('index')
    figma_files = sorted(glob.glob('./figma/*.json'))

    if index < len(figma_files):
        print(f"Sending file {index + 1} of {len(figma_files)}")  # Print the current file number
        data = json.load(open(figma_files[index]))
        return jsonify(end=False, data=data), 200
    else:
        print("All Figma files have been processed")  # Print the completion message
        return jsonify(end=True, message="All Figma files have been processed"), 200

if __name__ == '__main__':
    app.run(debug=True)