const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/session_stream.log');
const HTML_FILE = path.join(__dirname, '../war_room_v3_final.html');

console.log('Auto Log Bridge v2 Started...');
console.log('Monitoring:', LOG_FILE);

let lastSize = 0;

if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '[SYSTEM] Log stream initialized.\n');
}

// Watch for file changes
fs.watchFile(LOG_FILE, { interval: 500 }, (curr, prev) => {
    if (curr.size <= lastSize) {
        lastSize = curr.size;
        return;
    }

    const stream = fs.createReadStream(LOG_FILE, { start: lastSize });
    stream.on('data', (chunk) => {
        const newLines = chunk.toString().split('\n').filter(l => l.trim() !== '');
        if (newLines.length > 0) {
            updateHTML(newLines);
        }
    });
    lastSize = curr.size;
});

function updateHTML(newLines) {
    let content = fs.readFileSync(HTML_FILE, 'utf8');
    
    newLines.forEach(line => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let tag = "SYSTEM";
        let msg = line;

        if (line.includes('REPRESENTATIVE:')) {
            tag = "REPRESENTATIVE";
            msg = line.split('REPRESENTATIVE:')[1];
        } else if (line.includes('RON:')) {
            tag = "RON";
            msg = line.split('RON:')[1];
        } else if (line.includes('ALPHA:')) {
            tag = "ALPHA";
            msg = line.split('ALPHA:')[1];
        } else if (line.includes('SCOUT:')) {
            tag = "SCOUT";
            msg = line.split('SCOUT:')[1];
        } else if (line.includes('BIRDIE:')) {
            tag = "BIRDIE";
            msg = line.split('BIRDIE:')[1];
        }

        const newEntry = `<div class="log-entry"><span class="log-time">[${timestamp}]</span> <span class="log-tag">${tag}:</span> <span class="log-msg">${msg.trim()}</span></div>`;
        
        // Append to the BOTTOM of the container
        content = content.replace('</div></div>', `${newEntry}\n</div></div>`);
    });

    fs.writeFileSync(HTML_FILE, content);
}
