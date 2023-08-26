import sys
import os
sys.path.insert(0, os.path.abspath('./scripts'))

import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
from download_and_process_dataset import process_dataset
from chatgpt_model import generate_response  # Import the generate_response function


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow CORS for all routes and origins


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
    with open('data.json', 'w') as f:
        json.dump(data, f)

    return {"status": 200, "message": "Data received and printed"}, 200

@app.route('/api/rico', methods=['POST'])
def update_rico():
    labels = process_dataset()

    if labels is None:
        return jsonify(error='The semantic_annotations folder does not exist. Please download the RICO dataset', link='http://www.interactionmining.org/rico.html'), 404

    # Run the script
    subprocess.run(['python', './scripts/download_and_process_dataset.py'])

    # Save the labels as a JSON file
    with open('labels.json', 'w') as f:
        json.dump(labels, f)

    return jsonify(status=200, message="Script executed and labels.json file created"), 200

@app.route('/api/generateMappingTable', methods=['POST'])
def generate_mapping_table():
    # Check if 'data.json' and 'labels.json' exist
    if not os.path.exists('data.json') or not os.path.exists('labels.json'):
        return jsonify(error='data.json or labels.json does not exist'), 404

    # Load 'data' and 'labels' from the JSON files
    with open('data.json', 'r') as f:
        data = json.load(f)
    with open('labels.json', 'r') as f:
        labels = json.load(f)

    # Convert 'data' and 'labels' to strings
    data_str = json.dumps(data)
    labels_str = json.dumps(labels)

    # Generate the system and user prompts
    system = "Please check the list of labels and assign a similar componentLabel from RICO for each item in the data."
    user = f"The data is as follows: {data_str}\nThe labels are as follows: {labels_str}"

    # Compare the 'data' and 'labels' and generate a mapping table
    result = generate_response(system, user)

    # Convert the result back to a dictionary
    mapping_table = json.loads(result)

    return jsonify(mapping_table)

if __name__ == '__main__':
    app.run(debug=True)