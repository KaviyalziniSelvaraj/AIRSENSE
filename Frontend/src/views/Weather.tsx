import { Card, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

const Weather: React.FC = () => {
  const [lat, setLat] = useState<number | null>(null);
  const [long, setLong] = useState<number | null>(null);
  const [data, setData] = useState<any>(null); // Adjust the type accordingly

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (lat !== null && long !== null) {
      fetchWeatherData();
    }
  }, [lat, long]);

  return (
    <div className="App">
      {data && data.main && (
        <Row justify="center">
          <Col xs={24} sm={18} md={12} lg={8} xl={6}>
            <Card>
              <Text>Welcome to Weather Page!</Text>
              <div>
                <h2>{data.name}, {data.sys && data.sys.country}</h2>
                <span>{new Date().toLocaleDateString()}</span>
                <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt={data.weather[0].description} />
                <span>{Math.round(data.main.temp)}<sup>°C</sup></span>
                <p>{data.weather[0].description.toUpperCase()}</p>
                <p>Wind Speed: {data.wind.speed}m/s</p>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Weather;
