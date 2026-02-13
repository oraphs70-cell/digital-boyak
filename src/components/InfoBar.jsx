import { FiPhoneCall, FiShare2 } from 'react-icons/fi';
import { logButtonClick } from '../utils/analytics';

/**
 * 정보 바 컴포넌트
 * - 날씨 정보 (날짜 + 위치 + 온도)
 * - 119 버튼
 * - 공유 버튼
 */
const InfoBar = ({ weather, location }) => {
    // 오늘 날짜
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    // 위치에서 도시명만 추출
    const cityName = location.address.split(' ').pop() || '천안';

    // 119 긴급 전화
    const handleSOS = () => {
        logButtonClick('sos_119', location.address);
        window.location.href = 'tel:119';
    };

    // 앱 공유
    const handleShare = async () => {
        logButtonClick('share', location.address);

        const shareData = {
            title: '디지털 보약',
            text: '어르신을 위한 스마트폰 도우미 앱입니다.',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('링크가 복사되었습니다!');
            }
        } catch (error) {
            console.error('공유 실패:', error);
        }
    };

    return (
        <div className="mx-4 mt-4 flex items-stretch gap-3">
            {/* 날씨 정보 */}
            <div className="flex-1 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl px-4 py-3 flex items-center gap-3 border border-amber-100">
                <span className="text-2xl">{weather.icon}</span>
                <div>
                    <p className="text-xs text-gray-500">{dateStr} ({cityName})</p>
                    <p className="text-xl font-bold text-gray-800">
                        {weather.loading ? '--' : `${weather.temp}°C`}
                    </p>
                </div>
            </div>

            {/* 119 SOS 버튼 */}
            <button
                onClick={handleSOS}
                className="w-20 bg-gradient-to-b from-orange-100 to-orange-50 rounded-2xl flex flex-col items-center justify-center text-orange-500 border border-orange-200 hover:border-orange-400 hover:shadow-md active:scale-95 transition-all"
                aria-label="119 긴급 전화"
            >
                <span className="text-xl mb-0.5">🚨</span>
                <span className="text-base font-bold">119</span>
            </button>

            {/* 공유 버튼 */}
            <button
                onClick={handleShare}
                className="w-20 bg-gradient-to-b from-sky-400 to-sky-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-md shadow-sky-200 hover:shadow-lg hover:shadow-sky-300 active:scale-95 transition-all"
                aria-label="앱 공유"
            >
                <span className="text-xl mb-0.5">🎁</span>
                <span className="text-base font-bold">공유</span>
            </button>
        </div>
    );
};

export default InfoBar;
