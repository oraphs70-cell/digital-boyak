const BASEROW_API_TOKEN = 'h8usqMFAMswJumIO8qMqMIAGHHiCqhOB';
const TABLE_ID = '832140'; // 전체 통계용
const USER_STATS_TABLE_ID = '832960'; // 사용자별 통계용
const USER_INFO_TABLE_ID = '835616'; // 사용자 프로필용 (테이블 1)

const BASEROW_API_URL = `https://api.baserow.io/api/database/rows/table/${TABLE_ID}/`;
const USER_STATS_API_URL = `https://api.baserow.io/api/database/rows/table/${USER_STATS_TABLE_ID}/`;
const USER_INFO_API_URL = `https://api.baserow.io/api/database/rows/table/${USER_INFO_TABLE_ID}/`;

/**
 * 필드 ID 맵핑
 */
const FIELDS = {
    button_name: 'field_7160836',
    click_count: 'field_7160837',
    last_clicked: 'field_7160838'
};

const USER_FIELDS = {
    user_id: 'field_7169420',
    button_name: 'field_7169421',
    click_count: 'field_7169422',
    last_clicked: 'field_7169423'
};

const PROFILE_FIELDS = {
    user_id: 'field_7193388',
    name: 'field_7193389',
    email: 'field_7193390',
    photo: 'field_7193431',
    last_login: 'field_7193433',
    count: 'field_7193447'
};

/**
 * Baserow API 헤더
 */
const getHeaders = () => ({
    'Authorization': `Token ${BASEROW_API_TOKEN}`,
    'Content-Type': 'application/json',
});

/**
 * 버튼 클릭 기록 - Baserow에 저장
 * @param {string} buttonName - 버튼 이름
 * @param {string} userId - 사용자 고유 ID (선택사항)
 */
export const logButtonClickToBaserow = async (buttonName, userId = null) => {
    try {
        console.log(`🚀 [Baserow] ${buttonName} 기록 시도...`);

        // 1. 전체 통계 업데이트
        const existingRow = await getButtonRow(buttonName);
        if (existingRow) {
            const currentCount = Number(existingRow[FIELDS.click_count] || 0);
            await updateClickCount(existingRow.id, currentCount + 1);
        } else {
            await createButtonRow(buttonName);
        }

        // 2. 사용자별 통계 업데이트 (로그인된 경우)
        if (userId) {
            await logUserButtonClick(userId, buttonName);
        }

        console.log(`✅ [Baserow] ${buttonName} 기록 성공`);
        return true;
    } catch (error) {
        console.error('❌ [Baserow] 기록 실패:', error);
        throw error;
    }
};

/**
 * 사용자별 버튼 클릭 기록
 */
const logUserButtonClick = async (userId, buttonName) => {
    try {
        const url = `${USER_STATS_API_URL}?filter__${USER_FIELDS.user_id}__equal=${userId}&filter__${USER_FIELDS.button_name}__equal=${encodeURIComponent(buttonName)}`;
        const response = await fetch(url, { headers: getHeaders() });
        const data = await response.json();
        const existingRow = data.results && data.results.length > 0 ? data.results[0] : null;

        if (existingRow) {
            const currentCount = Number(existingRow[USER_FIELDS.click_count] || 0);
            await fetch(`${USER_STATS_API_URL}${existingRow.id}/`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({
                    [USER_FIELDS.click_count]: currentCount + 1,
                    [USER_FIELDS.last_clicked]: new Date().toISOString().split('T')[0]
                })
            });
        } else {
            await fetch(USER_STATS_API_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    [USER_FIELDS.user_id]: userId,
                    [USER_FIELDS.button_name]: buttonName,
                    [USER_FIELDS.click_count]: 1,
                    [USER_FIELDS.last_clicked]: new Date().toISOString().split('T')[0]
                })
            });
        }
    } catch (error) {
        console.error('❌ [Baserow User Log] 실패:', error);
    }
};

/**
 * 특정 버튼의 기존 데이터 조회
 */
const getButtonRow = async (buttonName) => {
    try {
        // 필터 사용 시 field_ID 형식을 권장
        const url = `${BASEROW_API_URL}?filter__${FIELDS.button_name}__equal=${encodeURIComponent(buttonName)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('❌ [Baserow] 조회 응답 실패:', response.status, err);
            return null;
        }

        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0] : null;
    } catch (error) {
        console.error('❌ [Baserow] 조회 도중 에러:', error);
        return null;
    }
};

/**
 * 새 버튼 데이터 생성
 */
const createButtonRow = async (buttonName) => {
    const payload = {
        [FIELDS.button_name]: buttonName,
        [FIELDS.click_count]: 1,
        [FIELDS.last_clicked]: new Date().toISOString().split('T')[0],
    };

    console.log('🆕 [Baserow] 생성 페이로드:', payload);

    const response = await fetch(BASEROW_API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const err = await response.json();
        console.error('❌ [Baserow] 생성 실패 상세:', err);
        throw new Error(`생성 실패: ${JSON.stringify(err)}`);
    }

    return response.json();
};

/**
 * 클릭 횟수 업데이트
 */
const updateClickCount = async (rowId, newCount) => {
    const payload = {
        [FIELDS.click_count]: newCount,
        [FIELDS.last_clicked]: new Date().toISOString().split('T')[0],
    };

    console.log(`🆙 [Baserow] 업데이트 페이로드 (ID: ${rowId}):`, payload);

    const response = await fetch(`${BASEROW_API_URL}${rowId}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const err = await response.json();
        console.error('❌ [Baserow] 업데이트 실패 상세:', err);
        throw new Error(`업데이트 실패: ${JSON.stringify(err)}`);
    }

    return response.json();
};

