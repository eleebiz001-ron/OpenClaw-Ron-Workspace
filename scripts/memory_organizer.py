import os
import re
import shutil
from datetime import datetime

MEMORY_DIR = "/Users/ieunchul/clawd/memory"
ARCHIVE_DIR = os.path.join(MEMORY_DIR, "archives")
PROCESSED_DIR = os.path.join(ARCHIVE_DIR, "processed_daily")

def setup_dirs():
    for d in [ARCHIVE_DIR, PROCESSED_DIR]:
        if not os.path.exists(d):
            os.makedirs(d)

def read_files():
    # Only pick YYYY-MM-DD.md files
    pattern = re.compile(r"^\d{4}-\d{2}-\d{2}\.md$")
    files = [f for f in os.listdir(MEMORY_DIR) if pattern.match(f)]
    files.sort()
    content_map = {}
    for filename in files:
        path = os.path.join(MEMORY_DIR, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content_map[filename] = f.read()
    return content_map

def extract_sections(content):
    sections = {}
    current_section = "General"
    lines = content.split('\n')
    for line in lines:
        if line.startswith('# '): continue
        if line.startswith('## '):
            current_section = line.replace('## ', '').strip()
            if current_section not in sections:
                sections[current_section] = []
        elif line.strip():
            if current_section not in sections:
                sections[current_section] = []
            sections[current_section].append(line) # Keep original line for bullet context
    return sections

def organize():
    raw_data = read_files()
    if not raw_data:
        print("No new daily memory files to process.")
        return None

    all_sections = {}
    
    mapping = {
        "오늘 진행된 주요 사항": "Progress & Updates",
        "구글(Gmail) 연동 시도 및 문제 해결": "Technical Solutions",
        "gogcli 연동 작업": "Technical Solutions",
        "Codex CLI 설치": "Technical Solutions",
        "Kanban 보드 요청": "Requests & Decisions",
        "디지털 자산 뉴스": "Knowledge Base",
        "설정 변경": "Configuration",
        "중요 정보": "Core Info",
        "내일 할 일": "Future Tasks (Historical)"
    }

    processed_files = []

    for filename, content in raw_data.items():
        sections = extract_sections(content)
        for sec_name, items in sections.items():
            canonical_name = mapping.get(sec_name, sec_name)
            if canonical_name not in all_sections:
                all_sections[canonical_name] = []
            # Deduplicate items within the section while preserving order
            for item in items:
                if item not in all_sections[canonical_name]:
                    all_sections[canonical_name].append(item)
        processed_files.append(filename)

    # Generate consolidated file
    timestamp = datetime.now().strftime("%Y%m%d")
    archive_file = os.path.join(ARCHIVE_DIR, f"knowledge_summary_{timestamp}.md")
    
    with open(archive_file, 'w', encoding='utf-8') as f:
        f.write(f"# Memory Knowledge Summary ({datetime.now().strftime('%Y-%m-%d')})\n\n")
        f.write(f"Processed files: {', '.join(processed_files)}\n\n")
        
        # Priority sections first
        priority = ["Core Info", "Technical Solutions", "Configuration", "Requests & Decisions", "Progress & Updates"]
        sorted_sections = sorted(all_sections.keys(), key=lambda x: priority.index(x) if x in priority else 99)
        
        for section in sorted_sections:
            f.write(f"## {section}\n")
            for item in all_sections[section]:
                f.write(f"{item}\n")
            f.write("\n")
    
    # Move processed files
    for filename in processed_files:
        src = os.path.join(MEMORY_DIR, filename)
        dst = os.path.join(PROCESSED_DIR, filename)
        shutil.move(src, dst)
            
    return archive_file

if __name__ == "__main__":
    setup_dirs()
    path = organize()
    if path:
        print(f"Successfully organized memory. Archive created at: {path}")
        print(f"Daily files moved to {PROCESSED_DIR}")
