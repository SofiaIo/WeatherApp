document.addEventListener('DOMContentLoaded', () => {
    // Демо-ключ OpenWeatherMap 
    const apiKey = '439d4b804bc8187953eb36d2a8c26a02'; 
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherResult = document.getElementById('weather-result');

    // Получение погоды
    async function getWeather(city) {
        try {
            weatherResult.innerHTML = '<div>Загрузка...</div>';
            
            const response = await fetch(
                `https://openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}&lang=ru`
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Город не найден');
            }
            
            const data = await response.json();
            showWeather(data);
        } catch (error) {
            weatherResult.innerHTML = `
                <div class="error">
                    Ошибка: ${error.message || 'Не удалось получить данные'}<br>
                    Попробуйте: London, Paris, Berlin
                </div>
            `;
            console.error('Ошибка запроса:', error);
        }
    }

    // Отображение погоды
    function showWeather(data) {
        const cityName = data.name;
        const country = data.sys.country;
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed);
        const weatherIcon = data.weather[0].icon;
        const description = data.weather[0].description;

        weatherResult.innerHTML = `
            <div class="city">${cityName}, ${country}</div>
            <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${description}" class="weather-icon">
            <div class="temp">${temp}°C</div>
            <div class="description">${description}</div>
            <div class="details">
                <div class="detail">
                    <div>Ощущается</div>
                    <div><strong>${feelsLike}°C</strong></div>
                </div>
                <div class="detail">
                    <div>Влажность</div>
                    <div><strong>${humidity}%</strong></div>
                </div>
                <div class="detail">
                    <div>Ветер</div>
                    <div><strong>${windSpeed} м/с</strong></div>
                </div>
            </div>
        `;
    }

    // Поиск по кнопке
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    });

    // Поиск по Enter
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
            }
        }
    });

    // Загрузка погоды для Москвы по умолчанию
    getWeather('Moscow');
});