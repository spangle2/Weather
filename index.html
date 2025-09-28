// Global state to replace localStorage
const appState = {
    savedLocation: null,
    currentEffects: new Set(),
    intervals: new Set()
};

// Constants for better maintainability
const CONFIG = {
    API_KEY: '85DUYUNBCSCAENRTSQNQXVZPY',
    BASE_URL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
    STARS_COUNT: 150, // Reduced from 200 for better performance
    RAIN_DROPS: 40,   // Reduced from 50
    SNOW_FLAKES: 30,  // Reduced from 40
    FORECAST_DAYS: 5
};

// Weather icon mapping for better maintainability
const WEATHER_ICONS = {
    'clear-day': 'sun',
    'clear-night': 'moon',
    'partly-cloudy-day': 'cloud-sun',
    'partly-cloudy-night': 'cloud-moon',
    'cloudy': 'cloud',
    'rain': 'rain',
    'thunder': 'storm',
    'snow': 'snow'
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    createStars();
    setupLocationPrompt();
}

// Optimized star creation with fragment for better performance
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < CONFIG.STARS_COUNT; i++) {
        const star = createStar();
        fragment.appendChild(star);
    }
    
    starsContainer.appendChild(fragment);
}

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Optimized random values
    const size = 0.5 + Math.random() * 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = 2 + Math.random() * 4;
    const delay = Math.random() * 5;
    const brightness = 0.5 + Math.random() * 0.5;
    
    // Set styles in one go
    Object.assign(star.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${posX}%`,
        top: `${posY}%`
    });
    
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    star.style.setProperty('--brightness', brightness);
    
    return star;
}

function setupLocationPrompt() {
    const elements = {
        locationPrompt: document.querySelector('.location-prompt'),
        locationInput: document.getElementById('location-input'),
        searchButton: document.getElementById('search-button'),
        geolocationButton: document.getElementById('geolocation-button'),
        changeLocationButton: document.getElementById('change-location')
    };
    
    // Check if any required elements are missing
    if (!Object.values(elements).every(el => el)) {
        console.warn('Some UI elements not found');
        return;
    }
    
    // Check for saved location in memory
    if (appState.savedLocation) {
        fetchWeatherData(appState.savedLocation);
        toggleLocationUI(elements, false);
    }
    
    setupEventListeners(elements);
}

function setupEventListeners(elements) {
    const { locationPrompt, locationInput, searchButton, geolocationButton, changeLocationButton } = elements;
    
    // Search functionality
    const handleSearch = () => {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeatherData(location);
            toggleLocationUI(elements, false);
            appState.savedLocation = location;
        }
    };
    
    searchButton.addEventListener('click', handleSearch);
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Geolocation
    geolocationButton.addEventListener('click', handleGeolocation);
    
    // Change location
    changeLocationButton.addEventListener('click', () => {
        toggleLocationUI(elements, true);
        locationInput.value = '';
        locationInput.focus();
    });
}

function toggleLocationUI(elements, show) {
    const { locationPrompt, changeLocationButton } = elements;
    locationPrompt.style.display = show ? 'flex' : 'none';
    changeLocationButton.style.display = show ? 'none' : 'block';
}

function handleGeolocation() {
    if (!navigator.geolocation) {
        showAlert('Geolocation is not supported by your browser. Please enter your location manually.');
        return;
    }
    
    showLoading(true);
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude: lat, longitude: lon } = position.coords;
            fetchWeatherDataByCoords(lat, lon);
            const elements = {
                locationPrompt: document.querySelector('.location-prompt'),
                changeLocationButton: document.getElementById('change-location')
            };
            toggleLocationUI(elements, false);
        },
        (error) => {
            console.error('Geolocation error:', error);
            showAlert('Unable to get your location. Please enter it manually.');
            showLoading(false);
        }
    );
}

// Consolidated fetch functions
function fetchWeatherDataByCoords(lat, lon) {
    const url = `${CONFIG.BASE_URL}/${lat},${lon}?unitGroup=us&key=${CONFIG.API_KEY}&contentType=json`;
    fetchFromApi(url);
}

function fetchWeatherData(location) {
    const url = `${CONFIG.BASE_URL}/${encodeURIComponent(location)}?unitGroup=us&key=${CONFIG.API_KEY}&contentType=json`;
    fetchFromApi(url);
}

async function fetchFromApi(apiUrl) {
    showLoading(true);
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showLoading(false);
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Fetch error:', error);
        showLoading(false);
        showError('Unable to load weather data. Please try again later.');
    }
}

function displayWeatherData(data) {
    const current = data.currentConditions;
    const location = data.resolvedAddress;
    
    updateCurrentWeather(current, location);
    updateForecast(data.days);
    applyWeatherTheme(current);
}

function updateCurrentWeather(current, location) {
    const updates = {
        '.location': location.split(',')[0],
        '.date': formatDate(new Date()),
        '.temperature': `${Math.round(current.temp)}°`,
        '.weather-description': current.conditions,
        '.feels-like': `${Math.round(current.feelslike)}°`,
        '.humidity': `${current.humidity}%`,
        '.wind': `${Math.round(current.windspeed)} mph`
    };
    
    // Update all elements efficiently
    Object.entries(updates).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value;
    });
    
    // Update weather icon
    const iconElement = document.querySelector('.weather-icon');
    if (iconElement) {
        iconElement.src = getWeatherIcon(current.icon);
        iconElement.alt = current.conditions;
    }
}

function updateForecast(days) {
    const forecastContainer = document.querySelector('.forecast');
    if (!forecastContainer) return;
    
    forecastContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    const daysToShow = Math.min(CONFIG.FORECAST_DAYS, days.length - 1);
    
    for (let i = 1; i <= daysToShow; i++) {
        const day = days[i];
        const forecastDay = createForecastDay(day);
        fragment.appendChild(forecastDay);
    }
    
    forecastContainer.appendChild(fragment);
}

function createForecastDay(day) {
    const forecastDay = document.createElement('div');
    forecastDay.className = 'forecast-day';
    
    forecastDay.innerHTML = `
        <div class="forecast-date">${formatDayName(new Date(day.datetime))}</div>
        <img src="${getWeatherIcon(day.icon)}" class="forecast-icon" alt="${day.conditions}" loading="lazy">
        <div class="forecast-temp">${Math.round(day.tempmax)}° / ${Math.round(day.tempmin)}°</div>
    `;
    
    return forecastDay;
}

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getWeatherIcon(condition) {
    const iconName = WEATHER_ICONS[condition] || condition;
    return `https://via.placeholder.com/120/87CEEB/FFFFFF?text=${iconName}`;
}

