import openai
import os
import json

# Load the key file
with open("key.json", "r") as f:
    keys = json.load(f)

# Extract the OpenAI API key
openai.api_key = keys["openai_api_key"]

def generate_response(system, user):
    # Generate the chat prompt
    prompt = f"{system}\n{user}"

    # Generate the response using the ChatGPT model
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        temperature=0.5,
        max_tokens=100
    )

    # Extract the generated text from the response
    result = response.choices[0].text.strip()

    return result