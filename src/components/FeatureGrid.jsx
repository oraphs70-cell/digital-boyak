import { executeDeepLink } from '../utils/analytics';
import { FiNavigation, FiHeart } from 'react-icons/fi';
import { FaHospital, FaTaxi } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

/**
 * 핵심 기능 그리드 컴포넌트
 * - 길찾기 (카카오맵)
 * - 병원 (똑딱)
 * - 택시 (카카오T)
 * - 건강 (건강보험)
 * 
 * 첫 번째 이미지 스타일: 큰 색상 버튼 유지
 */
const FeatureGrid = ({ location }) => {
    const { user, logClickToDb } = useAuth();

    const features = [
        // ... (rest of the features remain same)
        {
            id: 'navigation',
            name: '길찾기',
            icon: FiNavigation,
            iconEmoji: '🧭',
            color: 'from-blue-400 to-blue-500',
            shadowColor: 'shadow-blue-200',
            deepLink: 'kakaomap://open',
            fallbackUrl: 'https://play.google.com/store/apps/details?id=net.daum.android.map',
            description: '카카오맵으로 길찾기',
        },
        {
            id: 'hospital',
            name: '병원',
            icon: FaHospital,
            iconEmoji: '🏥',
            color: 'from-pink-400 to-rose-500',
            shadowColor: 'shadow-pink-200',
            deepLink: 'ddocdoc://',
            fallbackUrl: 'https://play.google.com/store/apps/details?id=com.ddocdoc',
            description: '똑딱으로 병원 예약',
        },
        {
            id: 'taxi',
            name: '택시',
            icon: FaTaxi,
            iconEmoji: '🚕',
            color: 'from-yellow-400 to-amber-500',
            shadowColor: 'shadow-yellow-200',
            deepLink: 'kakaot://',
            fallbackUrl: 'https://play.google.com/store/apps/details?id=com.kakao.taxi',
            description: '카카오T로 택시 호출',
        },
        {
            id: 'health',
            name: '건강',
            icon: FiHeart,
            iconEmoji: '💚',
            color: 'from-emerald-400 to-green-500',
            shadowColor: 'shadow-emerald-200',
            deepLink: 'https://www.nhis.or.kr/nhis/healthin/wbhaba01100m01.do',
            fallbackUrl: 'https://www.nhis.or.kr',
            description: '건강보험 정보 확인',
        },
        {
            id: 'stock',
            name: '주식',
            iconEmoji: '📈',
            color: 'from-indigo-400 to-indigo-500',
            shadowColor: 'shadow-indigo-200',
            deepLink: 'supertoss://',
            fallbackUrl: 'https://play.google.com/store/apps/details?id=viva.republica.toss',
            description: '토스에서 주식 확인',
        },
        {
            id: 'video',
            name: '동영상',
            iconEmoji: '🎬',
            color: 'from-rose-400 to-red-500',
            shadowColor: 'shadow-rose-200',
            deepLink: 'vllo://',
            fallbackUrl: 'https://play.google.com/store/apps/details?id=com.vimosoft.vllo',
            description: '블로에서 영상 편집',
        },
        {
            id: 'youtube',
            name: '유튜브',
            iconEmoji: '📺',
            color: 'from-red-500 to-red-600',
            shadowColor: 'shadow-red-200',
            deepLink: 'youtube://',
            fallbackUrl: 'https://play.google.com/store/apps/details?id=com.google.android.youtube',
            description: '유튜브에서 영상 시청',
        },
        {
            id: 'news',
            name: '뉴스',
            iconEmoji: '📰',
            color: 'from-gray-600 to-gray-700',
            shadowColor: 'shadow-gray-200',
            deepLink: 'https://news.google.com',
            fallbackUrl: 'https://news.google.com',
            description: '실시간 뉴스 보기',
        },
    ];

    const handleClick = (feature) => {
        // Firestore에 사용자별 클릭 기록 저장
        if (user) {
            logClickToDb(feature.id);
        }

        executeDeepLink(
            feature.id,
            feature.deepLink,
            feature.fallbackUrl,
            location.address
        );
    };


    return (
        <div className="mx-4 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
                <span>✨</span> 자주 쓰는 기능
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                    <button
                        key={feature.id}
                        onClick={() => handleClick(feature)}
                        className={`
              bg-gradient-to-br ${feature.color} 
              rounded-2xl py-10 px-4 text-white
              shadow-lg ${feature.shadowColor}
              hover:shadow-xl hover:scale-[1.02] 
              active:scale-[0.98] 
              transition-all duration-200
              group
              relative
              overflow-hidden
            `}
                        aria-label={feature.description}
                    >
                        {/* 배경 장식 */}
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>

                        {/* 아이콘 + 텍스트 가로 배치 */}
                        <div className="relative flex items-center justify-center gap-3">
                            {/* 아이콘 */}
                            <span className="text-3xl">{feature.iconEmoji}</span>

                            {/* 텍스트 */}
                            <div>
                                <span className="text-lg font-bold block">{feature.name}</span>
                                <span className="text-[10px] opacity-80 block">{feature.description}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FeatureGrid;
