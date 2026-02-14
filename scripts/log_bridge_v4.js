const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/session_stream.log');
const HTML_FILE = path.join(__dirname, '../war_room_v4.html');

console.log('--- Ron Ultimate Direct Injector v4 Started ---');

let lastSize = 0;

function updateHTML(newLines) {
    let content = fs.readFileSync(HTML_FILE, 'utf8');
    
    newLines.forEach(line => {
        const now = new Date();
        const timestamp = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0') + ':' + 
                          now.getSeconds().toString().padStart(2, '0');
        let tag = "SYSTEM";
        let msg = line;

        // 1. Parse Agent and Message
        const agents = ['RON', 'ALPHA', 'SCOUT', 'BIRDIE', 'ECHO', 'DAVINCI'];
        let activeAgent = null;
        
        agents.forEach(a => {
            if (line.startsWith(a + ':')) {
                tag = a;
                msg = line.split(a + ':')[1];
                activeAgent = a.toLowerCase();
            }
        });

        // 2. Update Agent Colors (SMART REGEX REPLACEMENT)
        if (activeAgent) {
            agents.forEach(a => {
                const lowerA = a.toLowerCase();
                const targetColor = (lowerA === activeAgent) ? 'yellow' : 'green';
                
                // Use regex to find id="agent-xxx" class="agent-card [anything]"
                const regex = new RegExp(`id="agent-${lowerA}" class="agent-card [a-z]+"` , 'g');
                const replacement = `id="agent-${lowerA}" class="agent-card ${targetColor}"`;
                
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                }
            });
        }

        // 3. Inject Log Entry
        const newLogHTML = `<div class="log-line"><span class="log-time">[${timestamp}]</span> <span class="log-tag">${tag}:</span> <span class="log-msg">${msg.trim()}</span></div>`;
        content = content.replace('<div id="log-stream">', `<div id="log-stream">\n${newLogHTML}`);
    });

    fs.writeFileSync(HTML_FILE, content);
}

// Watch for file changes
fs.watchFile(LOG_FILE, { interval: 500 }, (curr, prev) => {
    if (curr.size <= lastSize) {
        lastSize = curr.size;
        return;
    }
    const stream = fs.createReadStream(LOG_FILE, { start: lastSize });
    stream.on('data', (chunk) => {
        const newLines = chunk.toString().split('\n').filter(l => l.trim());
        if (newLines.length > 0) updateHTML(newLines);
    });
    lastSize = curr.size;
});
