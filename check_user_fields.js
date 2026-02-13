import https from 'https';

const TABLE_ID = '835616';
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
        try {
            const fields = JSON.parse(data);
            console.log(`--- Fields for Table ${TABLE_ID} ---`);
            if (Array.isArray(fields)) {
                fields.forEach(f => {
                    console.log(`Field Name: "${f.name}", ID: ${f.id}, Type: ${f.type}`);
                });
            } else {
                console.log('Error:', data);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
});
req.on('error', (e) => { console.error(e); });
req.end();
