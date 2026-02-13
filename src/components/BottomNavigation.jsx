import { FiHome, FiMessageCircle, FiMap, FiUser } from 'react-icons/fi';
import { IoChatbubblesOutline } from 'react-icons/io5';

/**
 * 하단 네비게이션 바 컴포넌트
 * - 홈, 소통, 지도, 채팅, 내정보
 * - 두 번째 이미지 스타일: 아이콘 + 텍스트
 */
const BottomNavigation = ({ activeTab = 'home', onTabChange }) => {
    const tabs = [
        { id: 'home', name: '홈', icon: '🏠', activeIcon: '🏠' },
        { id: 'community', name: '소통', icon: '👨‍👩‍👧‍👦', activeIcon: '👨‍👩‍👧‍👦' },
        { id: 'map', name: '지도', icon: '📍', activeIcon: '📍' },
        { id: 'chat', name: '채팅', icon: '💬', activeIcon: '💬' },
        { id: 'profile', name: '내정보', icon: '👤', activeIcon: '👤' },
    ];

    return (
        <nav className="bg-white border-t border-gray-100 rounded-b-3xl">
            <div className="max-w-lg mx-auto px-2">
                <ul className="flex items-center justify-around">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <li key={tab.id} className="flex-1">
                                <button
                                    onClick={() => onTabChange?.(tab.id)}
                                    className={`
                    w-full py-3 flex flex-col items-center gap-1
                    transition-all duration-200
                    ${isActive
                                            ? 'text-orange-500'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }
                  `}
                                    aria-label={tab.name}
                                    aria-pressed={isActive}
                                >
                                    <span className="text-xl">{isActive ? tab.activeIcon : tab.icon}</span>
                                    <span className={`
                    text-xs font-medium
                    ${isActive ? 'font-bold text-orange-500' : 'text-gray-500'}
                  `}>
                                        {tab.name}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Safe area for mobile devices */}
            <div className="h-safe-area-bottom bg-white"></div>
        </nav>
    );
};

export default BottomNavigation;
