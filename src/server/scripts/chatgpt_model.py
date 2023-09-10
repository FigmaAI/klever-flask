import openai
import os
import json

# Load the key file
with open("key.json", "r") as f:
    keys = json.load(f)

# Extract the OpenAI API key
openai.api_key = keys["openai_api_key"]

def inform_design_system(data_extracted):
    # Split 'data_extracted' into chunks of 50 items each
    chunks = [data_extracted[i:i + 20] for i in range(0, len(data_extracted), 50)]
    
    for chunk in chunks:
        data_str = json.dumps(chunk)
        system = "I have a list of UI components from the design system. I will use this information to match objects from the RICO dataset to the most similar UI component."
        user = f"The list of UI components is: {data_str}"
        call_chat_gpt(system, user)

def generate_response(object_str):
    system = "Now I have an object from the RICO dataset. I need to find the most similar UI component from the design system and assign its ID, name, and path to the object. If no similar UI component exists, assign 'null' to the object."
    user = f"The object from the RICO dataset is: {object_str}"
    return call_chat_gpt(system, user)

def call_chat_gpt(system, user):
    print ("Generating GPT response...")
    # Generate the chat prompt
    prompt = f"{system}\n{user}"

    try:
        # Generate the response using the ChatGPT model
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            temperature=0.7,
            max_tokens=100
        )

        # Extract the generated text from the response
        result = response.choices[0].text.strip()
        return result
    except Exception as e:
        print(f"Error in generate_response: {str(e)}")  # Log the error
        raise  # Re-raise the exception