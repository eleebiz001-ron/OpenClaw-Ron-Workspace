import os
import sys
import json
import urllib.request
import urllib.error

def summarize_file(filepath):
    api_key = os.environ.get("NIM_API_KEY")
    if not api_key:
        print("Error: NIM_API_KEY environment variable not set.")
        sys.exit(1)

    if not os.path.exists(filepath):
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    system_prompt = (
        "You are a helpful assistant that summarizes daily work logs into concise long-term memories. "
        "Focus on decisions, technical learnings, completed tasks, and personal notes about Eun and Sophia. "
        "Output in Korean (or the language of the notes)."
    )

    data = {
        "model": "moonshotai/kimi-k2.5",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Summarize this log:\n\n{content}"}
        ],
        "temperature": 0.5,
        "max_tokens": 1024
    }

    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(result['choices'][0]['message']['content'])
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 summarize_memory.py <filepath>")
        sys.exit(1)
    
    summarize_file(sys.argv[1])
