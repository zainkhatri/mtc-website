const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Proxy for OpenWeatherMap API
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing latitude or longitude' });
    }

    console.log(`Fetching weather data for lat: ${lat}, lon: ${lon}`);
    
    if (!process.env.WEATHER_API_KEY) {
      console.error('WEATHER_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'Weather API key is not configured' });
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
    
    const response = await axios.get(weatherUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Weather API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response) {
      res.status(error.response.status).json({
        error: 'Weather API error',
        message: error.response.data.message || 'Unknown error'
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'Unable to reach weather service'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

const startServer = (initialPort) => {
  const server = app.listen(initialPort)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${initialPort} is busy, trying ${initialPort + 1}...`);
        startServer(initialPort + 1);
      } else {
        console.error('Server error:', err);
      }
    })
    .on('listening', () => {
      const actualPort = server.address().port;
      console.log(`Server running on port ${actualPort}`);
    });
};

startServer(port);