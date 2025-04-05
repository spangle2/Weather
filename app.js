document.addEventListener('DOMContentLoaded', () => {
    // Create stars in the background
    createStars();

    // Setup event listeners
    setupLocationPrompt();
});

function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 200;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random star size (0.5px to 2.5px)
        const size = 0.5 + Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        // Random animation duration and delay
        const duration = 2 + Math.random() * 4;
        const delay = Math.random() * 5;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `${delay}s`);
        
        // Random brightness
        const brightness = 0.5 + Math.random() * 0.5;
        star.style.setProperty('--brightness', brightness);
        
        starsContainer.appendChild(star);
    }
}

function setupLocationPrompt() {
    const locationPrompt = document.querySelector('.location-prompt');
    const locationInput = document.getElementById('location-input');
    const searchButton = document.getElementById('search-button');
    const geolocationButton = document.getElementById('geolocation-button');
    const changeLocationButton = document.getElementById('change-location');
    
    // Check if there's a saved location in localStorage
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
        fetchWeatherData(savedLocation);
        locationPrompt.style.display = 'none';
        changeLocationButton.style.display = 'block';
    }
    
    // Search button click event
    searchButton.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeatherData(location);
            locationPrompt.style.display = 'none';
            changeLocationButton.style.display = 'block';
            localStorage.setItem('weatherLocation', location);
        }
    });
    
    // Enter key in input field
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // Geolocation button click event
    geolocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            document.querySelector('.loading').style.display = 'flex';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeatherDataByCoords(lat, lon);
                    locationPrompt.style.display = 'none';
                    changeLocationButton.style.display = 'block';
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enter it manually.');
                    document.querySelector('.loading').style.display = 'none';
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please enter your location manually.');
        }
    });
    
    // Change location button click event
    changeLocationButton.addEventListener('click', () => {
        locationPrompt.style.display = 'flex';
        locationInput.value = '';
        locationInput.focus();
    });
}

function fetchWeatherDataByCoords(lat, lon) {
    const apiKey = '85DUYUNBCSCAENRTSQNQXVZPY'; // Replace with your actual API key
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=us&key=${apiKey}&contentType=json`;
    
    fetchFromApi(apiUrl);
}

function fetchWeatherData(location) {
    const apiKey = '85DUYUNBCSCAENRTSQNQXVZPY'; // Replace with your actual API key
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=us&key=${apiKey}&contentType=json`;
    
    fetchFromApi(apiUrl);
}

function fetchFromApi(apiUrl) {
    document.querySelector('.loading').style.display = 'flex';
    
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
    
    // Determine time of day with more granularity
    const timeOfDay = getTimeOfDay(sunrise, sunset, currentTime);
    
    // Set theme based on weather condition and time of day
    switch (condition) {
        case 'clear-day':
            themeClass = getTimeBasedTheme(timeOfDay);
            break;
        case 'clear-night':
            themeClass = getTimeBasedTheme(timeOfDay);
            addStars();
            break;
        case 'partly-cloudy-day':
            themeClass = getTimeBasedTheme(timeOfDay);
            addClouds(3);
            break;
        case 'partly-cloudy-night':
            themeClass = getTimeBasedTheme(timeOfDay);
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
            // Default to time-based theme
            themeClass = getTimeBasedTheme(timeOfDay);
            if (timeOfDay === 'night' || timeOfDay === 'late-night') addStars();
    }
    
    body.classList.add(themeClass);
}

function getTimeOfDay(sunrise, sunset, currentTime) {
    // Convert times to comparable format
    const now = new Date(currentTime);
    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);
    
    // Calculate sunrise and sunset +/- 1 hour for transition periods
    const sunriseStart = new Date(sunriseTime);
    sunriseStart.setHours(sunriseTime.getHours() - 1);
    
    const sunriseEnd = new Date(sunriseTime);
    sunriseEnd.setHours(sunriseTime.getHours() + 1);
    
    const sunsetStart = new Date(sunsetTime);
    sunsetStart.setHours(sunsetTime.getHours() - 1);
    
    const sunsetEnd = new Date(sunsetTime);
    sunsetEnd.setHours(sunsetTime.getHours() + 1);
    
    // Get midnight points
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    
    const midnightEnd = new Date(midnight);
    midnightEnd.setHours(4, 0, 0, 0);
    
    const midnightStart = new Date(midnight);
    midnightStart.setHours(22, 0, 0, 0);
    
    // Determine time of day
    if (now >= sunriseStart && now <= sunriseEnd) {
        return 'sunrise';
    } else if (now >= sunsetStart && now <= sunsetEnd) {
        return 'sunset';
    } else if ((now >= midnightStart || now <= midnightEnd)) {
        return 'late-night';
    } else if (now > sunriseEnd && now < sunsetStart) {
        return 'day';
    } else {
        return 'night';
    }
}

function getTimeBasedTheme(timeOfDay) {
    switch (timeOfDay) {
        case 'sunrise':
            return 'theme-sunrise';
        case 'sunset':
            return 'theme-sunset';
        case 'day':
            return 'theme-clear-day';
        case 'night':
            return 'theme-clear-night';
        case 'late-night':
            return 'theme-midnight';
        default:
            return 'theme-clear-day';
    }
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
        flake.style.left = `${left}px`;
        
        // Random animation duration and delay
        const animationDuration = 5 + Math.random() * 7; // Between 5 and 12s
        const animationDelay = Math.random() * 5; // Between 0 and 5s
        
        flake.style.animation = `snowFall ${animationDuration}s linear infinite ${animationDelay}s`;
        flake.style.opacity = 0.7 + Math.random() * 0.3;
        
        snowContainer.appendChild(flake);
    }
}

