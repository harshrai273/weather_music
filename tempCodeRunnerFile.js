const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const WeatherModel = require('./city'); // Your model

const app = express();

// Parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/music', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// POST route to get weather and return a song
app.post('/weather', async (req, res) => {
  const city = req.body.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required.' });
  }

  try {
    const apiKey = '2aa330c5e83d6e7da49aadca9b6014b6';
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric'
      }
    });

    const weather = response.data.weather[0].main;

    const weatherToSong = {
      Clear: 'https://youtu.be/8ZpUUcF6w4k',       // Ilahi
      Rain: 'https://youtu.be/yIIGQB6EMAM',        // Tum Hi Ho
      Clouds: 'https://youtu.be/BddP6PYo2gs',      // Phir Le Aya Dil
      Snow: 'https://youtu.be/jRZVnLrwT8U',        // Gerua
      Thunderstorm: 'https://youtu.be/dUHZ7cA3KyM' // Zinda
    };

    const song = weatherToSong[weather] || 'https://youtu.be/kJQP7kiw5Fk'; // Default

    const entry = new WeatherModel({ city, weather, song });
    await entry.save();

    res.json({ city, weather, song });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching weather or saving data.' });
  }
});

// Start server
app.listen(4000, () => {
  console.log('🚀 Server running on http://localhost:4000');
});
