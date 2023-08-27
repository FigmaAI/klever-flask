import openai
import os
import json

# Load the key file
with open("key.json", "r") as f:
    keys = json.load(f)

# Extract the OpenAI API key
openai.api_key = keys["openai_api_key"]

def generate_response(system, user):
    print ("Generating GPT response...")
    # Generate the chat prompt
    prompt = f"{system}\n{user}"

    try:
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
    except Exception as e:
        print(f"Error in generate_response: {str(e)}")  # Log the error
        raise  # Re-raise the exception


if __name__ == "__main__":
    # Test the generate_response function with a sample system and user prompt
    system = "Provide answers in TypeScript"
    user = "Write a function that detects a pattern that matches the style of 23-Jan-2023 from the given text"
    response = generate_response(system, user)
    print(f"Generated response: {response}")