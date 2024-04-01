import React, { useState, useEffect } from 'react';
import ButtonBar from './ButtonBar';
import WeatherAndRegion from './WeatherAndRegion';
import CurrencyAndRegion from './CurrencyAndRegion';
import NewsCarousel from './NewsCarousel';
import IterativeButton from './IterativeButton'
import WeatherManager from './WeatherManager';
import NewsManager from './NewsManager';


function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [componentType, setComponentType] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: '', lon: '' });
  const [currArt, setCurrArt] = useState(0);

  const handleWeatherClick = (urlFromButton) => {
    setComponentType('weather');
    if (urlFromButton !== apiUrl) {
      setApiUrl(urlFromButton);
      setShowInfo(true);
    } else {
      setShowInfo(!showInfo);
    }
  };
  const handleCurrencyClick = (urlFromButton) => {
    setComponentType('currency');
    if (urlFromButton !== apiUrl) {
      setApiUrl(urlFromButton);
      setShowInfo(true);
    } else {
      setShowInfo(!showInfo);
    }
  };


  const handleIterativeClick = (iterateFromButton) => {
    setCurrArt(currArt + iterateFromButton)
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  const buttons = [
    {
      text: 'Troy Weather',
      onClick: () =>
        handleWeatherClick('http://localhost:3000/troy/weather'),
    },
    {
      text: 'Local Weather',
      onClick: () =>
        handleWeatherClick(
          `http://localhost:3000/local/weather?lat=${userLocation.lat}&lon=${userLocation.lon}`
        ),
    },
    {
      text: 'Troy Exhange Rates',
      onClick: () =>
        handleCurrencyClick(
          `http://localhost:3000/troy/denomination`
        ),
    },
  ];

  return (
    <div>
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-lg md:text-2xl font-semibold">Henry's News and Weather</h1>
        </div>
      </header>
      <ButtonBar buttons={buttons} />
      {showInfo && componentType === 'weather' && <WeatherAndRegion url={apiUrl} />}
      {showInfo && componentType === 'currency' && <CurrencyAndRegion url={apiUrl} />}

      <WeatherManager url={'http://localhost:3000/troy/weather'} />
      <div class="flex justify-between">
        <IterativeButton sendDataToParent={handleIterativeClick} buttonText="Previous Articles" iterate={-5} />
        <IterativeButton sendDataToParent={handleIterativeClick} buttonText="Next Articles" iterate={5} />
      </div>
      <div className="max-w-full overflow-x-auto">
        <NewsCarousel count={currArt} />
      </div>
      <NewsManager />
    </div>
  );
}

export default App;