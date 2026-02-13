import https from 'https';

const BASEROW_API_TOKEN = 'h8usqMFAMswJumIO8qMqMIAGHHiCqhOB';
const TABLE_ID = '832140';
const FIELDS = {
    click_count: 'field_7160837'
};

const request = (options, data) => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(body ? JSON.parse(body) : {}));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
};

const resetStats = async () => {
    try {
        console.log('🔍 모든 버튼 데이터 조회 중...');
        const listData = await request({
            hostname: 'api.baserow.io',
            path: `/api/database/rows/table/${TABLE_ID}/`,
            method: 'GET',
            headers: { 'Authorization': `Token ${BASEROW_API_TOKEN}` }
        });

        const rows = listData.results || [];
        console.log(`📊 총 ${rows.length}개의 항목을 초기화합니다.`);

        for (const row of rows) {
            console.log(`🔄 초기화 중 (ID: ${row.id})...`);
            await request({
                hostname: 'api.baserow.io',
                path: `/api/database/rows/table/${TABLE_ID}/${row.id}/`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${BASEROW_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }, { [FIELDS.click_count]: 0 });
        }

        console.log('✅ 모든 통계가 0으로 초기화되었습니다.');
    } catch (error) {
        console.error('❌ 초기화 실패:', error);
    }
};

resetStats();
