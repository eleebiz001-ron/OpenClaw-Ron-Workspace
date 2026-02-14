import requests
import json
import time
import sys
import os

# Configuration
DID_API_KEY = "ZWxlZWJpejAwMUBnbWFpbC5jb20:4Q7Bv59zWFTJOralzKnIj"
# Voice Mapping (Free/Standard D-ID Voices or linked ElevenLabs)
# Using Microsoft Voices as fallback for D-ID Free Tier stability, or standard D-ID
VOICE_MAPPING = {
    "male": "en-US-GuyNeural", # Standard Male
    "female": "en-US-JennyNeural" # Standard Female
}

def upload_image(image_path):
    url = "https://api.d-id.com/images"
    headers = {
        "accept": "application/json",
        "authorization": f"Basic {DID_API_KEY}"
    }
    try:
        print(f"📤 Uploading {image_path}...")
        files = { "image": (os.path.basename(image_path), open(image_path, "rb"), "image/png") }
        response = requests.post(url, files=files, headers=headers)
        if response.status_code == 201:
            data = response.json()
            return data['url']
        else:
            print(f"❌ Upload Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Upload Exception: {e}")
        return None

def create_talk(image_url, text, gender):
    url = "https://api.d-id.com/talks"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Basic {DID_API_KEY}"
    }
    voice_id = VOICE_MAPPING.get(gender, "en-US-GuyNeural")
    
    payload = {
        "script": {
            "type": "text",
            "subtitles": "false",
            "provider": {
                "type": "microsoft",
                "voice_id": voice_id
            },
            "ssml": "false",
            "input": text
        },
        "config": {
            "fluent": "false",
            "pad_audio": "0.0"
        },
        "source_url": image_url
    }
    
    try:
        print(f"🎬 Creating Talk ({gender})...")
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 201:
            data = response.json()
            return data['id']
        else:
            print(f"❌ Create Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Create Exception: {e}")
        return None

def get_talk(id):
    url = f"https://api.d-id.com/talks/{id}"
    headers = {
        "accept": "application/json",
        "authorization": f"Basic {DID_API_KEY}"
    }
    
    for i in range(30): # Poll for 60 seconds
        response = requests.get(url, headers=headers)
        data = response.json()
        status = data.get('status')
        print(f"⏳ Status: {status}...")
        
        if status == "done":
            return data.get('result_url')
        elif status == "error":
            print(f"❌ Error: {data}")
            return None
            
        time.sleep(2)
    return None

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 generate_did.py <image_path> <gender> <text>")
        sys.exit(1)
        
    image_path = sys.argv[1]
    gender = sys.argv[2]
    text = sys.argv[3]
    
    s3_url = upload_image(image_path)
    if s3_url:
        job_id = create_talk(s3_url, text, gender)
        if job_id:
            video_url = get_talk(job_id)
            if video_url:
                print(f"\n✅ Video Ready: {video_url}")
            else:
                print("❌ Failed to get video URL.")