function showLoading(show) {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

function showAlert(message) {
    alert(message); // In production, use a custom modal
}

function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.appendChild(errorDiv);
}

// Weather theme and effects
function applyWeatherTheme(current) {
    cleanupEffects();
    
    const body = document.body;
    body.className = '';
    
    const isNight = isNightTime(current.sunrise, current.sunset, current.datetime);
    const themeClass = getThemeClass(current.icon, isNight);
    
    body.classList.add(themeClass);
    applyWeatherEffects(current.icon, isNight);
}

function getThemeClass(condition, isNight) {
    const themeMap = {
        'clear-day': 'theme-clear-day',
        'clear-night': 'theme-clear-night',
        'partly-cloudy-day': 'theme-clear-day',
        'partly-cloudy-night': 'theme-clear-night',
        'cloudy': 'theme-cloudy',
        'rain': 'theme-rain',
        'thunder': 'theme-thunderstorm',
        'snow': 'theme-snow'
    };
    
    return themeMap[condition] || (isNight ? 'theme-clear-night' : 'theme-clear-day');
}

function applyWeatherEffects(condition, isNight) {
    const effects = {
        'rain': () => addRain(),
        'thunder': () => { addRain(); addLightning(); },
        'snow': () => addSnow(),
        'partly-cloudy-night': () => addStars(),
        'clear-night': () => addStars()
    };
    
    const effect = effects[condition];
    if (effect) effect();
    else if (isNight) addStars();
}

function cleanupEffects() {
    // Clear existing effects
    const effectSelectors = ['.rain-drops', '.snow-flakes', '.lightning'];
    effectSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });
    
    // Clear intervals
    appState.intervals.forEach(id => clearInterval(id));
    appState.intervals.clear();
}

function isNightTime(sunrise, sunset, currentTime) {
    const now = new Date(currentTime).getTime();
    const sunriseTime = new Date(sunrise).getTime();
    const sunsetTime = new Date(sunset).getTime();
    
    return now < sunriseTime || now > sunsetTime;
}

// Weather effect functions
function addRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-drops';
    
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;
    
    appContainer.appendChild(rainContainer);
    
    // Use setTimeout to ensure container is rendered
    setTimeout(() => {
        const containerWidth = rainContainer.offsetWidth || window.innerWidth;
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < CONFIG.RAIN_DROPS; i++) {
            const drop = createRainDrop(containerWidth);
            fragment.appendChild(drop);
        }
        
        rainContainer.appendChild(fragment);
    }, 10);
}

function createRainDrop(containerWidth) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    
    const left = Math.random() * containerWidth;
    const duration = 0.5 + Math.random() * 0.5;
    const delay = Math.random() * 2;
    const opacity = 0.5 + Math.random() * 0.5;
    
    Object.assign(drop.style, {
        left: `${left}px`,
        animation: `rainFall ${duration}s linear infinite ${delay}s`,
        opacity: opacity
    });
    
    return drop;
}

function addSnow() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-flakes';
    
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;
    
    appContainer.appendChild(snowContainer);
    
    setTimeout(() => {
        const containerWidth = snowContainer.offsetWidth || window.innerWidth;
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < CONFIG.SNOW_FLAKES; i++) {
            const flake = createSnowFlake(containerWidth);
            fragment.appendChild(flake);
        }
        
        snowContainer.appendChild(fragment);
    }, 10);
}

function createSnowFlake(containerWidth) {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';
    
    const size = 3 + Math.random() * 5;
    const left = Math.random() * containerWidth;
    const duration = 3 + Math.random() * 5;
    const delay = Math.random() * 5;
    const opacity = 0.7 + Math.random() * 0.3;
    
    Object.assign(flake.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}px`,
        opacity: opacity,
        animation: `snowFall ${duration}s linear infinite ${delay}s`
    });
    
    return flake;
}

function addLightning() {
    const lightningContainer = document.createElement('div');
    lightningContainer.className = 'lightning';
    
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;
    
    appContainer.appendChild(lightningContainer);
    
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    lightningContainer.appendChild(flash);
    
    // Lightning animation
    const lightningInterval = setInterval(() => {
        if (Math.random() > 0.8) {
            flash.style.opacity = '0.8';
            setTimeout(() => { flash.style.opacity = '0'; }, 100);
            
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    flash.style.opacity = '0.6';
                    setTimeout(() => { flash.style.opacity = '0'; }, 80);
                }
            }, 200);
        }
    }, 3000);
    
    appState.intervals.add(lightningInterval);
}

function addStars() {
    // Stars are already created in the background
    console.log("Background stars are already active");
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    cleanupEffects();
});
