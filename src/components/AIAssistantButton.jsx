import { logButtonClick } from '../utils/analytics';
import { BsStars } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';

/**
 * AI 비서 버튼 컴포넌트
 * - Gemini AI로 연결
 * - 첫 번째 이미지 스타일: 그라데이션 배경, 큰 버튼
 */
const AIAssistantButton = ({ location }) => {
    const { user, logClickToDb } = useAuth();

    const handleClick = () => {
        if (user) {
            logClickToDb('ai_assistant');
        }
        logButtonClick('ai_assistant', location.address);
        window.open('https://gemini.google.com', '_blank');
    };


    return (
        <div className="mx-4">
            <button
                onClick={handleClick}
                className="
          w-full 
          bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300
          hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400
          rounded-3xl 
          p-5
          shadow-lg shadow-amber-100
          hover:shadow-xl hover:shadow-amber-200
          hover:scale-[1.01] 
          active:scale-[0.99] 
          transition-all duration-300
          relative
          overflow-hidden
          group
        "
            >
                {/* 배경 장식 */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent_50%)]"></div>
                </div>

                {/* 반짝이 효과 */}
                <div className="absolute top-3 right-6 animate-pulse text-yellow-600">
                    <BsStars className="text-xl" />
                </div>
                <div className="absolute bottom-3 left-6 animate-pulse text-orange-500">
                    <BsStars className="text-sm" />
                </div>

                {/* 컨텐츠 */}
                <div className="relative flex items-center justify-center gap-4">
                    <span className="text-4xl">🤗</span>
                    <div className="text-left">
                        <p className="text-xl font-bold text-gray-800">AI 비서 보약이</p>
                        <p className="text-sm text-gray-600 mt-0.5">Gemini로 무엇이든 물어보세요!</p>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default AIAssistantButton;
