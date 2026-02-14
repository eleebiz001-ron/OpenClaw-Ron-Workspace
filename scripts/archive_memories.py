import os
import shutil
import datetime
import re

MEMORY_DIR = 'memory'
ARCHIVE_DIR = 'memory/archives'

def archive_memories():
    today = datetime.date.today()
    
    if not os.path.exists(MEMORY_DIR):
        print(f"Memory directory {MEMORY_DIR} not found.")
        return

    print(f"Checking memories in {MEMORY_DIR}...")
    archived_count = 0
    
    for filename in os.listdir(MEMORY_DIR):
        # Match YYYY-MM-DD.md
        match = re.match(r'(\d{4})-(\d{2})-(\d{2})\.md', filename)
        if match:
            year, month, day = match.groups()
            file_date = datetime.date(int(year), int(month), int(day))
            
            # Keep today and yesterday
            if (today - file_date).days > 1:
                target_dir = os.path.join(ARCHIVE_DIR, year, month)
                os.makedirs(target_dir, exist_ok=True)
                
                src_path = os.path.join(MEMORY_DIR, filename)
                dst_path = os.path.join(target_dir, filename)
                
                shutil.move(src_path, dst_path)
                print(f"📦 Archived {filename} -> {target_dir}")
                archived_count += 1
    
    if archived_count == 0:
        print("✨ No old memories to archive. Everything is fresh!")
    else:
        print(f"✅ Successfully archived {archived_count} files.")

if __name__ == "__main__":
    archive_memories()
