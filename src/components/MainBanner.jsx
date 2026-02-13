/**
 * 메인 배너 컴포넌트
 * - 보약이 캐릭터 로고 이미지 (원형 배경)
 * - 환영 메시지 (로고와 함께 가운데 정렬)
 */
const MainBanner = () => {
    return (
        <div className="mx-4 mt-2 rounded-3xl bg-gradient-to-r from-amber-100 to-orange-100 p-5 shadow-sm">
            {/* 로고 + 텍스트 그룹 - 전체 가운데 정렬 */}
            <div className="flex items-center justify-center gap-4">
                {/* 보약이 캐릭터 이미지 - 원형 배경 */}
                <div className="flex-shrink-0">
                    <div className="w-36 h-36 flex items-center justify-center">
                        <img
                            src="/boyaki.png"
                            alt="보약이 캐릭터"
                            className="w-32 h-32 object-contain"
                            style={{ mixBlendMode: 'multiply' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                        {/* 폴백 이모지 */}
                        <div className="w-32 h-32 items-center justify-center text-7xl hidden">
                            🍯
                        </div>
                    </div>
                </div>

                {/* 환영 메시지 */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-orange-500 mb-1">
                        디지털 보약
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        디지털보약 한 첩으로<br />
                        생활이 편리하고 행복해져요
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainBanner;
