import os
import sys
import json
import urllib.request

API_KEY = os.environ.get("NIM_API_KEY")
if not API_KEY:
    print("Error: NIM_API_KEY not set.")
    sys.exit(1)

def ask_kimi(prompt, system_prompt="You are a skilled Python developer."):
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    data = {
        "model": "moonshotai/kimi-k2.5",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 4096
    }
    
    req = urllib.request.Request(url, json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 dev_agent.py <task_description>")
        sys.exit(1)
        
    task = sys.argv[1]
    print(f"🤖 Kimi Dev Agent working on: {task}...")
    
    prompt = f"""
    Task: {task}
    
    Please write the necessary code to accomplish this. 
    If multiple files are needed, separate them with '### FILE: filename'.
    Provide ONLY the code blocks.
    """
    
    response = ask_kimi(prompt)
    print(response)
