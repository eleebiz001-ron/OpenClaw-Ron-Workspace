const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/session_stream.log');
const HTML_FILE = path.join(__dirname, '../war_room_v4.html');

console.log('--- Ron Ultimate Direct Injector v5 (Polling Mode) Started ---');

let lastSize = fs.statSync(LOG_FILE).size;

function updateHTML(newLines) {
    let content = fs.readFileSync(HTML_FILE, 'utf8');
    
    newLines.forEach(line => {
        if (!line.trim()) return;
        const now = new Date();
        const timestamp = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0') + ':' + 
                          now.getSeconds().toString().padStart(2, '0');
        let tag = "SYSTEM";
        let msg = line;

        const agents = ['RON', 'ALPHA', 'SCOUT', 'BIRDIE', 'ECHO', 'DAVINCI'];
        let activeAgent = null;
        
        agents.forEach(a => {
            if (line.startsWith(a + ':')) {
                tag = a;
                msg = line.split(a + ':')[1];
                activeAgent = a.toLowerCase();
            }
        });

        if (activeAgent) {
            agents.forEach(a => {
                const lowerA = a.toLowerCase();
                const targetColor = (lowerA === activeAgent) ? 'yellow' : 'green';
                const regex = new RegExp(`id="agent-${lowerA}" class="agent-card [a-z]+"` , 'g');
                content = content.replace(regex, `id="agent-${lowerA}" class="agent-card ${targetColor}"`);
            });
        }

        const newLogHTML = `<div class="log-line"><span class="log-time">[${timestamp}]</span> <span class="log-tag">${tag}:</span> <span class="log-msg">${msg.trim()}</span></div>`;
        content = content.replace('<div id="log-stream">', `<div id="log-stream">\n${newLogHTML}`);
    });

    fs.writeFileSync(HTML_FILE, content);
}

// OS 수준의 감시(watchFile) 대신 직접 폴링(Interval) 방식으로 전환하여 안정성 확보
setInterval(() => {
    try {
        const stats = fs.statSync(LOG_FILE);
        if (stats.size > lastSize) {
            const stream = fs.createReadStream(LOG_FILE, { start: lastSize });
            stream.on('data', (chunk) => {
                const newLines = chunk.toString().split('\n').filter(l => l.trim());
                if (newLines.length > 0) {
                    console.log(`Processing ${newLines.length} new lines...`);
                    updateHTML(newLines);
                }
            });
            lastSize = stats.size;
        } else if (stats.size < lastSize) {
            // 파일이 비워지거나 작아진 경우 초기화
            lastSize = stats.size;
        }
    } catch (e) {
        console.error('Polling error:', e);
    }
// 100ms마다 강제 체크 (더 실시간에 가깝게)
}, 100); 