function addClouds(count) {
    // This function will add cloud elements to the scene
    // First create a container for clouds
    const cloudContainer = document.createElement('div');
    cloudContainer.className = 'clouds';
    cloudContainer.style.position = 'absolute';
    cloudContainer.style.top = '0';
    cloudContainer.style.left = '0';
    cloudContainer.style.width = '100%';
    cloudContainer.style.height = '100%';
    cloudContainer.style.zIndex = '1';
    cloudContainer.style.pointerEvents = 'none';
    document.querySelector('.app-container').appendChild(cloudContainer);
    
    // Create cloud SVGs
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.position = 'absolute';
        
        // Different cloud sizes
        const scale = 0.5 + Math.random() * 0.8;
        
        // Different positions
        const top = Math.random() * 40; // Top 40% of the container
        const left = Math.random() * 100;
        
        cloud.style.top = `${top}%`;
        cloud.style.left = `${left}%`;
        cloud.style.transform = `scale(${scale})`;
        cloud.style.opacity = 0.7 + Math.random() * 0.3;
        
        // Create cloud shape using CSS
        cloud.style.width = '100px';
        cloud.style.height = '60px';
        cloud.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        cloud.style.borderRadius = '50px';
        cloud.style.boxShadow = '0 8px 5px rgba(0, 0, 0, 0.1)';
        cloud.style.position = 'relative';
        
        // Add cloud elements (circles) to create fluffy appearance
        const positions = [
            { top: '-20px', left: '10px', width: '60px', height: '60px' },
            { top: '-30px', left: '45px', width: '70px', height: '70px' },
            { top: '-20px', left: '75px', width: '60px', height: '60px' }
        ];
        
        positions.forEach(pos => {
            const circle = document.createElement('div');
            circle.style.position = 'absolute';
            circle.style.top = pos.top;
            circle.style.left = pos.left;
            circle.style.width = pos.width;
            circle.style.height = pos.height;
            circle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            circle.style.borderRadius = '50%';
            cloud.appendChild(circle);
        });
        
        // Add slow animation
        const duration = 60 + Math.random() * 60; // Between 60 and 120s
        const delay = Math.random() * 30; // Between 0 and 30s
        
        cloud.style.animation = `cloudFloat ${duration}s linear infinite ${delay}s`;
        
        cloudContainer.appendChild(cloud);
    }
    
    // Add keyframes for cloud animation
    if (!document.getElementById('cloud-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cloud-keyframes';
        style.textContent = `
            @keyframes cloudFloat {
                0% { transform: translateX(-150px) scale(${scale}); }
                100% { transform: translateX(calc(100vw + 150px)) scale(${scale}); }
            }
        `;
        document.head.appendChild(style);
    }
}

function addStars() {
    // Since we already have stars created, we'll just make them more visible
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.style.setProperty('--brightness', '1'); // Make stars fully bright
    });
    
    // Add a few shooting stars
    // const starsContainer = document.querySelector('.stars');
    
    for (let i = 0; i < 3; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        shootingStar.style.position = 'absolute';
        shootingStar.style.width = '2px';
        shootingStar.style.height = '80px';
        shootingStar.style.backgroundColor = 'white';
        shootingStar.style.borderRadius = '50%';
        shootingStar.style.boxShadow = '0 0 10px 5px rgba(255, 255, 255, 0.3)';
        
        // Random position
        const top = Math.random() * 30; // Top 30% of screen
        const left = Math.random() * 100;
        shootingStar.style.top = `${top}%`;
        shootingStar.style.left = `${left}%`;
        
        // Random angle
        const angle = 30 + Math.random() * 30; // Between 30 and 60 degrees
        shootingStar.style.transform = `rotate(${angle}deg)`;
        
        // Animation
        const delay = 3 + Math.random() * 10; // Between 3 and 13s
        const duration = 0.6 + Math.random() * 0.4; // Between 0.6 and 1s
        
        shootingStar.style.animation = `shootingStar ${duration}s ease-in ${delay}s infinite`;
        
        starsContainer.appendChild(shootingStar);
    }
    
    // Add keyframes for shooting star animation
    if (!document.getElementById('shooting-star-keyframes')) {
        const style = document.createElement('style');
        style.id = 'shooting-star-keyframes';
        style.textContent = `
            @keyframes shootingStar {
                0% {
                    opacity: 0;
                    transform: rotate(var(--angle)) translateX(0);
                }
                10% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: rotate(var(--angle)) translateX(200px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function addLightning() {
    const container = document.createElement('div');
    container.className = 'lightning';
    document.querySelector('.app-container').appendChild(container);
    
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    container.appendChild(flash);
    
    // Set up lightning flash frequency
    function triggerLightning() {
        // Random opacity for the flash
        const intensity = 0.7 + Math.random() * 0.3;
        flash.style.opacity = intensity;
        
        // Flash duration
        setTimeout(() => {
            flash.style.opacity = 0;
        }, 100 + Math.random() * 100); // Flash lasts between 100-200ms
        
        // Sometimes do a double flash
        if (Math.random() > 0.6) {
            setTimeout(() => {
                flash.style.opacity = intensity * 0.8;
                setTimeout(() => {
                    flash.style.opacity = 0;
                }, 50 + Math.random() * 50);
            }, 150 + Math.random() * 100);
        }
        
        // Schedule next lightning
        const nextLightning = 3000 + Math.random() * 10000; // Between 3-13 seconds
        setTimeout(triggerLightning, nextLightning);
    }
    
    // Initial delay before first lightning
    const initialDelay = 1000 + Math.random() * 3000;
    setTimeout(triggerLightning, initialDelay);
}