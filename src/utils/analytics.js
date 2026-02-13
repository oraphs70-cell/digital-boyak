// 사용 로그 분석 모듈 - Baserow 연동
import { logButtonClickToBaserow } from '../api/baserow';

/**
 * 버튼 클릭 로그를 Baserow에 저장합니다.
 * @param {string} buttonName - 클릭된 버튼의 이름 (예: 'taxi', 'hospital', 'ai_assistant')
 * @param {string} userLocation - 사용자 위치 (선택사항)
 */
export const logButtonClick = async (buttonName, userLocation = '') => {
    try {
        // Baserow에 로그 저장
        await logButtonClickToBaserow(buttonName);
        console.log('✅ 사용 로그 저장 완료:', buttonName);
        return true;
    } catch (error) {
        console.error('❌ 사용 로그 저장 실패:', error);
        // 로그 저장 실패해도 앱 기능은 계속 동작하도록 함
        return null;
    }
};

/**
 * 딥링크를 실행하고 로그를 저장합니다.
 * @param {string} buttonName - 버튼 이름
 * @param {string} deepLink - 딥링크 URL
 * @param {string} fallbackUrl - 앱 미설치 시 이동할 URL
 * @param {string} userLocation - 사용자 위치
 */
export const executeDeepLink = async (buttonName, deepLink, fallbackUrl, userLocation = '') => {
    // 로그 저장 (비동기로 처리하여 UX 지연 최소화)
    logButtonClick(buttonName, userLocation);

    // iOS Safari의 경우 다른 방식으로 처리 필요
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    if (deepLink.startsWith('http')) {
        // 웹 URL인 경우 새 탭에서 열기
        window.open(deepLink, '_blank');
        return;
    }

    // 딥링크 실행 시도
    const startTime = Date.now();

    // iframe을 사용한 딥링크 실행 (Android, 일부 iOS)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);

    // 일정 시간 후 앱이 열리지 않으면 스토어로 이동
    setTimeout(() => {
        document.body.removeChild(iframe);

        // 페이지가 hidden 상태가 아니면 앱 설치 페이지로 이동
        if (!document.hidden && Date.now() - startTime < 2000) {
            window.location.href = fallbackUrl;
        }
    }, 1500);
};
