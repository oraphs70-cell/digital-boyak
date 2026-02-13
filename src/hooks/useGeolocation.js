import { useState, useEffect } from 'react';

/**
 * 사용자의 현재 위치를 가져오는 커스텀 훅
 */
const useGeolocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        address: '위치 확인 중...',
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: '이 브라우저에서는 위치 서비스를 지원하지 않습니다.',
                loading: false,
                address: '위치 서비스 불가',
            }));
            return;
        }

        const successHandler = async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Kakao 지도 API를 사용한 역지오코딩 (선택사항)
                // 또는 간단한 주소로 대체
                const address = await reverseGeocode(latitude, longitude);

                setLocation({
                    latitude,
                    longitude,
                    address,
                    error: null,
                    loading: false,
                });
            } catch (error) {
                setLocation({
                    latitude,
                    longitude,
                    address: '충남 천안시 불당동', // 기본 주소
                    error: null,
                    loading: false,
                });
            }
        };

        const errorHandler = (error) => {
            let errorMessage = '위치를 가져올 수 없습니다.';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '위치 권한이 거부되었습니다.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '위치 정보를 사용할 수 없습니다.';
                    break;
                case error.TIMEOUT:
                    errorMessage = '위치 요청 시간이 초과되었습니다.';
                    break;
                default:
                    errorMessage = '알 수 없는 오류가 발생했습니다.';
            }

            setLocation({
                latitude: null,
                longitude: null,
                address: '충남 천안시 불당동', // 기본 주소
                error: errorMessage,
                loading: false,
            });
        };

        navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5분 캐시
        });
    }, []);

    return location;
};

/**
 * 좌표를 주소로 변환하는 함수 (역지오코딩)
 * 실제 운영에서는 Kakao Maps API 또는 네이버 지도 API 사용 권장
 */
const reverseGeocode = async (latitude, longitude) => {
    try {
        // OpenStreetMap Nominatim API 사용 (무료)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ko`
        );
        const data = await response.json();

        if (data.address) {
            const { city, county, town, village, suburb, road } = data.address;
            const parts = [city || county, town || village || suburb].filter(Boolean);
            return parts.join(' ') || '충남 천안시 불당동';
        }

        return '충남 천안시 불당동';
    } catch (error) {
        console.error('역지오코딩 실패:', error);
        return '충남 천안시 불당동';
    }
};

export default useGeolocation;
