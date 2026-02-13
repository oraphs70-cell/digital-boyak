import { useState } from 'react';
import Header from './components/Header';
import MainBanner from './components/MainBanner';
import InfoBar from './components/InfoBar';
import FeatureGrid from './components/FeatureGrid';
import AIAssistantButton from './components/AIAssistantButton';
import BottomNavigation from './components/BottomNavigation';
import Dashboard from './components/Dashboard';
import AdminAuth from './components/AdminAuth';
import useGeolocation from './hooks/useGeolocation';
import useWeather from './hooks/useWeather';

/**
 * 디지털 보약 메인 앱
 * 시니어를 위한 스마트폰 도우미 앱
 */
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const location = useGeolocation();
  const weather = useWeather(location.latitude, location.longitude);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* 모바일 앱 컨테이너 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col relative my-8 pt-16">
        {/* 상단 헤더 */}
        <Header
          location={location}
          onAdminClick={() => setShowAdminAuth(true)}
        />

        {/* 메인 컨텐츠 */}
        <main className="pb-20 pt-4">
          {/* 메인 배너 - 보약이 캐릭터 */}
          <MainBanner />

          {/* AI 비서 버튼 - 상단으로 이동하여 밀리지 않도록 함 */}
          <div className="mt-6">
            <AIAssistantButton location={location} />
          </div>

          {/* 핵심 기능 그리드 */}
          <FeatureGrid location={location} />

          {/* 최근 소식 */}
          <section className="mx-4 mt-8 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
              <span>📢</span> 최근 소식
            </h3>
            <div className="space-y-3">
              <NoticeCard
                title="디지털 보약 사용법 안내"
                date="2026.02.09"
                isNew={true}
              />
              <NoticeCard
                title="2월 건강검진 안내"
                date="2026.02.05"
              />
              <NoticeCard
                title="시니어 스마트폰 교실 신청"
                date="2026.02.01"
              />
            </div>
          </section>
        </main>

        {/* 하단 네비게이션 - 하단 고정 */}
        <div className="sticky bottom-0 left-0 right-0 z-50 bg-white rounded-b-3xl">
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* 대시보드 모달 */}
      {showDashboard && (
        <Dashboard onClose={() => setShowDashboard(false)} />
      )}

      {/* 관리자 인증 모달 */}
      {showAdminAuth && (
        <AdminAuth
          onLogin={() => setShowDashboard(true)}
          onClose={() => setShowAdminAuth(false)}
        />
      )}
    </div>
  );
}

/**
 * 공지사항 카드 컴포넌트
 */
const NoticeCard = ({ title, date, isNew = false }) => (
  <button className="w-full bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl px-4 py-3 text-left flex items-center justify-between group hover:from-orange-100 hover:to-amber-100 transition-colors">
    <div className="flex items-center gap-3">
      {isNew && (
        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
          NEW
        </span>
      )}
      <span className="text-base text-gray-700 group-hover:text-orange-600 transition-colors">
        {title}
      </span>
    </div>
    <span className="text-sm text-gray-400">{date}</span>
  </button>
);

export default App;
