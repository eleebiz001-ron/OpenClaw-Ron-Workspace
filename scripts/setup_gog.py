import os
import sys
import subprocess
import json
import tempfile

def run_command(cmd):
    try:
        result = subprocess.run(cmd, shell=True, check=True, text=True, capture_output=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {cmd}")
        print(e.stderr)
        return None

def main():
    print("🚀 gogcli Setup Assistant")
    print("-------------------------")

    # 1. Check Installation
    if not run_command("which gog"):
        print("❌ 'gog' not found. Installing via Homebrew...")
        run_command("brew install steipete/tap/gogcli")
    else:
        print("✅ 'gog' is installed.")

    # 2. Credential Setup
    print("\n🔑 OAuth Credentials Setup")
    print("To access Google Calendar/Gmail, we need a 'client_secret.json'.")
    print("1. Go to: https://console.cloud.google.com/apis/credentials")
    print("2. Create Credentials -> OAuth Client ID -> Desktop App")
    print("3. Download the JSON file.")
    
    print("\n❓ Do you have the JSON content ready to paste? (y/n)")
    choice = input("> ").lower()

    if choice.startswith('y'):
        print("📋 Paste the JSON content below, then press Ctrl+D (EOF):")
        lines = sys.stdin.readlines()
        json_content = "".join(lines)
        
        try:
            # Validate JSON
            json.loads(json_content)
            
            # Write to temp file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as tmp:
                tmp.write(json_content)
                tmp_path = tmp.name
            
            print(f"\nSaved temp credentials to: {tmp_path}")
            
            # Register with gog
            print("Running: gog auth credentials set ...")
            run_command(f"gog auth credentials set '{tmp_path}'")
            
            # Cleanup
            os.remove(tmp_path)
            print("✅ Credentials registered successfully!")
            
        except json.JSONDecodeError:
            print("❌ Invalid JSON pasted. Aborting.")
            return
    else:
        print("Please obtain the client_secret.json first.")
        return

    # 3. Account Authorization
    email = "eleesvt@gmail.com"
    print(f"\n🔗 Authorizing account: {email}")
    print("A browser window should open (or a link will appear). Log in and approve.")
    
    # Run interactive auth add
    os.system(f"gog auth add {email}")

    # 4. Verification
    print("\n🔍 Verifying access (Listing Calendars)...")
    os.system("gog cal list")

if __name__ == "__main__":
    main()
