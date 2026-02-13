import { createContext, useContext, useEffect, useState } from 'react';
import { getOrSaveUserProfile, logButtonClickToBaserow } from '../api/baserow';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 구글 로그인 (ID 토큰 방식 - 더 안정적임)
    const loginWithGoogle = async () => {
        return new Promise((resolve, reject) => {
            try {
                console.log('🚀 [Google Login] 인증 시작...');

                if (!window.google || !window.google.accounts) {
                    alert('구글 도구를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '906056559618-qnkp2kttiahbd3epg0l3k3h39fn6qhfg.apps.googleusercontent.com',
                    callback: async (response) => {
                        console.log('📩 [Google Login] 응답 수신');

                        try {
                            // ID 토큰(JWT) 해독하여 사용자 정보 추출
                            const base64Url = response.credential.split('.')[1];
                            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join(''));

                            const googleUser = JSON.parse(jsonPayload);
                            console.log('✅ [Google Login] 성공:', googleUser.name);

                            const userData = {
                                id: googleUser.sub,
                                name: googleUser.name,
                                email: googleUser.email,
                                photoURL: googleUser.picture
                            };

                            const savedUser = await getOrSaveUserProfile(userData);
                            setUser(savedUser);
                            localStorage.setItem('boyak_user', JSON.stringify(savedUser));
                            resolve(savedUser);
                        } catch (err) {
                            console.error('❌ [Google Login] 처리 에러:', err);
                            reject(err);
                        }
                    },
                    auto_select: false,
                    ux_mode: 'popup'
                });

                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed()) {
                        console.warn('⚠️ [Google Login] 원탭 팝업이 표시되지 않음. 일반 팝업 시도...');
                    }
                });

            } catch (error) {
                console.error('❌ [Google Login] 초기화 에러:', error);
                reject(error);
            }
        });
    };

    // 로그아웃
    const logout = async () => {
        setUser(null);
        localStorage.removeItem('boyak_user');
    };

    // 버튼 클릭 횟수 기록 (Baserow 연동)
    const logClickToDb = async (buttonId) => {
        if (!user) return;
        try {
            await logButtonClickToBaserow(buttonId, user.id);
            console.log(`✅ [Baserow] ${buttonId} 기록 완료 (사용자: ${user.id})`);
        } catch (error) {
            console.error('❌ [Baserow] 기록 실패:', error);
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('boyak_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const value = {
        user,
        loading,
        loginWithGoogle,
        logout,
        logClickToDb
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
