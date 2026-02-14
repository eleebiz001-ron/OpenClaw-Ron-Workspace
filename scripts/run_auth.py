import os

# Configuration
email = "eleebiz001@gmail.com"

print(f"🚀 Starting authentication for {email}...")
print("A browser window will open shortly. Please log in and allow access.")
print("----------------------------------------------------------------")

# Execute auth command
exit_code = os.system(f"gog auth add {email}")

if exit_code == 0:
    print("\n✅ Authentication successful!")
    print("Listing calendars to verify...")
    os.system("gog cal list")
else:
    print("\n❌ Authentication failed.")
