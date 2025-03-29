export default function WeatherBanner({ time, day, data, description }) {
  
  if (!time || !day || !data || !description) {
    return (
      <div className="bgImage shadow-lg hover:shadow-xl transition-all duration-300 flex lg:flex-row md:flex-row flex-col lg:justify-between md:justify-between justify-center lg:items-end md:items-end items-center h-[400px] mt-5 lg:mx-8 mx-5 rounded-xl overflow-hidden">
        <div className="lg:ml-10 md:ml-10 ml-0 mb-10 animate-pulse">
            <div className="loader"></div>
        </div>

        <div className="lg:mr-10 md:mr-10 mr-0 lg:mb-10 md:mb-10 mb-0 animate-pulse">
           <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bgImage shadow-lg hover:shadow-xl transition-all duration-300 flex lg:flex-row md:flex-row flex-col lg:justify-between md:justify-between justify-center lg:items-end md:items-end items-center h-[400px] mt-5 lg:mx-8 mx-5 rounded-xl overflow-hidden backdrop-blur-sm bg-opacity-90">
        <div className="lg:ml-10 md:ml-10 ml-0 mb-10 transform hover:scale-105 transition-transform duration-300">
          <h1 className="lg:text-8xl md:text-8xl text-6xl text-white mb-1 font-bold drop-shadow-lg">
            {Math.floor(data.main.temp)}°C
          </h1>
          <p className="text-xl text-white lg:pl-2 md:pl-1 pl-0.5 font-medium">
            {data.name}, {data.sys.country}
          </p>
        </div>

        <div className="lg:mr-10 md:mr-10 mr-0 lg:mb-10 md:mb-10 mb-0 transform hover:scale-105 transition-transform duration-300">
          <h1 className="lg:text-5xl md:text-5xl text-3xl text-white mb-1 font-bold drop-shadow-lg">
            {time}
          </h1>
          <p className="text-xl text-white lg:pl-2 font-medium">
            {day} {description}
          </p>
        </div>
      </div>
    </>
  );
}
