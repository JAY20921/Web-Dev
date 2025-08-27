// Configuration
const CONFIG = {
  API_KEY: 'a3efd0f1899324c48cc0605d34b3a75f',
  BASE_URL: 'https://api.openweathermap.org/data/2.5/',
  UNITS: 'metric',
  DEFAULT_CITY: 'London'
};

// State management
const state = {
  currentWeather: null,
  forecast: null,
  isLoading: false,
  lastUpdate: null
};

// DOM Elements
const elements = {
  locationInput: document.getElementById('locationInput'),
  searchBtn: document.getElementById('searchBtn'),
  errorDisplay: document.getElementById('errorDisplay'),
  currentWeather: document.getElementById('currentWeather'),
  forecastSection: document.getElementById('forecastSection'),
  locationName: document.getElementById('locationName'),
  lastUpdated: document.getElementById('lastUpdated'),
  weatherIcon: document.getElementById('weatherIcon'),
  temperature: document.getElementById('temperature'),
  weatherDescription: document.getElementById('weatherDescription'),
  feelsLike: document.getElementById('feelsLike'),
  weatherStats: document.getElementById('weatherStats'),
  forecastContainer: document.getElementById('forecastContainer')
};

// Utility functions
const utils = {
  formatTime: (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatDate: (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  },

  capitalizeWords: (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Weather backgrounds
const weatherBackgrounds = {
  Clear: 'linear-gradient(135deg, #ff9a8b 0%, #fecfef 50%, #fecfef 100%)',
  Clouds: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  Rain: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  Drizzle: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  Thunderstorm: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  Snow: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  Mist: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
  Fog: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
  default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
};

// API functions
const api = {
  async fetchWeatherData(location) {
    const currentUrl = `${CONFIG.BASE_URL}weather?q=${encodeURIComponent(location)}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
    const forecastUrl = `${CONFIG.BASE_URL}forecast?q=${encodeURIComponent(location)}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

      if (!currentResponse.ok) {
        throw new Error(`Location "${location}" not found`);
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      return { currentData, forecastData };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch weather data');
    }
  },

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `${CONFIG.BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`
            );
            const data = await response.json();
            resolve(data.name);
          } catch (error) {
            reject(error);
          }
        },
        () => reject(new Error('Location access denied'))
      );
    });
  }
};

// UI functions
const ui = {
  showError(message) {
    elements.errorDisplay.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
      </div>
    `;
    elements.errorDisplay.style.display = 'block';
    elements.currentWeather.style.display = 'none';
    elements.forecastSection.style.display = 'none';
  },

  hideError() {
    elements.errorDisplay.style.display = 'none';
  },

  showLoading() {
    elements.searchBtn.innerHTML = '<div class="loading"></div>';
    state.isLoading = true;
  },

  hideLoading() {
    elements.searchBtn.innerHTML = '<i class="fas fa-search"></i>';
    state.isLoading = false;
  },

  updateBackground(weatherCondition) {
    const gradient = weatherBackgrounds[weatherCondition] || weatherBackgrounds.default;
    document.body.style.background = gradient;
  },

  renderCurrentWeather(data) {
    const { name, main, weather, wind, sys, visibility } = data;
    
    elements.locationName.textContent = name;
    elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    elements.weatherIcon.alt = weather[0].description;
    elements.temperature.textContent = `${Math.round(main.temp)}°`;
    elements.weatherDescription.textContent = utils.capitalizeWords(weather[0].description);
    elements.feelsLike.textContent = `Feels like ${Math.round(main.feels_like)}°C`;

    const stats = [
      { icon: 'fas fa-tint', label: 'Humidity', value: `${main.humidity}%` },
      { icon: 'fas fa-wind', label: 'Wind Speed', value: `${Math.round(wind.speed * 3.6)} km/h` },
      { icon: 'fas fa-compress-arrows-alt', label: 'Pressure', value: `${main.pressure} hPa` },
      { icon: 'fas fa-eye', label: 'Visibility', value: `${Math.round(visibility / 1000)} km` },
      { icon: 'fas fa-thermometer-three-quarters', label: 'Max Temp', value: `${Math.round(main.temp_max)}°C` },
      { icon: 'fas fa-thermometer-quarter', label: 'Min Temp', value: `${Math.round(main.temp_min)}°C` },
      { icon: 'fas fa-sun', label: 'Sunrise', value: utils.formatTime(sys.sunrise) },
      { icon: 'fas fa-moon', label: 'Sunset', value: utils.formatTime(sys.sunset) }
    ];

    elements.weatherStats.innerHTML = stats.map(stat => `
      <div class="stat-item">
        <i class="${stat.icon} stat-icon"></i>
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');

    elements.currentWeather.style.display = 'block';
    this.updateBackground(weather[0].main);
  },

  renderForecast(data) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
      
      if (!dailyForecasts[date] || Math.abs(12 - hour) < Math.abs(12 - dailyForecasts[date].hour)) {
        dailyForecasts[date] = { ...item, hour };
      }
    });

    const today = new Date().toISOString().split('T')[0];
    const forecastDays = Object.keys(dailyForecasts)
      .filter(date => date > today)
      .sort()
      .slice(0, 5);

    elements.forecastContainer.innerHTML = forecastDays.map(date => {
      const forecast = dailyForecasts[date];
      return `
        <div class="forecast-item">
          <div class="forecast-day">${utils.formatDate(date)}</div>
          <img 
            src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" 
            alt="${forecast.weather[0].description}" 
            class="forecast-icon"
          >
          <div class="forecast-temps">
            <span class="temp-high">${Math.round(forecast.main.temp_max)}°</span>
            <span class="temp-low">${Math.round(forecast.main.temp_min)}°</span>
          </div>
          <div class="forecast-desc">${utils.capitalizeWords(forecast.weather[0].description)}</div>
        </div>
      `;
    }).join('');

    elements.forecastSection.style.display = 'block';
  }
};

// Main app
const app = {
  async init() {
    this.bindEvents();
    await this.loadDefaultWeather();
  },

  bindEvents() {
    elements.searchBtn.addEventListener('click', () => this.handleSearch());
    elements.locationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });

    elements.locationInput.addEventListener('input', 
      utils.debounce(() => {
        const value = elements.locationInput.value.trim();
        if (value.length > 2) {
          this.searchWeather(value);
        }
      }, 1000)
    );
  },

  async handleSearch() {
    const location = elements.locationInput.value.trim();
    if (location && !state.isLoading) {
      await this.searchWeather(location);
    }
  },

  async searchWeather(location) {
    try {
      ui.showLoading();
      ui.hideError();

      const { currentData, forecastData } = await api.fetchWeatherData(location);
      
      state.currentWeather = currentData;
      state.forecast = forecastData;
      state.lastUpdate = Date.now();

      ui.renderCurrentWeather(currentData);
      ui.renderForecast(forecastData);

      elements.locationInput.value = currentData.name;

    } catch (error) {
      console.error('Weather search failed:', error);
      ui.showError(error.message);
    } finally {
      ui.hideLoading();
    }
  },

  async loadDefaultWeather() {
    try {
      const currentLocation = await api.getCurrentLocation();
      elements.locationInput.value = currentLocation;
      await this.searchWeather(currentLocation);
    } catch (error) {
      console.log('Using default location:', error.message);
      elements.locationInput.value = CONFIG.DEFAULT_CITY;
      await this.searchWeather(CONFIG.DEFAULT_CITY);
    }
  }
};

// Init app
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