/**
 * 모든 버튼 사용 통계 조회 (대시보드용)
 */
export const getAllButtonStats = async () => {
    try {
        const url = `${BASEROW_API_URL}?order_by=-${FIELDS.click_count}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) return [];

        const data = await response.json();

        // UI에서 쓰기 편하게 필드명 맵핑 환원
        return (data.results || []).map(row => ({
            id: row.id,
            button_name: row[FIELDS.button_name],
            click_count: Number(row[FIELDS.click_count] || 0),
            last_clicked: row[FIELDS.last_clicked]
        }));
    } catch (error) {
        console.error('❌ [Baserow] 통계 조회 실패:', error);
        return [];
    }
};

/**
 * 모든 버튼 통계 초기화
 */
export const resetAllStats = async () => {
    try {
        console.log('🔄 [Baserow] 모든 통계 초기화 시도...');
        const stats = await getAllButtonStats();

        // 병렬로 모든 행의 클릭수를 0으로 업데이트
        const promises = stats.map(item =>
            fetch(`${BASEROW_API_URL}${item.id}/`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({
                    [FIELDS.click_count]: 0
                }),
            })
        );

        await Promise.all(promises);
        console.log('✅ [Baserow] 모든 통계 초기화 성공');
        return true;
    } catch (error) {
        console.error('❌ [Baserow] 초기화 실패:', error);
        throw error;
    }
};

/**
 * 총 클릭 수 계산
 */
export const getTotalClicks = async () => {
    const stats = await getAllButtonStats();
    return stats.reduce((sum, row) => sum + (Number(row.click_count) || 0), 0);
};

/**
 * 사용자 프로필 조회 또는 저장 (로그인 횟수 포함)
 */
export const getOrSaveUserProfile = async (userData) => {
    try {
        console.log('🔍 [Baserow User] 조회 시도:', userData.id);
        const url = `${USER_INFO_API_URL}?filter__${PROFILE_FIELDS.user_id}__equal=${userData.id}`;
        const response = await fetch(url, { headers: getHeaders() });
        const data = await response.json();

        console.log('📊 [Baserow User] 조회 결과:', data);
        const existing = data.results && data.results.length > 0 ? data.results[0] : null;

        if (existing) {
            console.log('🔄 [Baserow User] 기존 사용자 업데이트 중 (ID:', existing.id, ')');
            // 마지막 로그인 시간 및 횟수 업데이트
            const currentCount = Number(existing[PROFILE_FIELDS.count] || 0);
            const updateResponse = await fetch(`${USER_INFO_API_URL}${existing.id}/`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({
                    [PROFILE_FIELDS.last_login]: new Date().toISOString().split('T')[0],
                    [PROFILE_FIELDS.count]: currentCount + 1
                })
            });
            console.log('✅ [Baserow User] 업데이트 응답:', updateResponse.status);

            return {
                id: existing[PROFILE_FIELDS.user_id],
                name: existing[PROFILE_FIELDS.name],
                email: existing[PROFILE_FIELDS.email],
                photoURL: existing[PROFILE_FIELDS.photo],
                count: currentCount + 1
            };
        } else {
            console.log('🆕 [Baserow User] 새 사용자 생성 중...');
            // 새 프로필 생성
            const createResponse = await fetch(USER_INFO_API_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    [PROFILE_FIELDS.user_id]: userData.id.toString(),
                    [PROFILE_FIELDS.name]: userData.name,
                    [PROFILE_FIELDS.email]: userData.email,
                    [PROFILE_FIELDS.photo]: userData.photoURL,
                    [PROFILE_FIELDS.last_login]: new Date().toISOString().split('T')[0],
                    [PROFILE_FIELDS.count]: 1
                })
            });
            console.log('✅ [Baserow User] 생성 응답:', createResponse.status);
            return { ...userData, count: 1 };
        }
    } catch (error) {
        console.error('❌ [Baserow Profile] 실패:', error);
        return userData;
    }
};

/**
 * 모든 사용자 정보 조회 (관리자용)
 */
export const getAllUserProfiles = async () => {
    try {
        const url = `${USER_INFO_API_URL}?order_by=-${PROFILE_FIELDS.last_login}`;
        const response = await fetch(url, { headers: getHeaders() });
        const data = await response.json();
        return (data.results || []).map(row => ({
            id: row.id,
            user_id: row[PROFILE_FIELDS.user_id],
            name: row[PROFILE_FIELDS.name],
            email: row[PROFILE_FIELDS.email],
            photoURL: row[PROFILE_FIELDS.photo],
            last_login: row[PROFILE_FIELDS.last_login],
            count: Number(row[PROFILE_FIELDS.count] || 0)
        }));
    } catch (error) {
        console.error('❌ [Baserow All Users] 실패:', error);
        return [];
    }
};
