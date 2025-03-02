import React, { useState, useEffect } from 'react';
import './PrayerTimes.css';

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleApiError = async (response) => {
    let errorMessage = '';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || 'Unknown error occurred';
      } else {
        errorMessage = 'Invalid response from server';
      }
    } catch (e) {
      errorMessage = 'Failed to parse error response';
    }
    throw new Error(errorMessage);
  };

  const fetchData = async (coords = null) => {
    try {
      setLoading(true);
      setError('');
      
      let latitude, longitude;

      if (!coords) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            maximumAge: 0,
            enableHighAccuracy: true
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } else {
        latitude = coords.lat;
        longitude = coords.lon;
      }

      setLocation({ lat: latitude, lon: longitude });

      // Fetch prayer times
      const prayerResponse = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      if (!prayerResponse.ok) {
        await handleApiError(prayerResponse);
      }
      const prayerData = await prayerResponse.json();
      const timings = prayerData.data.timings;

      // Fetch weather
      const weatherResponse = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      if (!weatherResponse.ok) {
        await handleApiError(weatherResponse);
      }
      const weatherData = await weatherResponse.json();

      setPrayerTimes(formatPrayerTimes(timings));
      setWeather(weatherData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch data. Please try again.');
      setLoading(false);
    }
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!manualLocation.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(manualLocation.trim())}&limit=5&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        setError('Location not found. Please try a different search term.');
        setLoading(false);
        return;
      }

      if (data.length === 1) {
        const { lat, lon } = data[0];
        fetchData({ lat, lon });
        return;
      }

      setSearchResults(data);
      setLoading(false);
    } catch (err) {
      setError('Error searching location. Please try again.');
      setLoading(false);
    }
  };

  const formatPrayerTimes = (timings) => {
    return [
      { name: 'Fajr', time: timings.Fajr },
      { name: 'Sunrise', time: timings.Sunrise },
      { name: 'Dhuhr', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Maghrib', time: timings.Maghrib },
      { name: 'Isha', time: timings.Isha },
    ];
  };

  const getTimePeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 6) return 'dawn';
    if (hour >= 6 && hour < 8) return 'sunrise';
    if (hour >= 8 && hour < 18) return 'day';
    if (hour >= 18 && hour < 20) return 'sunset';
    return 'night';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`container ${getTimePeriod()}`}>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
          <p>{error}</p>
        </div>
      )}

      <div className="location-error">
        <form onSubmit={handleLocationSearch} className="space-y-4">
          <input
            type="text"
            placeholder="Enter city name (e.g., San Diego, CA)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
            disabled={loading}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setLoading(true);
                fetchData();
              }}
              className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Use My Location'}
            </button>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Select a location:</h3>
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => fetchData({ lat: result.lat, lon: result.lon })}
                className="w-full rounded p-2 text-left transition-colors hover:bg-gray-100"
                disabled={loading}
              >
                {result.name}, {result.state || ''} {result.country}
              </button>
            ))}
          </div>
        )}
      </div>

      {weather && <WeatherIcon condition={weather.weather[0].main} />}
      
      <div className="prayer-times grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prayerTimes.map((prayer) => (
          <div key={prayer.name} className="glass-card">
            <div className="dome-icon"></div>
            <h3 className="text-xl font-semibold">{prayer.name}</h3>
            <p className="text-lg">{prayer.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeatherIcon = ({ condition }) => {
  const getIcon = () => {
    switch (condition.toLowerCase()) {
      case 'rain':
        return '🌧️';
      case 'clouds':
        return '☁️';
      case 'clear':
        return '☀️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="weather-icon">
      {getIcon()}
      {condition === 'Rain' && <RainEffect />}
    </div>
  );
};

const RainEffect = () => {
  return (
    <div className="rain">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default PrayerTimes;