import requests
import base64

# Path to the image
image_path = "/Users/praveenkumar/Downloads/Dashboard.png"

# Read and encode image in base64
with open(image_path, "rb") as f:
    image_base64 = base64.b64encode(f.read()).decode("utf-8")

# Define the prompt (your "system prompt")
prompt = "Give UI enhancement suggestions for this design."

# Payload for Ollama API
payload = {
    "model": "moondream",
    "prompt": prompt,
    "images": [image_base64]
}

print(payload)


# Send to Ollama API
response = requests.post("http://localhost:11434/api/generate", json=payload)

# Check response
if response.status_code == 200:
    print("✅ Suggestions:")
    print(response.json()["message"]["content"])
else:
    print(f"❌ Error: {response.status_code}")
    print(response.text)
