export default function WeatherForecast({ forecastData }) {
 
  if (!forecastData || !forecastData.list) {
    return (
      <div className="shadow-lg hover:shadow-xl transition-all duration-300 px-7 py-7 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl mt-10 lg:mx-8 mx-5">
        <h1 className="text-lg font-semibold pl-1 text-gray-800 dark:text-white">5 Day's Forecast</h1>

        <section className="dots-container lg:mt-2 mt-10 mb-2">
          <div className="dot animate-pulse"></div>
          <div className="dot animate-pulse"></div>
          <div className="dot animate-pulse"></div>
          <div className="dot animate-pulse"></div>
          <div className="dot animate-pulse"></div>
        </section>
      </div>
    );
  }

  function getCustomIcon(weatherCondition) {
    const iconMapping = {
      Clear: "https://cdn-icons-png.flaticon.com/128/8030/8030067.png",
      Clouds: "https://cdn-icons-png.flaticon.com/128/4814/4814293.png",
      Thunderstorm: "https://cdn-icons-png.flaticon.com/128/4724/4724103.png",
      Tornado: "https://cdn-icons-png.flaticon.com/128/8984/8984259.png",
      Rain: "https://cdn-icons-png.flaticon.com/128/4724/4724094.png",
      Drizzle: "https://cdn-icons-png.flaticon.com/128/1809/1809557.png",
      Snow: "https://cdn-icons-png.flaticon.com/128/13496/13496459.png",
      Mist: "https://cdn-icons-png.flaticon.com/128/17798/17798772.png",
      Haze: "https://cdn-icons-png.flaticon.com/128/17798/17798772.png",
      Fog: "https://cdn-icons-png.flaticon.com/128/3750/3750506.png",
      Smoke: "https://cdn-icons-png.flaticon.com/128/3750/3750506.png",
      Dust: "https://cdn-icons-png.flaticon.com/128/3750/3750506.png",
      Ash: "https://cdn-icons-png.flaticon.com/128/3750/3750506.png",
      Squall: "https://cdn-icons-png.flaticon.com/128/3750/3750506.png",
    };
    return (
      iconMapping[weatherCondition] ||
      "https://cdn-icons-png.flaticon.com/128/4814/4814489.png"
    );
  }

  function formatTimeAMPM(dt_txt) {
    const timeString = dt_txt.split(" ")[1];
    const parts = timeString.split(":");
    let hours = parseInt(parts[0]);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function formatDate(dt_txt) {
    const date = new Date(dt_txt);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // Group forecast data by day
  const groupedForecast = forecastData.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Get one forecast per day (at noon if available, otherwise first available)
  const dailyForecasts = Object.values(groupedForecast).map(dayForecasts => {
    const noonForecast = dayForecasts.find(f => f.dt_txt.includes('12:00:00'));
    return noonForecast || dayForecasts[0];
  });

  return (
    <>
      <div className="shadow-lg hover:shadow-xl transition-all duration-300 px-7 py-7 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl mt-10 lg:mx-8 mx-5">
        <h1 className="text-lg font-semibold pl-1 mb-6 text-gray-800 dark:text-white">5 Day's Forecast</h1>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {dailyForecasts.map((data, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              >
                <div className="text-center">
                  <p className="font-semibold text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {formatDate(data.dt_txt)}
                  </p>
                  <div className="transform hover:scale-110 transition-transform duration-300 mb-2">
                    <img
                      className="w-[50px] mx-auto"
                      src={getCustomIcon(data.weather[0].main)}
                      alt="weather icon"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-2xl text-gray-800 dark:text-white">
                      {Math.floor(data.main.temp)}°C
                    </p>
                    <div className="flex justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>H: {Math.floor(data.main.temp_max)}°</span>
                      <span>L: {Math.floor(data.main.temp_min)}°</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <img 
                        className="w-4 h-4" 
                        src="https://cdn-icons-png.flaticon.com/128/2529/2529971.png" 
                        alt="wind"
                      />
                      <span>{Math.floor(data.wind.speed)} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
