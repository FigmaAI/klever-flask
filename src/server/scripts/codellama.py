import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

def generate_response(system, user):
    # Load the key file
    with open("key.json", "r") as f:
        keys = json.load(f)

    # Extract the Hugging Face API key
    huggingface_token = keys["huggingface_token"]

    model_id = "codellama/CodeLlama-7b-hf"
    tokenizer = AutoTokenizer.from_pretrained(model_id)

    # Load the model directly to the device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = AutoModelForCausalLM.from_pretrained(model_id).to(device)

    # Generate the chat prompt
    prompt = f"<s><<SYS>>\n{system}\n<</SYS>>\n\n{user}"

    # Generate the response using the Code Llama model
    inputs = tokenizer(prompt, return_tensors='pt', add_special_tokens=False).to(device)
    sequences = model.generate(
        inputs['input_ids'],
        do_sample=True,
        top_k=10,
        temperature=0.1,
        top_p=0.95,
        num_return_sequences=1,
        eos_token_id=tokenizer.eos_token_id,
        max_length=200
    )

    # Extract the generated text from the response
    result = tokenizer.decode(sequences[0], skip_special_tokens=True).strip()

    return result

if __name__ == "__main__":
    # Test the generate_response function with a sample system and user prompt
    system = "Provide answers in Python"
    user = "Write a function that detects a pattern that matches the style of 23-Jan-2023 from the given text"
    response = generate_response(system, user)
    print(f"Generated response: {response}")