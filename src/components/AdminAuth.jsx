import { useState } from 'react';

/**
 * 관리자 인증 모달 컴포넌트
 */
const AdminAuth = ({ onLogin, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 간단한 비밀번호 확인 (예: 1234)
        if (password === '1234') {
            onLogin();
            onClose();
        } else {
            setError('비밀번호가 틀렸습니다.');
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 text-white text-center">
                    <div className="text-4xl mb-2">🔐</div>
                    <h2 className="text-xl font-bold">관리자 로그인</h2>
                    <p className="text-sm text-white/70 mt-1">비밀번호를 입력해주세요</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 입력"
                        className="w-full px-5 py-4 text-xl text-center border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:outline-none transition-all mb-4"
                        autoFocus
                    />

                    {error && (
                        <p className="text-red-500 text-center mb-4 text-sm font-medium">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all"
                        >
                            확인
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AdminAuth;
