import { useState } from 'react';
import { FiSearch, FiBell, FiMenu, FiX, FiChevronDown, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

/**
 * 상단 헤더 컴포넌트
 * - 현재 위치 표시 (드롭다운 스타일)
 * - 검색, 알림, 메뉴 아이콘 + 로그인/로그아웃
 */
const Header = ({ location, onAdminClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { user, loginWithGoogle, logout } = useAuth();

    return (
        <>
            <header className="bg-white rounded-t-3xl border-b border-gray-50">
                <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
                    {/* 현재 위치 */}
                    <button className="flex items-center gap-1 text-gray-800 hover:text-orange-500 transition-colors">
                        <span className="text-lg font-bold">
                            {location.loading ? '위치 확인중...' : location.address}
                        </span>
                        <FiChevronDown className="text-gray-500" />
                    </button>

                    {/* 우측 아이콘들 */}
                    <div className="flex items-center gap-1">
                        {/* 로그인/로그아웃 버튼 */}
                        {user ? (
                            <div className="flex items-center gap-2 mr-1">
                                <img
                                    src={user.photoURL}
                                    alt="프로필"
                                    className="w-8 h-8 rounded-full border border-orange-200"
                                />
                                <button
                                    onClick={logout}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all flex items-center gap-1"
                                >
                                    <span>로그아웃</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={loginWithGoogle}
                                className="px-3 py-1.5 text-sm font-bold text-orange-500 hover:bg-orange-50 rounded-full transition-all flex items-center gap-1 border border-orange-100 mr-1"
                            >
                                <span>로그인</span>
                            </button>
                        )}

                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all"
                            aria-label="검색"
                        >
                            <FiSearch className="text-xl" />
                        </button>
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
                            aria-label="메뉴"
                        >
                            <FiMenu className="text-xl" />
                        </button>
                    </div>
                </div>
            </header>


            {/* 사이드 메뉴 */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100]">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl animate-slide-in">
                        <div className="p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold">메뉴</h2>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>
                        </div>
                        <nav className="p-4 flex flex-col h-full bg-white">
                            <ul className="space-y-2 flex-1 pt-4">
                                {['공지사항', '이벤트', '사용방법', '설정', '문의하기', '버전정보'].map((item) => (
                                    <li key={item}>
                                        <button className="w-full text-left px-5 py-4 text-lg text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-2xl transition-all flex items-center justify-between group">
                                            <span>{item}</span>
                                            <span className="text-gray-300 group-hover:text-orange-300">›</span>
                                        </button>
                                    </li>
                                ))}

                                {/* 관리자 메뉴 섹션 */}
                                <li className="pt-4 mt-4 border-t border-gray-100">
                                    <div className="px-5 mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">관리자 메뉴</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onAdminClick();
                                        }}
                                        className="w-full text-left px-5 py-4 text-lg font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-2xl transition-all flex items-center gap-3"
                                    >
                                        <span>📊</span>
                                        <span>이용현황 및 회원관리</span>
                                    </button>
                                </li>
                            </ul>

                            <div className="p-4 text-center">
                                <p className="text-xs text-gray-300">디지털 보약 v1.0.0</p>
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            {/* 검색 모달 */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100]">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setSearchOpen(false)}
                    ></div>
                    <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-xl animate-slide-down">
                        <div className="max-w-lg mx-auto flex items-center gap-3">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="무엇을 찾으시나요?"
                                    className="w-full pl-12 pr-4 py-3 text-lg border-2 border-orange-300 rounded-full focus:border-orange-500 focus:outline-none"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="p-2 text-gray-600 hover:text-orange-500"
                            >
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-down {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
        </>
    );
};

export default Header;
