let now = new Date();

let currentDateTime = document.querySelector("#current-date");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[now.getMonth()];
let date = now.getDate();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}

let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
currentDateTime.innerHTML = `${day}, ${month} ${date}, ${hour}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row days-of-week">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col-2">
            <div class="card form-control" style="width: 6rem">
              <p class="weekname">${formatDay(forecastDay.dt)}</p>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                class="card-img-top weekday_image"
                alt=""
              />
              <div class="card-body weekday_temperature">
                <p class="card-text" id="temperature">
                  <strong>${Math.round(
                    forecastDay.temp.max
                  )}°</strong> / ${Math.round(forecastDay.temp.min)}°
                </p>
              </div>
            </div>
          </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c0d9a61baa256b27b3480e2a880cf387";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  let temperature = Math.round(celsiusTemperature);
  let city = response.data.name;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let precipitation = response.data.clouds.all;
  let wind = Math.round(response.data.wind.speed);
  let icon = response.data.weather[0].icon;
  let currentTemperature = document.querySelector("#temperature-now");
  currentTemperature.innerHTML = `${temperature}`;
  let currentCity = document.querySelector(".current_city");
  currentCity.innerHTML = `${city}`;
  let currentSky = document.querySelector(".current_weather");
  currentSky.innerHTML = `${description}`;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;
  let currentPrecipitation = document.querySelector("#precipitation");
  currentPrecipitation.innerHTML = `Precipitation: ${precipitation}%`;
  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = `Wind: ${wind}m/h`;
  let currentIcon = document.querySelector("#icon");
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  getForecast(response.data.coord);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "c0d9a61baa256b27b3480e2a880cf387";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#searchCity");
  let cityName = document.querySelector(".current_city");
  if (searchInput.value) {
    cityName.innerHTML = `${searchInput.value}`;
  } else {
    cityName.innerHTML = null;
  }
  let apiKey = "c0d9a61baa256b27b3480e2a880cf387";
  let city = `${searchInput.value}`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentLocation = document.querySelector("#current_location");
currentLocation.addEventListener("click", getCurrentPosition);
