import { useState, useEffect } from 'react';
import { getAllButtonStats, getTotalClicks, resetAllStats, getAllUserProfiles } from '../api/baserow';

/**
 * 서비스 이용현황 대시보드 컴포넌트
 */
const Dashboard = ({ onClose }) => {
    const [activeView, setActiveView] = useState('stats'); // 'stats' or 'users'
    const [stats, setStats] = useState([]);
    const [users, setUsers] = useState([]);
    const [totalClicks, setTotalClicks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);

    // 버튼 이름 한글 매핑
    const buttonNameMap = {
        'navigation': '🧭 길찾기',
        'hospital': '🏥 병원',
        'taxi': '🚕 택시',
        'health': '💚 건강',
        'stock': '📈 주식',
        'video': '🎬 동영상',
        'youtube': '📺 유튜브',
        'news': '📰 뉴스',
        'ai_assistant': '🤗 AI 비서',
        'sos_119': '🚨 119',
        'share': '🎁 공유',
    };

    // 버튼 색상 매핑
    const buttonColorMap = {
        'navigation': 'bg-gradient-to-r from-cyan-400 to-blue-500',
        'hospital': 'bg-gradient-to-r from-pink-400 to-rose-500',
        'taxi': 'bg-gradient-to-r from-yellow-400 to-amber-500',
        'health': 'bg-gradient-to-r from-green-400 to-emerald-500',
        'stock': 'bg-gradient-to-r from-indigo-400 to-indigo-500',
        'video': 'bg-gradient-to-r from-rose-400 to-red-500',
        'youtube': 'bg-gradient-to-r from-red-500 to-red-600',
        'news': 'bg-gradient-to-r from-gray-600 to-gray-700',
        'ai_assistant': 'bg-gradient-to-r from-amber-300 to-orange-400',
        'sos_119': 'bg-gradient-to-r from-red-400 to-red-600',
        'share': 'bg-gradient-to-r from-sky-400 to-blue-500',
    };

    const loadStats = async () => {
        setLoading(true);
        try {
            if (activeView === 'stats') {
                const data = await getAllButtonStats();
                const total = await getTotalClicks();
                setStats(data);
                setTotalClicks(total);
            } else {
                const userData = await getAllUserProfiles();
                setUsers(userData);
            }
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [activeView]);

    const handleReset = async () => {
        if (window.confirm('정말로 모든 이용 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            setResetting(true);
            try {
                await resetAllStats();
                await loadStats();
                alert('모든 통계가 초기화되었습니다.');
            } catch (error) {
                alert('초기화에 실패했습니다.');
            } finally {
                setResetting(false);
            }
        }
    };

    // 최대 클릭 수 (차트 비율 계산용)
    const maxClicks = Math.max(...stats.map(s => Number(s.click_count) || 0), 1);

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm transition-all animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-5 text-white flex-shrink-0 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span>📊</span> 서비스 이용현황
                            </h2>
                            <p className="text-sm text-white/80 mt-1">실시간 버튼 클릭 통계</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 탭 전환 */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveView('stats')}
                        className={`flex-1 py-3 font-bold text-sm transition-colors ${activeView === 'stats' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        📈 이용현황
                    </button>
                    <button
                        onClick={() => setActiveView('users')}
                        className={`flex-1 py-3 font-bold text-sm transition-colors ${activeView === 'users' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        👥 회원관리
                    </button>
                </div>

                {/* 콘텐츠 */}
                <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                    {loading && !resetting ? (
                        <div className="text-center py-20">
                            <div className="animate-spin text-4xl mb-4 text-orange-500 inline-block">⏳</div>
                            <p className="text-gray-500 font-medium">데이터를 불러오고 있습니다...</p>
                        </div>
                    ) : activeView === 'stats' ? (
                        /* 이용현황 뷰 */
                        stats.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="text-5xl mb-4">📭</div>
                                <p className="text-gray-500 font-bold text-lg">기록된 데이터가 없습니다.</p>
                            </div>
                        ) : (
                            <>
                                {/* 총 이용 횟수 */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 text-center border border-orange-100 shadow-inner overflow-hidden group">
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">전체 총 이용 횟수</p>
                                    <p className="text-5xl font-black text-orange-500">
                                        {totalClicks.toLocaleString()}
                                    </p>
                                </div>

                                {/* 버튼별 통계 리스트 */}
                                <div className="space-y-6 pb-4">
                                    {stats.map((item, index) => (
                                        <div key={item.id || index} className="group">
                                            <div className="flex items-center justify-between mb-2 px-1">
                                                <span className="text-base font-bold text-gray-700">
                                                    {buttonNameMap[item.button_name] || item.button_name}
                                                </span>
                                                <span className="text-sm font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                                                    {Number(item.click_count || 0).toLocaleString()}회
                                                </span>
                                            </div>
                                            <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                                                <div
                                                    className={`h-full ${buttonColorMap[item.button_name] || 'bg-gray-400'} rounded-full transition-all duration-1000`}
                                                    style={{ width: `${((Number(item.click_count) || 0) / maxClicks) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    ) : (
                        /* 회원관리 뷰 */
                        <div className="space-y-4 pb-4">
                            {users.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="text-5xl mb-4">👤</div>
                                    <p className="text-gray-500 font-bold">등록된 회원이 없습니다.</p>
                                </div>
                            ) : (
                                users.map((u) => (
                                    <div key={u.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors">
                                        <img src={u.photoURL} alt={u.name} className="w-12 h-12 rounded-full border-2 border-orange-50" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-gray-800 truncate">{u.name}</h4>
                                                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                                                    방문 {u.count}회
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{u.email}</p>
                                            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                <span>최근 접속: {u.last_login ? new Date(u.last_login).toLocaleString() : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* 하단 버튼 영역 */}
                <div className="p-4 bg-gray-50 border-t flex gap-3 flex-shrink-0">
                    <button
                        onClick={handleReset}
                        disabled={resetting || loading}
                        className="flex-1 py-4 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-sm"
                    >
                        {resetting ? (
                            <span className="animate-pulse">처리중...</span>
                        ) : (
                            <>
                                <span className="text-lg">🧨</span>
                                <span>초기화</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={loadStats}
                        disabled={loading || resetting}
                        className="flex-[1.5] py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-extrabold shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? (
                            <span className="animate-pulse">로딩중...</span>
                        ) : (
                            <>
                                <span className="text-lg">🔄</span>
                                <span>새로고침</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scale-up {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Dashboard;
