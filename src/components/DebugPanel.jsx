import { logButtonClickToBaserow } from '../api/baserow';

const DebugPanel = () => {
    const testClick = async () => {
        console.log('🧪 테스트 클릭 시작...');
        try {
            await logButtonClickToBaserow('test_button');
            alert('성공! Baserow를 확인해보세요.');
        } catch (err) {
            console.error('🧪 테스트 클릭 실패:', err);
            alert('실패: ' + err.message);
        }
    };

    return (
        <div className="fixed top-20 left-4 z-[300] bg-white p-2 rounded-lg shadow-xl border-2 border-red-500">
            <button
                onClick={testClick}
                className="bg-red-500 text-white px-4 py-2 rounded-md font-bold"
            >
                DB 테스트 버튼
            </button>
        </div>
    );
};

export default DebugPanel;
