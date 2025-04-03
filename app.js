document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
});

function fetchWeatherData() {
    const apiUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Applegate?unitGroup=us&key=85DUYUNBCSCAENRTSQNQXVZPY&contentType=json';
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.loading').style.display = 'none';
            displayWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.querySelector('.loading').style.display = 'none';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = 'Unable to load weather data. Please try again later.';
            document.querySelector('.app-container').appendChild(errorDiv);
        });
}

function displayWeatherData(data) {
    // Extract current weather data
    const current = data.currentConditions;
    const location = data.resolvedAddress;
    
    // Set location and date
    document.querySelector('.location').textContent = location.split(',')[0]; // Just the city name
    document.querySelector('.date').textContent = formatDate(new Date());
    
    // Set temperature and weather description
    document.querySelector('.temperature').textContent = Math.round(current.temp) + '°';
    document.querySelector('.weather-description').textContent = current.conditions;
    
    // Set weather icon
    const iconUrl = getWeatherIcon(current.icon);
    document.querySelector('.weather-icon').src = iconUrl;
    
    // Set details
    document.querySelector('.feels-like').textContent = Math.round(current.feelslike) + '°';
    document.querySelector('.humidity').textContent = current.humidity + '%';
    document.querySelector('.wind').textContent = Math.round(current.windspeed) + ' mph';
    
    // Set forecast
    const forecastContainer = document.querySelector('.forecast');
    forecastContainer.innerHTML = ''; // Clear existing forecast
    
    // Loop through next 5 days of forecast
    const daysToShow = Math.min(5, data.days.length - 1); // Skip today, show next 5 days
    for (let i = 1; i <= daysToShow; i++) {
        const day = data.days[i];
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        
        forecastDay.innerHTML = `
            <div class="forecast-date">${formatDayName(new Date(day.datetime))}</div>
            <img src="${getWeatherIcon(day.icon)}" class="forecast-icon" alt="Forecast">
            <div class="forecast-temp">${Math.round(day.tempmax)}° / ${Math.round(day.tempmin)}°</div>
        `;
        
        forecastContainer.appendChild(forecastDay);
    }
    
    // Apply theme based on current weather conditions and time
    applyWeatherTheme(current.icon, current.sunrise, current.sunset, current.datetime);
}

function formatDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getWeatherIcon(condition) {
    // Map condition codes to icon paths
    // For GitHub hosting we'll use placeholder images
    // In a more complete version, you'd use actual weather icons
    return `https://via.placeholder.com/120/87CEEB/FFFFFF?text=${condition}`;
}

function applyWeatherTheme(condition, sunrise, sunset, currentTime) {
    let themeClass = '';
    const body = document.body;
    const appContainer = document.querySelector('.app-container');
    
    // Remove any existing theme classes
    body.className = '';
    
    // Clear any existing effects
    const existingEffects = document.querySelectorAll('.rain-drops, .snow-flakes, .lightning');
    existingEffects.forEach(effect => effect.remove());
    
    // Determine if it's day or night for clear conditions
    const isNight = isNightTime(sunrise, sunset, currentTime);
    
    // Set theme based on weather condition
    switch (condition) {
        case 'clear-day':
            themeClass = 'theme-clear-day';
            break;
        case 'clear-night':
            themeClass = 'theme-clear-night';
            addStars();
            break;
        case 'partly-cloudy-day':
            themeClass = 'theme-clear-day';
            addClouds(3);
            break;
        case 'partly-cloudy-night':
            themeClass = 'theme-clear-night';
            addClouds(3);
            addStars();
            break;
        case 'cloudy':
            themeClass = 'theme-cloudy';
            addClouds(6);
            break;
        case 'rain':
        case 'showers-day':
        case 'showers-night':
            themeClass = 'theme-rain';
            addRain();
            break;
        case 'thunder-rain':
        case 'thunder-showers-day':
        case 'thunder-showers-night':
        case 'thunder':
            themeClass = 'theme-thunderstorm';
            addRain();
            addLightning();
            break;
        case 'snow':
        case 'snow-showers-day':
        case 'snow-showers-night':
            themeClass = 'theme-snow';
            addSnow();
            break;
        default:
            // Default to clear day/night based on time
            themeClass = isNight ? 'theme-clear-night' : 'theme-clear-day';
            if (isNight) addStars();
    }
    
    body.classList.add(themeClass);
}

function isNightTime(sunrise, sunset, currentTime) {
    // Convert times to comparable format
    const now = new Date(currentTime).getTime();
    const sunriseTime = new Date(sunrise).getTime();
    const sunsetTime = new Date(sunset).getTime();
    
    return now < sunriseTime || now > sunsetTime;
}

function addRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-drops';
    document.querySelector('.app-container').appendChild(rainContainer);
    
    const containerWidth = rainContainer.offsetWidth;
    
    // Create rain drops
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        
        // Random positioning
        const left = Math.random() * containerWidth;
        const animationDuration = 0.5 + Math.random() * 0.5; // Between 0.5 and 1s
        const animationDelay = Math.random() * 2; // Between 0 and 2s
        
        drop.style.left = `${left}px`;
        drop.style.animation = `rainFall ${animationDuration}s linear infinite ${animationDelay}s`;
        drop.style.opacity = 0.5 + Math.random() * 0.5;
        
        rainContainer.appendChild(drop);
    }
}

function addSnow() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-flakes';
    document.querySelector('.app-container').appendChild(snowContainer);
    
    const containerWidth = snowContainer.offsetWidth;
    
    // Create snowflakes
    for (let i = 0; i < 40; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        
        // Random flake size
        const size = 3 + Math.random() * 5;
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        
        // Random positioning
        const left = Math.random() * containerWidth;
        const animationDuration = 3 + Math.random() * 5; // Between 3 and 8s
        const animationDelay = Math.random() * 5; // Between 0 and 5s
        
        flake.style.left = `${left}px`;
        flake.style.opacity = 0.7 + Math.random() * 0.3;
        flake.style.animation = `snowFall ${animationDuration}s linear infinite ${animationDelay}s`;
        
        snowContainer.appendChild(flake);
    }
}

function addLightning() {
    const lightningContainer = document.createElement('div');
    lightningContainer.className = 'lightning';
    document.querySelector('.app-container').appendChild(lightningContainer);
    
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    lightningContainer.appendChild(flash);
    
    // Create lightning flashes at random intervals
    setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance of lightning
            flash.style.opacity = 0.8;
            setTimeout(() => { flash.style.opacity = 0; }, 100);
            setTimeout(() => { 
                if (Math.random() > 0.5) { // 50% chance of secondary flash
                    flash.style.opacity = 0.6;
                    setTimeout(() => { flash.style.opacity = 0; }, 80);
                }
            }, 200);
        }
    }, 3000);
}

function addClouds(count) {
    // This would be a more advanced feature requiring SVG or complex CSS
    // For simplicity, it's not fully implemented in this version
    console.log(`Would add ${count} clouds in a more complete implementation`);
}

function addStars() {
    // This would add star-like elements to a night theme
    // For simplicity, it's not fully implemented in this version
    console.log("Would add stars in a more complete implementation");
}