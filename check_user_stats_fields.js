import https from 'https';
import fs from 'fs';

const TABLE_ID = '832960';
const options = {
    hostname: 'api.baserow.io',
    path: `/api/database/fields/table/${TABLE_ID}/`,
    method: 'GET',
    headers: {
        'Authorization': 'Token h8usqMFAMswJumIO8qMqMIAGHHiCqhOB'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('user_stats_fields.json', data);
        console.log('Saved to user_stats_fields.json');
    });
});
req.on('error', (e) => { console.error(e); });
req.end();
