import os
import json

def find_component_labels(data, labels):
    if 'componentLabel' in data:
        labels.add(data['componentLabel'])
    for child in data.get('children', []):
        find_component_labels(child, labels)

def process_dataset():
    # Specify the directory where the JSON files are located
    directory = './datasets'

    # Check if the semantic_annotations folder exists
    if not os.path.exists(os.path.join(directory, 'semantic_annotations')):
        return None

    # Create a set to store the unique componentLabel values
    labels = set()

    # Walk through the directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            # If the file is a JSON file
            if file.endswith('.json'):
                # Construct the full file path
                file_path = os.path.join(root, file)
                # Open the JSON file
                with open(file_path, 'r') as f:
                    # Load the JSON data
                    data = json.load(f)
                    # Find and store the unique componentLabel values
                    find_component_labels(data, labels)

    # Save the labels as a JSON file
    with open('labels.json', 'w') as f:
        json.dump(list(labels), f)

    return list(labels)

# Call the function to process the dataset
process_dataset()