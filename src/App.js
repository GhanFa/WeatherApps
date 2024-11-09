import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
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
  const [data, setData] = useState([]);
  const [location, setLocation] = useState("Jakarta");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (inputValue) {
      setLocation(inputValue);
    } else {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
    }
  };

  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&metric&appid=${apiKey}`;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.log(error);
        setErrorMsg(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
        <ImSpinner8 className="animate-spin text-white text-9xl" />
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
        <MdSignalWifiConnectedNoInternet3 className="text-red-600 text-9xl" />
        <h1 className="text-white text-3xl font-bold">Service not available</h1>
      </div>
    );
  }

  let icon;
  console.log(data);

  switch (data.weather?.[0].main) {
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
      // Jika tidak ada kecocokan, Anda bisa memberikan nilai default atau icon

      icon = <MdSignalWifiConnectedNoInternet3 className="text-red-600" />;
      break;
  }

  const date = new Date();
  return (
    <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
      {errorMsg && (
        <div className="w-full max-w-[90vw] lg:max-w-[500px] bg-white/70 text-red-600 text-center capitalize rounded-md mb-4 flex items-center justify-center p-2 text-semibold">{`${errorMsg.response.data.message}`}</div>
      )}
      <form
        className={`${
          animate ? "animate-shake" : "animate-none"
        } h-16 bg-black/30 w-full max-w-[500px] rounded-full backdrop-blur-[32px] mb-8`}
      >
        <div className="h-full flex items-center justify-between p-2 relative">
          <input
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white text-[16px] font-light pl-6 h-full focus:bg-transparent autofill:bg-transparent :focus:autofill:bg-transparent :autofill:active:bg-transparent  "
            type="text"
            placeholder="Search by city or country"
            id="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-purple-950 hover:bg-purple-900 w-20 h-12 rounded-full text-white flex items-center justify-center transition"
            onClick={handleSearch}
          >
            <IoMdSearch className="text-2xl text-white " />
          </button>
        </div>
      </form>

      <div className="w-full max-w-[500px] min-h-[584px] bg-black/25 text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
        <div>
          {/* card top */}
          <div className="card-top flex gap-4 items-center">
            {/* icon */}
            <div className="text-[87px]">{icon}</div>
            <div>
              {/* city name & country */}
              <div className="text-2xl">
                {data?.name}, {data.sys?.country}
              </div>
              {/* date */}
              <div>{date.toDateString()}</div>
            </div>
          </div>

          <div className="card-body my-20">
            {data.weather ? (
              <div className="flex items-center justify-center">
                <div className="text-9xl">
                  <div>{(parseFloat(data.main?.temp) - 273).toFixed()}</div>
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
          {data.main ? (
            <div className="card-bottom flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsEye />
                  </div>
                  <div>
                    Visibity
                    <span className="ml-2">
                      {data.visibility
                        ? `${(data.visibility / 1000).toFixed(1)} km`
                        : "No data"}
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
                      {parseInt(data.main?.feels_like).toFixed() - 273}
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
                      <span className="ml-2">{data.main?.humidity} % </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="text-[20px]">
                      <BsWind />
                    </div>
                    <div className="flex flex-nowrap">
                      Wind
                      <span className="ml-2 flex flex-nowrap">
                        {data.wind?.speed} m/s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default App;
