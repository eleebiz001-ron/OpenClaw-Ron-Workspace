import os
import sys
import json
import urllib.request

API_KEY = "e86ca84ed70c71ba7470d8723a1c6c59ffe29cd0367ef349b071c1e4214e2e18"
VOICE_ID_MALE = "nPczCjzI2devNBz1zQrb" # Brian - Deep, Resonant (Fallback)
VOICE_ID_FEMALE = "cgSgspJ2msm6clMCkdW9" # Jessica - Playful, Cute (Fallback)

def speak(text, output_file, gender="male"):
    voice_id = VOICE_ID_FEMALE if gender == "female" else VOICE_ID_MALE
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            with open(output_file, 'wb') as f:
                f.write(response.read())
        print(f"MEDIA:{output_file}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 elevenlabs_speak.py <text> [gender]")
        sys.exit(1)
    
    text = sys.argv[1]
    gender = sys.argv[2] if len(sys.argv) > 2 else "male"
    output_path = f"/tmp/ron_voice_{gender}_{os.getpid()}.mp3"
    speak(text, output_path, gender)
