import axios from 'axios';

const API_KEY = 'fdf387e42bmshdefd3c2d385eda9p1c0bdbjsnfe986ff6aef0';
const API_HOST = 'visual-crossing-weather.p.rapidapi.com';

export const getWeather = async (latitude, longitude) => {
  const options = {
    method: 'GET',
    url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
    params: {
      aggregateHours: '24',
      location: `${latitude},${longitude}`,
      contentType: 'json',
      unitGroup: 'metric', 
      shortColumnNames: '0'
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    return null;
  }
};