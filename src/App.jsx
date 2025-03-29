import "./App.css";
import WeatherForecast from "./components/WeatherForecast";
import WeatherBanner from "./components/WeatherBanner";
import WeatherDetails from "./components/WeatherDetails";
import Footer from "./components/Footer";
import logo from "./assets/images/logo.png";
import { useState, useEffect } from "react";
import { message } from "antd";
import { FaSearch, FaLocationArrow } from "react-icons/fa";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [cityName, setCityName] = useState("karachi");
  const [weatherData, setWeatherData] = useState(
    {
    coord: { lon: 67.0822, lat: 24.9056 },
    weather: [
      { id: 803, main: "Clouds", description: "broken clouds", icon: "04d" },
    ],
    base: "stations",
    clouds: { all: 0 },
    cod: 200,
    coord: { lon: 67.0822, lat: 24.9056 },
    dt: 1742612932,
    id: 1174872,
    main: {
      feels_like: 24.64,
      grnd_level: 1011,
      humidity: 88,
      pressure: 1015,
      sea_level: 1015,
      temp: 23.9,
      temp_max: 23.9,
      temp_min: 23.9,
    },
    name: "Karachi",
    sys: {
      country: "PK",
      sunrise: 1742607223,
      sunset: 1742651002,
      type: 1,
    },
    timezone: 18000,
    visibility: 3000,
    weather: [
      { id: 803, main: "Clouds", description: "broken clouds", icon: "04d" },
    ],
    wind: { speed: 0, deg: 0 },
  });
  const [currentTime, setCurrentTime] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [isError, setIsError] = useState(false);
  const [forecastData, setForecastData] = useState("");
  const [airQuality, setAirQuality] = useState(null);

  let search = async (city) => {
    setIsError(false);
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`
      );

      if (!weatherResponse.ok) {
        throw new Error("City/Country not found or invalid API response");
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      setCityName("");

      // Only fetch air quality after we have valid weather data
      try {
        const airQualityResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${
            import.meta.env.VITE_APP_ID
          }`
        );
        const airQualityData = await airQualityResponse.json();
        setAirQuality(airQualityData);
      } catch (airError) {
        console.log("Error fetching air quality data:", airError);
        // Don't show error message for air quality as it's not critical
      }
    } catch (error) {
      console.log("Error in fetching weather data:", error);
      if (!isError) {
        messageApi.open({
          type: "error",
          content: "Sorry, we couldn't fetch weather data. Please try again later.",
        });
      }
      setIsError(true);
    }
  };

  let handleSearch = () => {
    if (cityName.trim()) {
      search(cityName);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && cityName.trim()) {
      handleSearch();
    }
  };

  useEffect(() => {
    // Auto-detect location when website opens
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${
                import.meta.env.VITE_APP_ID
              }`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            setWeatherData(data);
            setCityName(data.name);
          } catch (error) {
            console.log("Error fetching weather data:", error);
            // If location detection fails, fall back to default city
            if (cityName.trim()) {
              handleSearch();
            }
          }
        },
        (error) => {
          // If user denies location access, fall back to default city
          if (cityName.trim()) {
            handleSearch();
          }
        }
      );
    } else {
      // If geolocation is not supported, fall back to default city
      if (cityName.trim()) {
        handleSearch();
      }
    }
  }, []);

  // this is for showing current time & day
  useEffect(() => {
    if (weatherData && weatherData.timezone) {
      const timezoneOffsetSeconds = weatherData.timezone;
      const localTime = new Date();
      const utc = localTime.getTime() + localTime.getTimezoneOffset() * 60000;
      const targetTime = new Date(utc + timezoneOffsetSeconds * 1000);

      const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(targetTime);

      setCurrentTime(formattedTime);

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[targetTime.getDay()];
      setCurrentDay(dayName);
    }
  }, [weatherData]);

  // sunset / sunrise to proper time
  const convertSunsetriseToProperTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert 24hr to 12hr
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // 5 days Forecast
  useEffect(()=>{
    const fetchForecastData = async () => {
      try {
        const fetchForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
        );
        const data = await fetchForecast.json();
        setForecastData(data);
      } catch (error) {
        console.error('Error fetching forecast data: ', error);
      }
    };

    if (weatherData.coord) {
      fetchForecastData();
    }
  },[weatherData.coord])

  const getLocation = () => {
    if (!navigator.geolocation) {
      messageApi.open({
        type: "error",
        content: "Geolocation is not supported by your browser",
      });
      return;
    }

    messageApi.open({
      type: "loading",
      content: "Detecting your location...",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${
              import.meta.env.VITE_APP_ID
            }`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }

          const data = await response.json();
          setWeatherData(data);
          setCityName(data.name);
          messageApi.destroy();
        } catch (error) {
          console.log("Error fetching weather data:", error);
          messageApi.destroy();
          messageApi.open({
            type: "error",
            content: "Failed to get weather data for your location",
          });
        }
      },
      (error) => {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: "Unable to detect your location. Please enable location services.",
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="shadowHeader flex lg:bg-transparent bg-white justify-between lg:flex-row lg:gap-0 gap-3 flex-col lg:pt-6 lg:pb-5 pt-5 pb-5 lg:px-10 px-5 lg:mb-0 mb-8">
        <div>
          <h1 className="flex lg:items-end items-center lg:rounded-none rounded-lg lg:gap-2 gap-1.5 text-gray-800 lg:text-2xl md:text-2xl text-2xl font-bold">
            <img
              className="lg:w-[30px] lg:h-[28px] md:w-[30px] md:h-[28px] w-[27px] h-[27px]"
              src={logo}
              alt="weather logo"
            />
            WeatherNow
          </h1>
        </div>
        <div className="flex lg:w-[500px] w-auto gap-2">
          <button
            onClick={getLocation}
            className="lg:text-lg md:text-lg text-base cursor-pointer font-semibold bg-indigo-700 hover:bg-indigo-600 text-white px-4 rounded-lg flex items-center gap-2"
            title="Detect my location"
          >
            <FaLocationArrow />
          </button>
          <input
            className="bg-white w-full py-1.5 px-3 border border-gray-300 font-semibold focus:outline-none rounded-lg text-gray-900 placeholder-gray-500"
            type="text"
            placeholder="Enter city name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* this is for antd message */}
      {contextHolder}

      <WeatherBanner
        time={currentTime}
        day={currentDay}
        data={weatherData}
        description={weatherData.weather[0].description}
      />

      <WeatherDetails
        data={weatherData}
        sunset={convertSunsetriseToProperTime(weatherData.sys.sunset)}
        sunrise={convertSunsetriseToProperTime(weatherData.sys.sunrise)}
      />

      <WeatherForecast forecastData={forecastData} />

      <Footer />
    </div>
  );
}

export default App;
