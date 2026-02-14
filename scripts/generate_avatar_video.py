import os
import time
import requests
import sys

# Constants
API_KEY = "sk_V2_hgu_kgKEafZmhFN_y63leMkKb5lCIiEKST4r6xG1LNAXWS54"
IMAGE_PATH = "/Users/ieunchul/clawd/ron_face.jpg"
AUDIO_PATH = "/Users/ieunchul/clawd/ron_voice.mp3"
OUTPUT_PATH = "/Users/ieunchul/clawd/ron_alive.mp4"

HEADERS = {
    "X-Api-Key": API_KEY
}

def upload_asset(file_path, media_type, content_type):
    """Uploads an asset to HeyGen and returns the Asset ID."""
    print(f"Uploading {media_type}: {file_path}...")
    
    # Use specific endpoint for Talking Photo (Image) vs regular Asset (Audio)
    if media_type == "Image":
        url = "https://upload.heygen.com/v1/talking_photo"
    else:
        url = "https://upload.heygen.com/v1/asset"
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    headers = HEADERS.copy()
    headers["Content-Type"] = content_type

    with open(file_path, "rb") as f:
        # Using data=f streams the file content as the body (raw binary)
        response = requests.post(url, headers=headers, data=f)
    
    if response.status_code != 200:
        raise Exception(f"Upload failed: {response.text}")
    
    data = response.json()
    if "data" not in data:
        raise Exception(f"Invalid upload response: {data}")
    
    # Handle different response structures
    if media_type == "Image" and "talking_photo_id" in data["data"]:
        asset_id = data["data"]["talking_photo_id"]
    elif "id" in data["data"]:
        asset_id = data["data"]["id"]
    else:
        raise Exception(f"Could not find ID in response: {data}")
    
    print(f"Uploaded {media_type} ID: {asset_id}")
    return asset_id

def generate_video(image_id, audio_id):
    """Generates a Talking Photo video."""
    print("Requesting video generation...")
    url = "https://api.heygen.com/v2/video/generate"
    
    # Check if we should use 'talking_photo_id' or just pass the image ID
    # Based on docs, talking_photo_id is usually the asset ID for simple photos.
    
    payload = {
        "video_inputs": [
            {
                "character": {
                    "type": "talking_photo",
                    "talking_photo_id": image_id
                },
                "voice": {
                    "type": "audio",
                    "audio_asset_id": audio_id
                },
                "background": {
                    "type": "color",
                    "value": "#000000"
                }
            }
        ],
        "dimension": {
            "width": 1280,
            "height": 720
        },
        "test": False
    }
    
    response = requests.post(url, headers=HEADERS, json=payload)
    
    if response.status_code != 200:
        raise Exception(f"Generation request failed: {response.text}")
    
    data = response.json()
    if "data" not in data or "video_id" not in data["data"]:
        raise Exception(f"Invalid generation response: {data}")
        
    video_id = data["data"]["video_id"]
    print(f"Video Generation initiated. Job ID: {video_id}")
    return video_id

def check_status(video_id):
    """Polls for video status until completion."""
    url = f"https://api.heygen.com/v1/video_status.get?video_id={video_id}"
    print(f"Checking status for {video_id}...")
    
    while True:
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            print(f"Status check failed: {response.text}")
            time.sleep(5)
            continue
            
        data = response.json()
        status = data.get("data", {}).get("status")
        
        if status == "completed":
            video_url = data["data"]["video_url"]
            print("Video generation completed!")
            return video_url
        elif status == "failed":
            error = data.get("data", {}).get("error")
            raise Exception(f"Video generation failed: {error}")
        elif status in ["pending", "processing", "waiting"]:
            print(f"Status: {status}. Waiting 10s...")
            time.sleep(10)
        else:
            print(f"Unknown status: {status}. Waiting 10s...")
            time.sleep(10)

def download_video(url, output_path):
    """Downloads the video to the specified path."""
    print(f"Downloading video from {url} to {output_path}...")
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Download finished: {output_path}")
    else:
        raise Exception(f"Download failed: {response.status_code}")

def main():
    try:
        # Step 1: Upload Image (JPEG)
        image_id = upload_asset(IMAGE_PATH, "Image", "image/jpeg")
        
        # Step 2: Upload Audio (MP3)
        audio_id = upload_asset(AUDIO_PATH, "Audio", "audio/mpeg")
        
        # Step 3: Generate Video
        video_id = generate_video(image_id, audio_id)
        
        # Step 4: Check Status
        video_url = check_status(video_id)
        
        # Step 5: Download
        download_video(video_url, OUTPUT_PATH)
        
        print(f"SUCCESS: Digital Human Video Generated at {OUTPUT_PATH}")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
