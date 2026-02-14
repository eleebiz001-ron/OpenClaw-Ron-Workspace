const fs = require('fs');
const path = require('path');

const STATUS_FILE = path.join(__dirname, '../war_room_status.json');
const LOG_STREAM = path.join(__dirname, '../logs/session_stream.log');

console.log('--- Ron Auto-Engine v3 Started ---');

function updateStatus(updater) {
    try {
        let status = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
        updater(status);
        status.last_updated = new Date().toISOString();
        fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 4));
    } catch (e) { console.error('Update Error:', e); }
}

// Watch log stream for conversations
let lastLogSize = 0;
setInterval(() => {
    try {
        const stats = fs.statSync(LOG_STREAM);
        if (stats.size > lastLogSize) {
            const stream = fs.createReadStream(LOG_STREAM, { start: lastLogSize });
            stream.on('data', (chunk) => {
                const lines = chunk.toString().split('\n').filter(l => l.trim());
                updateStatus(s => {
                    lines.forEach(line => {
                        const entry = {
                            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
                            msg: line
                        };
                        s.logs.push(entry);
                        if (s.logs.length > 100) s.logs.shift(); // Keep last 100
                        
                        // Auto-detect Active Agent based on log
                        const agents = ['RON', 'ALPHA', 'SCOUT', 'BIRDIE', 'ECHO', 'DAVINCI'];
                        agents.forEach(a => {
                            if (line.startsWith(a + ':')) {
                                Object.keys(s.agents).forEach(k => s.agents[k].color = 'green'); // Reset all
                                s.agents[a.toLowerCase()].color = 'yellow'; // Set active
                            }
                        });
                    });
                });
            });
            lastLogSize = stats.size;
        }
    } catch (e) {}
}, 1000);
