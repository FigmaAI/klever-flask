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
CORS(app)

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
    # Check if 'data.json' and 'labels.json' exist
    data_path = os.path.join(dir_path, 'data.json')  # Get the absolute path of data.json
    labels_path = os.path.join(dir_path, 'labels.json')  # Get the absolute path of labels.json
    if not os.path.exists(data_path) or not os.path.exists(labels_path):
        return jsonify(error='data.json or labels.json does not exist'), 404

    # Load 'data' and 'labels' from the JSON files
    with open(data_path, 'r') as f:
        data = json.load(f)
    with open(labels_path, 'r') as f:
        labels = json.load(f)

    # Convert 'data' and 'labels' to strings
    data_str = json.dumps(data)
    labels_str = json.dumps(labels)

    # Generate the system and user prompts
    system = "I have a list of UI components and a list of labels from the RICO dataset. " \
             "For each component in the list, I need to find the most similar label from the RICO dataset and assign it to the component."
    user = f"The list of UI components is: {data_str}\nThe list of labels from the RICO dataset is: {labels_str}"

    try:
        # Compare the 'data' and 'labels' and generate a mapping table
        result = generate_response(system, user)
        print(f"Result: {result}")  # Log the result

        # Convert the result back to a dictionary
        mapping_table = json.loads(result)

        return jsonify(mapping_table)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)