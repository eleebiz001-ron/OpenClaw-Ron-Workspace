import webview
import threading
import time
import os
from flask import Flask, render_template_string, jsonify, request
import subprocess

# --- Configuration ---
PORT = 5051
app = Flask(__name__, static_folder='static')

# 캐릭터 프로필 설정
PROFILES = {
    "male": {"name": "Ron", "img": "/static/ron_male.png", "voice": "Minsu"},
    "female": {"name": "Annie", "img": "/static/annie.png", "voice": "Yuna"}
}

# 서버 상태 관리 (전역 변수로 현재 선택된 성별 유지)
active_config = {"gender": "female"}

def log(msg):
    print(f"[System] {msg}")

@app.route('/get_gender', methods=['GET'])
def get_gender():
    return active_config["gender"]

@app.route('/switch', methods=['POST'])
def switch():
    gender = request.json.get('gender', 'female')
    active_config["gender"] = gender
    log(f"--- SERVER STATE UPDATED: {active_config['gender']} ---")
    return jsonify({"status": "success"})

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_text = data.get('text', '')
    gender = data.get('gender', active_config["gender"])
    
    if not user_text: return jsonify({"status": "empty"})
    
    profile = PROFILES.get(gender, PROFILES["female"])
    log(f"Asking {profile['name']}: {user_text}")
    
    # 지능형 답변
    if "날씨" in user_text:
        reply = "현재 고양시 날씨는 맑고 쾌적한 영상 4도입니다."
    else:
        reply = f"네, 대표님. 말씀하신 {user_text}에 대해 저 {profile['name']}가 정성껏 보좌하겠습니다."
    
    subprocess.Popen(['say', '-v', profile['voice'], reply])
    return jsonify({"reply": reply})

@app.route('/')
def index(): return render_template_string(PAGE_HTML)

@app.route('/chat_view')
def chat_view(): return render_template_string(CHAT_HTML)

@app.route('/board')
def board():
    try:
        with open('kanban.html', 'r', encoding='utf-8') as f: return f.read()
    except: return "Error loading board"

PAGE_HTML = """
<!DOCTYPE html><html><head><style>
body { background: #000; color: #fff; font-family: -apple-system, sans-serif; height: 100vh; margin: 0; display: flex; flex-direction: column; overflow: hidden; }
#nav { background: #1a1a1a; padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; }
#switch-container { display: flex; gap: 5px; background: #2c2c2e; padding: 4px; border-radius: 12px; }
.switch-btn { padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; background: transparent; color: #8e8e93; font-weight: bold; transition: 0.3s; }
.switch-btn.active { background: #007aff; color: white; }
iframe { flex: 1; border: none; }
</style></head><body>
<div id="nav">
    <div id="tab-container">
        <button onclick="load('chat')" style="background:#2c2c2e; border:none; color:white; padding:8px 15px; border-radius:8px; cursor:pointer;">💬 Chat</button>
        <button onclick="load('board')" style="background:#2c2c2e; border:none; color:white; padding:8px 15px; border-radius:8px; cursor:pointer; margin-left:5px;">📋 Board</button>
    </div>
    <div id="switch-container">
        <button id="btn-male" class="switch-btn" onclick="setGender('male')">🤵‍♂️ 론</button>
        <button id="btn-female" class="switch-btn active" onclick="setGender('female')">🤵‍♀️ 애니</button>
    </div>
</div>
<iframe id="frame" src="/chat_view"></iframe>
<script>
function setGender(g) {
    // 1. UI 즉시 업데이트
    document.getElementById('btn-male').classList.toggle('active', g === 'male');
    document.getElementById('btn-female').classList.toggle('active', g === 'female');
    
    // 2. 서버 상태 동기화 (가장 중요)
    fetch('/switch', { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({gender: g}) 
    });
    
    // 3. 채팅 뷰 프레임에 알림
    const frame = document.getElementById('frame');
    if(frame.contentWindow) {
        frame.contentWindow.postMessage({type: 'gender_change', gender: g}, '*');
    }
}
function load(view) {
    document.getElementById('frame').src = (view === 'chat' ? '/chat_view' : '/board');
}
</script></body></html>"""

CHAT_HTML = """
<!DOCTYPE html><html><head><style>
body { background: #111; color: #fff; font-family: -apple-system, sans-serif; height: 100vh; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
#avatar { width: 300px; height: 300px; border-radius: 50%; border: 4px solid #007aff; object-fit: cover; transition: 0.4s; }
.speaking { animation: pulse 0.5s infinite alternate; border-color: #34c759 !important; }
@keyframes pulse { from { transform: scale(1); } to { transform: scale(1.05); } }
#chat-bar { width: 100%; padding: 25px; display: flex; gap: 12px; background: #1a1a1a; box-sizing: border-box; border-top: 1px solid #333; }
input { flex: 1; padding: 15px 25px; border-radius: 30px; border: 1px solid #333; background: #2c2c2e; color: white; font-size: 17px; outline: none; }
button { padding: 10px 30px; background: #007aff; border: none; color: white; border-radius: 25px; font-weight: bold; cursor: pointer; }
#status { margin-bottom: 20px; color: #007aff; font-family: monospace; font-size: 15px; }
</style></head><body>
<div id="status">● READY</div>
<img id="avatar" src="/static/annie.png">
<div id="chat-bar">
    <input type="text" id="m" placeholder="메시지 입력..." onkeypress="if(event.key==='Enter') send()">
    <button onclick="send()">전송</button>
</div>
<script>
let selectedGender = 'female';
window.addEventListener('message', function(e) {
    if(e.data.type === 'gender_change') {
        selectedGender = e.data.gender;
        document.getElementById('avatar').src = (selectedGender === 'male' ? '/static/ron_male.png' : '/static/annie.png');
        document.getElementById('status').innerText = "● READY (" + selectedGender.toUpperCase() + ")";
    }
});
async function send() {
    const input = document.getElementById('m');
    const text = input.value.trim(); if(!text) return;
    input.value = '';
    document.getElementById('avatar').classList.add('speaking');
    const res = await fetch('/ask', { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({text: text, gender: selectedGender}) 
    });
    setTimeout(() => { document.getElementById('avatar').classList.remove('speaking'); }, 3000);
}
</script></body></html>"""

if __name__ == '__main__':
    t = threading.Thread(target=lambda: app.run(port=PORT, debug=False, use_reloader=False))
    t.daemon = True
    t.start()
    webview.create_window('Ron & Annie Final', f'http://localhost:{PORT}', width=500, height=800)
    webview.start()
