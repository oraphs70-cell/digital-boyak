import https from 'https';
import fs from 'fs';

const TABLE_ID = '835616';
const options = {
    hostname: 'api.baserow.io',
    path: `/api/database/rows/table/${TABLE_ID}/?size=1`,
    method: 'GET',
    headers: {
        'Authorization': 'Token h8usqMFAMswJumIO8qMqMIAGHHiCqhOB'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('sample_row.json', data);
        console.log('Saved to sample_row.json');
    });
});
req.on('error', (e) => { console.error(e); });
req.end();
