import { useState, useEffect, useCallback } from "react";

function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState();
    
    const API_KEY = "14d4c7b95e10baa9ff16c83564ce5c2d";

    const fetchWeather = useCallback(async (params) => {
        try {
            let url = "";
            if (params.city) {
                url = `https://api.openweathermap.org/data/2.5/weather?q=${params.city}&appid=${API_KEY}`;
            } else if (params.lat && params.lon) {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${API_KEY}`;
            }

            if (!url) return;

            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === "404") {
                alert("Wrong city name...Try again!!");
                return;
            }
            setWeather(data);
        } catch (error) {
            console.error("Network error:", error);
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather({ lat: latitude, lon: longitude });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // Default to a specific city if geolocation fails
                    fetchWeather({ city: "London" });
                }
            );
        } else {
            fetchWeather({ city: "London" });
        }
    }, [fetchWeather]);

    const handleCityChange = (event) => {
        setCity(event.target.value);
    }

    const handleClick = () => {
        if (city.trim()) {
            fetchWeather({ city });
        }
    }

    const weatherClass = weather?.weather?.[0]?.main || "Default";
    return (
        <div className="weather-wrapper">
            <h1>Weather App</h1>
            <div className={`container ${weatherClass}`}>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Enter City..." 
                        className="input" 
                        value={city} 
                        onChange={handleCityChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
                    />
                    <button className="search-btn" onClick={handleClick}>
                        🔍
                    </button>
                </div>
                
                {weather && (
                    <div className="weather-info">
                        <div className="main-info">
                            <h2 className="city">{weather.name}</h2>
                            <h1 className="temp">{Math.round(weather.main.temp - 273.15)}°C</h1>
                            <p className="condition">{weather.weather[0].main}</p>
                        </div>
                        
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="label">Humidity</span>
                                <span className="value">{weather.main.humidity}%</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Wind Speed</span>
                                <span className="value">{weather.wind.speed} km/h</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Feels Like</span>
                                <span className="value">{Math.round(weather.main.feels_like - 273.15)}°C</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Weather;