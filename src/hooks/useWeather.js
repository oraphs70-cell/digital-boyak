import { useState, useEffect } from 'react';

/**
 * OpenWeatherMap API를 사용해 날씨 정보를 가져오는 커스텀 훅
 */
const useWeather = (latitude, longitude) => {
    const [weather, setWeather] = useState({
        temp: null,
        description: '',
        icon: '',
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!latitude || !longitude) {
            // 위치 정보가 없으면 기본값 사용
            setWeather({
                temp: 5,
                description: '맑음',
                icon: '☀️',
                loading: false,
                error: null,
            });
            return;
        }

        const fetchWeather = async () => {
            try {
                // OpenWeatherMap API 키 (실제 운영에서는 환경변수로 관리)
                const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';

                if (API_KEY === 'demo') {
                    // 데모 모드: 기본 날씨 정보
                    setWeather({
                        temp: 5,
                        description: '맑음',
                        icon: '☀️',
                        loading: false,
                        error: null,
                    });
                    return;
                }

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${API_KEY}`
                );

                if (!response.ok) throw new Error('날씨 정보를 가져올 수 없습니다.');

                const data = await response.json();

                setWeather({
                    temp: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    icon: getWeatherEmoji(data.weather[0].icon),
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error('날씨 가져오기 실패:', error);
                setWeather({
                    temp: 5,
                    description: '맑음',
                    icon: '☀️',
                    loading: false,
                    error: error.message,
                });
            }
        };

        fetchWeather();
    }, [latitude, longitude]);

    return weather;
};

/**
 * 날씨 아이콘 코드를 이모지로 변환
 */
const getWeatherEmoji = (iconCode) => {
    const iconMap = {
        '01d': '☀️', // 맑음 (낮)
        '01n': '🌙', // 맑음 (밤)
        '02d': '⛅', // 구름조금 (낮)
        '02n': '☁️', // 구름조금 (밤)
        '03d': '☁️', // 구름많음
        '03n': '☁️',
        '04d': '☁️', // 흐림
        '04n': '☁️',
        '09d': '🌧️', // 소나기
        '09n': '🌧️',
        '10d': '🌦️', // 비 (낮)
        '10n': '🌧️', // 비 (밤)
        '11d': '⛈️', // 뇌우
        '11n': '⛈️',
        '13d': '❄️', // 눈
        '13n': '❄️',
        '50d': '🌫️', // 안개
        '50n': '🌫️',
    };

    return iconMap[iconCode] || '☀️';
};

export default useWeather;
