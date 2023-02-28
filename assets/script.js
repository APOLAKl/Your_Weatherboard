// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=1&appid=921a08915bb8bf79b4345969a767d7a7

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=921a08915bb8bf79b4345969a767d7a7

// apikey = 921a08915bb8bf79b4345969a767d7a7

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

var searchForm = $("#search-form");
var searchInput = $("#search-input");
var searchHistory = $("#city-list");

function getWeather(event) {
  event.preventDefault();

  // logs searched cities
  var searchItem = $("#search-input").val();

  if (!searchItem) {
    console.log('No search entered!');
    return;
  }

  searchHistory.append('<li>' + searchItem + '</li>');




  var currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchInput.val() +
    "&appid=921a08915bb8bf79b4345969a767d7a7&units=metric";

  fetch(currentWeatherURL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      var cityName = data.name;
      var date = dayjs(data.dt * 1000).format("MM/DD/YYYY");
      var temp = data.main.temp;
      var humidity = data.main.humidity;
      var windSpeed = data.wind.speed;
      var icon = data.weather[0].icon;

      showCurrentWeather(cityName, date, temp, humidity, windSpeed, icon)

      getForecast();
    });
}

function showCurrentWeather(cityName, date, temp, humidity, windSpeed, icon) {
  $("#current-weather").empty()
  var cardDiv = $("<div>");
  cardDiv.addClass("card");
  cardDiv.html(`
  <div class="card-body">
    <h5 class="card-title">
      <span>${cityName}</span>
      <span> (${date})</span>
      <img src="http://openweathermap.org/img/wn/${icon}@2x.png"/>
    </h5>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Temp: ${temp}°C</li>
      <li class="list-group-item">Humidity: ${humidity}%</li>
      <li class="list-group-item">Wind Speed: ${windSpeed}</li>
    </ul>
  </div>
  `);

  $("#current-weather").append(cardDiv);
}

// 5 DAY FORECAST
function getForecast() {
  var forecastWeatherURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchInput.val() +
    "&appid=921a08915bb8bf79b4345969a767d7a7&units=metric";

  fetch(forecastWeatherURL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      // activate showForecastWeather
      showForecastWeather([
        data.list[0],
        data.list[8],
        data.list[16],
        data.list[24],
        data.list[32]
      ]);
    });
}

function showForecastWeather(weatherArray) {
  $("#forecast-weather").empty()
  $("#forecast-weather-title").append('5 Day weather forecast');

  for(i = 0; i < weatherArray.length; i++) {
    var cardDiv = $("<div>");
    cardDiv.addClass("card");
    cardDiv.html(`
    
    <div class="card-body">
      <h5 class="card-title">
        <span>${dayjs(weatherArray[i].dt * 1000).format("MM/DD/YYYY")}</span>
        <img src="http://openweathermap.org/img/wn/${weatherArray[i].weather[0].icon}@2x.png"/>
      </h5>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Temp: ${weatherArray[i].main.temp}°C</li>
        <li class="list-group-item">Humidity: ${weatherArray[i].main.humidity}%</li>
        <li class="list-group-item">Wind Speed: ${weatherArray[i].wind.speed}</li>
      </ul>
    </div>
    `);

    
  
    $("#forecast-weather").append(cardDiv);
  }
  
}

searchForm.on("submit", getWeather);
