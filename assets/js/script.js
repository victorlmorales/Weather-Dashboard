var apiKey = 'e0ae75cc6b79672ac3f27af8ead1cbfd';
var horizontalLineEl = document.querySelector("#line");
var forecastContainerEl = document.querySelector("#forecast-container");
var forecastCardContainerEl = document.querySelector("#forecast-card-container"); 

//show elements
function show(element) {
    element.style.display = "block";
}

//call OpenWeather API to get lat, lon
function searchCity(city) {
    console.log(apiKey);
    var url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    fetch(url).then(function(response){
        console.log(response.status);
        if (response.status !== 200) {
            alert("Status: " + response.status + "\n" + "Please enter a valid city.");
        }
        return response.json();
    }).then(function(data){
        console.log(data);
        getWeather(data[0].lat, data[0].lon);
        getForecast(data[0].lat, data[0].lon);
    })
}

//call OpenWeather API to get current weather for entered city
function getWeather(lat, lon) {
    var url =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        
        var cityName = data.name;
        var cityNameEl = document.createElement("h2");
        cityNameEl.textContent = cityName;
        
        var currentDate = new Date(data.dt * 1000).toLocaleDateString("en-US");
        var currentDateEl = document.createElement("p");
        currentDateEl.textContent = currentDate;

        var icon = data.weather[0].icon;
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", "https://www.openweathermap.org/img/wn/" + icon + ".png");

        var temperature = data.main.temp;
        var tempEl = document.createElement("p");
        tempEl.textContent = "Temperature: " + (Math.floor(temperature)) + "°F";

        var humidity = data.main.humidity;
        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidity + "%";

        var windSpeed = data.wind.speed;
        var windSpeedEl = document.createElement("p");
        windSpeedEl.textContent = "Wind Speed: " + windSpeed + " mph";
        
        var currentWeatherEl = document.querySelector("#current-weather");
        currentWeatherEl.innerHTML = "";

        currentWeatherEl.append(cityNameEl, currentDateEl, iconEl, tempEl, humidityEl, windSpeedEl);
        show(currentWeatherEl);
    })
}

//clear and show 5-Day Forecast Container
function renderForecastContainer() {
    forecastCardContainerEl.innerHTML = "";
    show(forecastContainerEl); 
}

//setup and render 5-Day Forecast data to forecast cards
function renderForecastCard(forecastData) {

    var forecastCardEl = document.createElement("div");
    forecastCardEl.setAttribute("class", "col-2");

    var forecastDate = new Date(forecastData.dt * 1000).toLocaleDateString("en-US");
    var forecastDateEl = document.createElement("h4");
    forecastDateEl.textContent = forecastDate;

    var icon = forecastData.weather[0].icon;
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "https://www.openweathermap.org/img/wn/" + icon + ".png");

    var forecastTemp = forecastData.main.temp;
    var forecastTempEl = document.createElement("p");
    forecastTempEl.textContent = "Temperature: " + (Math.floor(forecastTemp)) + "°F";

    var forecastHumidity = forecastData.main.humidity;
    var forecastHumidityEl = document.createElement("p");
    forecastHumidityEl.textContent = "Humidity: " + forecastHumidity + "%";

    var forecastWindSpeed = forecastData.wind.speed;
    var forecastWindSpeedEl = document.createElement("p");
    forecastWindSpeedEl.textContent = "Wind Speed: " + forecastWindSpeed + " mph";

    forecastCardEl.append(forecastDateEl, iconEl, forecastTempEl, forecastHumidityEl, forecastWindSpeedEl);
    forecastCardContainerEl.append(forecastCardEl);
    forecastContainerEl.append(forecastCardContainerEl);
}

//call OpenWeather API to get 5-Day Forecast data
function getForecast(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(url).then(function(respone){
        return respone.json();
    })
    .then(function(data){
        console.log(data);  
        renderForecastContainer(); 
        for (var i = 0; i < data.list.length; i++) {
            var hour = new Date(data.list[i].dt * 1000).getUTCHours(); 
            if (hour === 12) {
                console.log(data.list[i]);
                renderForecastCard(data.list[i]);
            }
        }
    }) 
}

//render entered cities to page from local storage
function renderStorage() {
    var history = JSON.parse(localStorage.getItem('past-searches')) || [];
    console.log(history);
    if(history.length === 0){
        return;
    } else {
        var searchHistoryEl = document.querySelector("#search-history");
        searchHistoryEl.innerHTML = "";
        var searchHistory = JSON.parse(localStorage.getItem(history)) || [];
        for (var i = 0; i < history.length; i++) {
            var cityList = document.createElement("button");
            cityList.classList.add("search");
            cityList.textContent = `${history[i]}`;
            cityList.setAttribute("data-index", i);
            searchHistoryEl.prepend(cityList);
            cityList.addEventListener("click", function() {
                    searchCity(this.textContent);}, false);
        } 
    }
}

//save entered cities to local storage
function saveToStorage(cityName) {
    var history = JSON.parse(localStorage.getItem('past-searches')) || [];
    if (!history.includes(cityName)) {
        history.push(cityName); 
        if (history.length > 5) {
            history.shift();
        }
    }
    localStorage.setItem('past-searches', JSON.stringify(history));
    renderStorage();
    show(horizontalLineEl);
}

//submit entered city
function handleFormSubmit(event) {
    event.preventDefault();
    var cityInput = document.getElementById('cityInput').value.trim();
    if (!cityInput){
        alert("Please enter a city!"); 
        return;
    }
    searchCity(cityInput);
    saveToStorage(cityInput);
}

document.querySelector('form').addEventListener('submit', handleFormSubmit);

