import requests
import json

DID_API_KEY = "ZWxlZWJpejAwMUBnbWFpbC5jb20:4Q7Bv59zWFTJOralzKnIj"
IMAGE_URL = "https://d-id-images-prod.s3.us-west-2.amazonaws.com/google-oauth2|114544306754474723068/img_OQcqZQ3VMWSXE690Vgf8r/ron.png" 
# Note: I am using the S3 URL that was logged in the user's previous screenshot if possible, 
# or I will use the Wikimedia one to test the API structure itself. 
# Actually, the user's log showed: s3://d-id-images-prod/.../ron.png 
# I cannot use s3:// directly usually unless authorized. 
# I will use the Original Image URL (or the uploaded one if I can get it).
# I will use the manually uploaded "canvas/Ron_face.png" concept, but here I need a URL.
# I will use the YNA one or Wikimedia one just to test the SESSION ID structure.
TEST_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Park_Bo-gum_at_Love_in_the_Moonlight_fansign_event_in_October_2016_02.jpg/800px-Park_Bo-gum_at_Love_in_the_Moonlight_fansign_event_in_October_2016_02.jpg"

def debug_stream():
    url = "https://api.d-id.com/talks/streams"
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Basic {DID_API_KEY}"
    }
    payload = {
        "source_url": TEST_URL
    }
    
    print(f"Sending Request to {url}...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Status: {response.status_code}")
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_stream()
