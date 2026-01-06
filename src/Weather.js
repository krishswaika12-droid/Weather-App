import { useState } from "react";

function Weather() {
    const [city, setCity] = useState();
    const [weather, setWeather] = useState();
    const handleCityChange = (event) => {
        setCity(event.target.value);
    }
    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=14d4c7b95e10baa9ff16c83564ce5c2d`);
            const data = await response.json();

            if (data.cod === "404") {
                alert("Wrong city name...Try again!!")
                return;
            }
            setWeather(data);
        } catch (error) {
            console.error("Network error:", error);
        }

    };
    const handleClick = () => {
        fetchWeather();
    }

    const weatherClass = weather?.weather?.[0]?.main || "Default";
    return (
        <>
        <div className= {`container ${weatherClass}`}>
            <div className="searchBar">
            <input type="text" placeholder="Enter City" className="input" value={city} onChange={handleCityChange}></input>
            <button className="search" onClick={handleClick}></button>
            </div>
            {weather && (
      <div className="weather-info">
        <h2>{weather.name}</h2>
        <h1>{Math.round(weather.main.temp - 273.15)}°C</h1>
        <div className="details-grid">
        <p>Condition: {weather.weather[0].main}</p> 
        <p className="detail-item">Humidity: {weather.main.humidity}</p>
        <p className="detail-item">Wind Speed: {weather.wind.speed}Kmph</p>
        </div>
      </div>
    )}
  </div>
  </>
);
}

export default Weather;