import requests
import json
import sys
import base64

API_KEY = "AIzaSyBTEqhDLSwRR5rMQBznWOArWCQfRWdNwFY"
# Using Imagen 3 as fallback/base if Nano Banana schema differs, but trying Nano name first.
# Standard Imagen endpoint structure.
MODEL_NAME = "models/imagen-3.0-generate-001" 

def generate_image(prompt, output_file):
    url = f"https://generativelanguage.googleapis.com/v1beta/{MODEL_NAME}:predict?key={API_KEY}"
    headers = {
        "Content-Type": "application/json"
    }
    # Imagen 3/Vertex AI structure usually:
    # instances: [{prompt: ...}]
    # But Gemini GenerateImage might use different payload. 
    # Let's try standard Vertex Prediction format which fits the URL structure.
    data = {
        "instances": [
            { "prompt": prompt }
        ],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "1:1"
        }
    }
    
    try:
        print(f"🎨 Generating: {output_file} using {MODEL_NAME}...")
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            # Check for standard prediction response
            if 'predictions' in result:
                # Vertex AI Imagen returns bytesBase64Encoded
                b64_data = result['predictions'][0].get('bytesBase64Encoded')
                if b64_data:
                    with open(output_file, "wb") as f:
                        f.write(base64.b64decode(b64_data))
                    print(f"✅ Saved to {output_file}")
                else:
                    print(f"❌ Error: No image data in predictions. {result}")
            else:
                print(f"❌ Error: Unexpected response format. {result}")
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    # Prompts
    ron_prompt = "A cute and handsome young Korean businessman in his 20s, wearing a neat navy blue suit, warm and trustworthy smile, dandy hairstyle, soft lighting, 3D character style (Unreal Engine 5 quality), friendly eyes, resembling a younger Park Bo-gum vibe but distinct, high quality, 8k portrait."
    annie_prompt = "A cute and beautiful young Korean businesswoman in her 20s, smart casual blazer, bright energetic smile, lovely expression, bob cut hairstyle, vibrant lighting, 3D character style (Unreal Engine 5 quality), resembling a cute Kim Ji-won vibe, high quality, 8k portrait."
    
    generate_image(ron_prompt, "canvas/ron_generated.png")
    generate_image(annie_prompt, "canvas/annie_generated.png")
