const fs = require('fs');

const transcriptPath = 'C:/Users/ACER/.gemini/antigravity-ide/brain/ec7a304c-b2ad-4e31-8338-3566062808fa/.system_generated/logs/transcript.jsonl';
const content = fs.readFileSync(transcriptPath, 'utf8');
const lines = content.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const json = JSON.parse(line);
    if (json.type === 'USER_INPUT' && json.content) {
      if (json.content.includes('The following changes were made by the USER to: c:\\Users\\ACER\\Documents\\ZetaConnect\\ZetaConnectFE\\src\\pages\\receptionist\\Dashboard.jsx')) {
        const match = json.content.match(/\[diff_block_start\]\n([\s\S]*?)\[diff_block_end\]/);
        if (match) {
          const diffLines = match[1].split('\n');
          const cleanLines = diffLines.filter(l => l.startsWith('-')).map(l => l.substring(1));
          fs.writeFileSync('C:/Users/ACER/Documents/ZetaConnect/ZetaConnectFE/src/pages/receptionist/Dashboard.jsx', cleanLines.join('\n'));
          console.log('Restored Dashboard.jsx');
        }
      }
      
      if (json.content.includes('The following changes were made by the USER to: c:\\Users\\ACER\\Documents\\ZetaConnect\\ZetaConnectFE\\src\\pages\\receptionist\\QueueMonitor.jsx')) {
        const match = json.content.match(/\[diff_block_start\]\n([\s\S]*?)\[diff_block_end\]/);
        if (match) {
          const diffLines = match[1].split('\n');
          const cleanLines = diffLines.filter(l => l.startsWith('-')).map(l => l.substring(1));
          fs.writeFileSync('C:/Users/ACER/Documents/ZetaConnect/ZetaConnectFE/src/pages/receptionist/QueueMonitor.jsx', cleanLines.join('\n'));
          console.log('Restored QueueMonitor.jsx');
        }
      }
    }
  } catch (e) {
    // ignore parse errors
  }
}
