import axios from "axios";
import React, { useState, useEffect } from "react";
import { ImSpinner8 } from "react-icons/im";
import {
  IoMdCloudy,
  IoMdRainy,
  IoMdSearch,
  IoMdSnow,
  IoMdSunny,
  IoMdThunderstorm,
} from "react-icons/io";
import {
  BsCloudDrizzleFill,
  BsCloudHaze2Fill,
  BsEye,
  BsThermometer,
  BsWater,
  BsWind,
} from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { MdSignalWifiConnectedNoInternet3 } from "react-icons/md";

const apiKey = "b73a801f54156dd2acebc44ab026edd9";

const App = () => {
  const [location, setLocation] = useState("Jakarta");
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null });
  const date = new Date();
  const [fadeOut, setFadeOut] = useState(false);

  const fetchWeatherData = async (location) => {
    let url =
      location.includes("lat=") && location.includes("lon=")
        ? `https://api.openweathermap.org/data/2.5/weather?${location}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    setStatus({ loading: true, error: null });
    setFadeOut(true);

    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching data";
      setStatus({ loading: false, error: errorMessage });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const getLocationAndFetchData = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          localStorage.setItem("latitude", lat);
          localStorage.setItem("longitude", lon);
          fetchWeatherData(`lat=${lat}&lon=${lon}`);
        },
        () => fetchWeatherData(location)
      );
    } else {
      fetchWeatherData(location);
    }
  };

  useEffect(() => {
    const storedLat = localStorage.getItem("latitude");
    const storedLon = localStorage.getItem("longitude");

    if (storedLat && storedLon) {
      fetchWeatherData(`lat=${storedLat}&lon=${storedLon}`);
    } else {
      fetchWeatherData(location);
      getLocationAndFetchData();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus((prev) => ({ ...prev, error: null }));
    }, 3000);
    return () => clearTimeout(timer);
  }, [status.error]);

  const handleSearch = (e) => {
    e.preventDefault();

    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(inputValue)) {
      setStatus({
        loading: false,
        error: "Please enter a valid city name (letters and spaces only).",
      });
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
      return;
    }

    if (inputValue) {
      setLocation(inputValue);
      fetchWeatherData(inputValue);
    }
  };

  if (status.loading) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
        <ImSpinner8 className="animate-spin text-white text-9xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
        <MdSignalWifiConnectedNoInternet3 className="text-red-600 text-9xl" />
        <h1 className="text-white text-3xl font-bold">Service not available</h1>
      </div>
    );
  }

  let icon;
  switch (data.weather[0].main) {
    case "Clouds":
      icon = <IoMdCloudy className="text-white" />;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill className="text-gray-400" />;
      break;
    case "Rain":
      icon = <IoMdRainy className="text-sky-400" />;
      break;
    case "Clear":
      icon = <IoMdSunny className="text-yellow-300" />;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill className="text-sky-300" />;
      break;
    case "Snow":
      icon = <IoMdSnow className="text-sky-400" />;
      break;
    case "Thunderstorm":
      icon = <IoMdThunderstorm className="text-white" />;
      break;
    default:
      icon = <MdSignalWifiConnectedNoInternet3 className="text-red-600" />;
      break;
  }

  return (
    <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
      {status.error && (
        <div className="w-full max-w-[90vw] lg:max-w-[500px] bg-white/70 text-red-600 text-center capitalize rounded-md mb-4 flex items-center justify-center p-2 text-semibold">
          {status.error}
        </div>
      )}

      <form
        className={`${
          animate ? "animate-shake" : "animate-none"
        } h-16 bg-black/30 w-full max-w-[500px] rounded-full backdrop-blur-[32px] mb-8`}
        onSubmit={handleSearch}
      >
        <div className="h-full flex items-center justify-between p-2 relative">
          <input
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white text-[16px] font-light pl-6 h-full"
            type="text"
            placeholder="Search by city or country"
            id="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-purple-950 hover:bg-purple-900 w-20 h-12 rounded-full text-white flex items-center justify-center transition"
            type="submit"
          >
            <IoMdSearch className="text-2xl text-white " />
          </button>
        </div>
      </form>

      <div className="w-full max-w-[500px] min-h-[584px] bg-black/25 text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
        <div
          className={`transition-opacity duration-300 ${
            fadeOut ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="card-top flex gap-4 items-center">
            <div className="text-[87px]">{icon}</div>
            <div>
              <div className="text-2xl">
                {data.name}, {data.sys.country}
              </div>
              <div>{date.toDateString()}</div>
            </div>
          </div>

          <div className="card-body my-20">
            {data.weather ? (
              <div className="flex items-center justify-center">
                <div className="text-9xl">
                  <div>{parseFloat(data.main.temp).toFixed()}</div>
                </div>
                <div className="text-4xl">
                  <TbTemperatureCelsius />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[100px] ">
                <ImSpinner8 className="animate-spin text-white text-5xl" />
              </div>
            )}
            <div className="text-center capitalize">
              {data.weather?.[0].description}
            </div>
          </div>
          {data.main && (
            <div className="card-bottom flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsEye />
                  </div>
                  <div>
                    Visibility
                    <span className="ml-2">
                      {(data.visibility / 1000).toFixed(1)} km
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsThermometer />
                  </div>
                  <div className="flex flex-nowrap">
                    Feels like
                    <span className="ml-2 flex flex-nowrap">
                      {parseInt(data.main.feels_like).toFixed(1)}
                      <TbTemperatureCelsius />
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-2">
                    <div className="text-[20px]">
                      <BsWater />
                    </div>
                    <div>
                      Humidity
                      <span className="ml-2">{data.main.humidity} %</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="text-[20px]">
                      <BsWind />
                    </div>
                    <div className="flex flex-nowrap">
                      Wind
                      <span className="ml-2 flex flex-nowrap">
                        {data.wind.speed} m/s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
