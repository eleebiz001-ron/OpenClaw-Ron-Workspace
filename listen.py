import webview
import requests
import json

# --- Configuration ---
# 이 주소는 Ron App 서버의 주소입니다.
RON_APP_URL = "http://localhost:5051/ask"

HTML = """
<!DOCTYPE html><html><head><style>
body { background: #1c1c1e; color: #fff; font-family: -apple-system, sans-serif; height: 100vh; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
#mic-container { width: 180px; height: 180px; border-radius: 50%; background: #2c2c2e; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; box-shadow: 0 0 30px rgba(0,0,0,0.5); border: 4px solid #3a3a3c; }
#mic-container.active { background: #34c759; border-color: #34c759; box-shadow: 0 0 50px rgba(52,199,89,0.5); transform: scale(1.05); }
#mic-icon { font-size: 70px; }
#status { margin-top: 30px; font-size: 16px; color: #8e8e93; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
#result { margin-top: 25px; width: 85%; text-align: center; font-size: 22px; color: #34c759; min-height: 2.5em; line-height: 1.4; font-weight: 500; }
.hint { position: absolute; bottom: 20px; font-size: 12px; color: #48484a; }
</style></head><body>
<div id="mic-container" onclick="toggleMic()">
    <div id="mic-icon">🎤</div>
</div>
<div id="status">READY TO LISTEN</div>
<div id="result">애니에게 말을 걸어보세요</div>
<div class="hint">클릭해서 켜고 끄기</div>

<script>
let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.onstart = () => {
        isListening = true;
        document.getElementById('mic-container').classList.add('active');
        document.getElementById('status').innerText = "LISTENING...";
        document.getElementById('result').innerText = "듣고 있습니다...";
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        if (finalTranscript) {
            document.getElementById('result').innerText = finalTranscript;
            console.log("SENDING:", finalTranscript);
            // Ron App 서버로 텍스트 전송 (신경망 연결)
            fetch('/send_to_ron', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text: finalTranscript})
            });
        } else {
            document.getElementById('result').innerText = interimTranscript;
        }
    };

    recognition.onend = () => {
        isListening = false;
        document.getElementById('mic-container').classList.remove('active');
        document.getElementById('status').innerText = "READY";
    };
}

function toggleMic() {
    if (!recognition) return alert("Speech recognition not supported.");
    if (isListening) recognition.stop();
    else recognition.start();
}
</script></body></html>
"""

if __name__ == '__main__':
    # pywebview의 JS API를 통해 Flask와 통신하거나 직접 fetch 사용
    # 여기서는 간단하게 로컬 Flask 서버로 릴레이하는 방식을 씁니다.
    print("[Annie's Ear] 귀를 열고 있습니다...")
    webview.create_window('Annie\'s Ear (Listener)', html=HTML, width=400, height=500)
    webview.start()
