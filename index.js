const express=require('express')
const app=express()
const mongoose=require('mongoose')
const WeatherModel = require('./city'); 
const axios = require('axios');


const bodyParser=require('body-parser');
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/music', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/weather',async(req,res)=>{
    const city = req.body.city;
    console.log("Incoming body:", req.body)

  if (!city) {
    return res.status(400).json({ error: "City is required." });
  }

  try {
    const apiKey='2aa330c5e83d6e7da49aadca9b6014b6';
    const weatherRes = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
        q: city,
        appid: apiKey,
        units: 'metric'
        }
      }
    );


      const weather = weatherRes.data.weather[0].main;
      const weatherToSong = {
      Clear: "https://youtu.be/8ZpUUcF6w4k",         // "Ilahi" - Yeh Jawaani Hai Deewani
       Rain: "https://youtu.be/yIIGQB6EMAM",          // "Tum Hi Ho" - Aashiqui 2
       Clouds: "https://youtu.be/BddP6PYo2gs",        // "Phir Le Aya Dil" - Barfi
       Snow: "https://youtu.be/jRZVnLrwT8U",          // "Gerua" - Dilwale
       Thunderstorm: "https://youtu.be/dUHZ7cA3KyM"   // "Zinda" - Bhaag Milkha Bhaag
    };

    const song = weatherToSong[weather] || "https://youtu.be/kJQP7kiw5Fk"; // Default song

      // Save to MongoDB
    const data = new WeatherModel({ city, weather, song });
    await data.save();
          
    res.json({
    city,
    weather,
    song
   });
              
    }
    catch (err) {
     console.error(error.message);
    res.status(500).json({ error: "Failed to fetch weather or store data." });
    }
});

app.listen(4000,()=>{
    console.log("server started");
})