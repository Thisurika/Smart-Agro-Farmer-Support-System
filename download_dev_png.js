const fs = require('fs');
const https = require('https');
const pako = require('zlib'); // Using zlib deflate for pako

function encodeMermaid(mermaidStr) {
    const state = {
        code: mermaidStr,
        mermaid: { theme: 'default' },
        autoSync: true,
        updateDiagram: true
    };
    const jsonStr = JSON.stringify(state);
    const data = Buffer.from(jsonStr, 'utf8');
    const compressed = pako.deflateSync(data, { level: 9 });
    return compressed.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

const dev_workflow = fs.readFileSync('development_workflow.mmd', 'utf8');

function downloadImage(url, filename) {
    console.log('Downloading ' + filename + ' from ' + url);
    https.get(url, (res) => {
        if (res.statusCode === 200) {
            res.pipe(fs.createWriteStream(filename))
               .on('close', () => console.log('Saved ' + filename));
        } else if (res.statusCode === 302 || res.statusCode === 301) {
            downloadImage(res.headers.location, filename);
        } else {
            console.error('Failed to download ' + filename + '. Status code: ' + res.statusCode);
        }
    }).on('error', (err) => {
        console.error('Error downloading ' + filename + ':', err.message);
    });
}

const encoded = encodeMermaid(dev_workflow);
downloadImage('https://mermaid.ink/img/pako:' + encoded, 'development_workflow.png');
