import requests
import json
import time

# Configuration
DID_API_KEY = "ZWxlZWJpejAwMUBnbWFpbC5jb20:4Q7Bv59zWFTJOralzKnIj"
IMAGE_PATH = "canvas/annie_face.jpg"

def upload_image():
    url = "https://api.d-id.com/images"
    headers = {
        "accept": "application/json",
        "authorization": f"Basic {DID_API_KEY}"
    }
    files = { "image": ("image.jpg", open(IMAGE_PATH, "rb"), "image/jpeg") }
    
    try:
        print("📤 Uploading image to D-ID...")
        response = requests.post(url, files=files, headers=headers)
        if response.status_code == 201:
            data = response.json()
            print(f"[D-ID] Image Uploaded: {data['url']}")
            return data['url']
        else:
            print(f"[D-ID] Upload Error: {response.text}")
            return None
    except Exception as e:
        print(f"[D-ID] Upload Exception: {e}")
        return None

def create_talk(image_url):
    url = "https://api.d-id.com/talks"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Basic {DID_API_KEY}"
    }
    payload = {
        "script": {
            "type": "text",
            "subtitles": "false",
            "provider": {
                "type": "microsoft",
                "voice_id": "en-US-JennyNeural"
            },
            "ssml": "false",
            "input": "Hello! I am Annie. Nice to meet you!"
        },
        "config": {
            "fluent": "false",
            "pad_audio": "0.0"
        },
        "source_url": image_url
    }
    
    try:
        print("🎬 Creating Talk Job...")
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 201:
            data = response.json()
            print(f"[D-ID] Job Created: {data['id']}")
            return data['id']
        else:
            print(f"[D-ID] Error: {response.text}")
            return None
    except Exception as e:
        print(f"[D-ID] Exception: {e}")
        return None

def get_talk(id):
    url = f"https://api.d-id.com/talks/{id}"
    headers = {
        "accept": "application/json",
        "authorization": f"Basic {DID_API_KEY}"
    }
    
    for i in range(20):
        response = requests.get(url, headers=headers)
        data = response.json()
        status = data.get('status')
        print(f"[D-ID] Status: {status}...")
        
        if status == "done":
            return data.get('result_url')
        elif status == "error":
            print("[D-ID] Failed.")
            return None
            
        time.sleep(2)
    return None

if __name__ == "__main__":
    s3_url = upload_image()
    if s3_url:
        job_id = create_talk(s3_url)
        if job_id:
            video_url = get_talk(job_id)
            if video_url:
                print(f"\n✅ Video Ready: {video_url}")
                with open("annie_video_url.txt", "w") as f:
                    f.write(video_url)
            else:
                print("❌ Timeout or Error waiting for video.")
