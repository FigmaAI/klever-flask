import openai
import os
import json

from transformers import GPT2Tokenizer

# Load the key file
with open("key.json", "r") as f:
    keys = json.load(f)

# Extract the OpenAI API key
openai.api_key = keys["openai_api_key"]


def inform_design_system(data_extracted):
    # return  # This line will exit the function immediately
    print("Starting to process the data...")
    # ... the rest of your code ...
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    chunks = []
    chunk = []
    tokens = 0
    for node in data_extracted:
        node_str = json.dumps(node)
        node_tokens = len(tokenizer.encode(node_str))
        if tokens + node_tokens > 4097:
            chunks.append(chunk)
            chunk = [node]
            tokens = node_tokens
        else:
            chunk.append(node)
            tokens += node_tokens
    if chunk:
        chunks.append(chunk)
    print("Data processing completed. Starting to generate responses...")
    for chunk in chunks:
        data_str = json.dumps(chunk)
        system = "I have a list of UI components from the design system. I will use this information to match objects from the RICO dataset to the most similar UI component."
        user = f"The list of UI components is: {data_str}"
        call_chat_gpt(system, user)
    print("Response generation completed.")

def generate_response(object_str, data_extracted):
    system = "Now I have an object from the RICO dataset. I need to find the most similar UI component from the design system and assign its ID, name, and path to the object. If no similar UI component exists, assign 'null' to the object."
    user = f"The object from the RICO dataset is: {object_str}"
    result = call_chat_gpt(system, user)

    # Find the most similar UI component in data_extracted
    most_similar_component = None
    for component in data_extracted:
        if component["name"] in result:
            most_similar_component = component
            break

    # If a similar component is found, return its id and path
    if most_similar_component is not None:
        return {"id": most_similar_component["id"], "path": most_similar_component["path"]}
    else:
        return {"id": None, "path": None}

def call_chat_gpt(system, user):
    print("Starting to call GPT...")
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    system_tokens = tokenizer.encode(system, truncation=True, max_length=4097)
    user_tokens = tokenizer.encode(user, truncation=True, max_length=4097-len(system_tokens))
    if len(system_tokens) + len(user_tokens) > 4097:
        total_tokens = len(system_tokens) + len(user_tokens)
        user_tokens = user_tokens[:4097 - len(system_tokens)]
        user = tokenizer.decode(user_tokens)
        print(f"Warning: The input was too long and had to be cut off. The total token length was {total_tokens}, but it was reduced to {len(system_tokens) + len(user_tokens)}.")
    response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ]
    )
    print("GPT call completed.")
    return response['choices'][0]['message']['content']
