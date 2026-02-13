import https from 'https';

const options = {
    hostname: 'api.baserow.io',
    path: '/api/database/fields/table/832140/',
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
            if (Array.isArray(fields)) {
                fields.forEach(f => {
                    console.log(`Field Name: "${f.name}", ID: ${f.id}, Type: ${f.type}`);
                });
            } else {
                console.log('Unexpected response format:', data);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });
});

req.on('error', (e) => { console.error(e); });
req.end();
