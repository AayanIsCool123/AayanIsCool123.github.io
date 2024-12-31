const cityName = document.getElementById("placeName")
const weatherIcon = document.getElementById("picture")
const enterPlace = document.getElementById("place")
const searchPlaceButton = document.getElementById("search")
let weather = document.getElementById("currentWeather")
let realWeather = document.getElementById("actualFeeling")
let weatherHigh = document.getElementById("tempHigh")
let weatherLow = document.getElementById("tempLow")
const tomorrow1 = document.getElementById("nextDayWeather1")
const tomorrow2 = document.getElementById("nextDayWeather2")
const tomorrow3 = document.getElementById("nextDayWeather3")
const tomorrow4 = document.getElementById("nextDayWeather4")
const tomorrow5 = document.getElementById("nextDayWeather5")
let list = document.getElementById("favorite")
let addToList = document.getElementById("favoriteButton")
let clear = document.getElementById("erase")
//const linkApiGeocoding = "http://api.openweathermap.org/geo/1.0/direct?q="
const weatherData = "https://api.openweathermap.org/data/2.5/weather?q="
const weatherData2 = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "07fc29267af9c467313ab62a51bdd35f"
let favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || []

function createFavoriteCity(){
    let newCityText = cityName.textContent + ": " + weather.textContent
    if (!favoriteCities.includes(newCityText)) {
        let newFavoriteCity = document.createElement('li')
        newFavoriteCity.textContent = newCityText
        favoriteCities.push(newCityText)
        const favoriteCitiesString = JSON.stringify(favoriteCities)
        localStorage.setItem('favoriteCities', favoriteCitiesString)
        list.appendChild(newFavoriteCity)
    } else {
        alert("City already favorited.")
    }
}

window.onload = function() {
    addToList.disabled = true
    favoriteCities.forEach(city => {
        let listItem = document.createElement('li');
        listItem.textContent = city;
        list.appendChild(listItem);
    });
}

addToList.addEventListener('click', createFavoriteCity)

function clearAll () {
    localStorage.clear()
    favoriteCities.length = 0
    list.textContent = ""
}

clear.addEventListener('click', clearAll)

async function getWeather () {
    addToList.disabled = false
    // Fetch the 5-day forecast
    fetch(weatherData2 + enterPlace.value.toLowerCase() + "&units=imperial&appid=" + apiKey)
    .then(response => response.json())
    .then(data => {
    let dailyTemps = [];
    let dailyDates = [];

    // Loop through the 3-hourly forecast
    data.list.forEach(forecast => {
    const dateTime = forecast.dt_txt; // '2024-12-19 12:00:00'
    const date = dateTime.split(' ')[0]; // Extract '2024-12-19'
    const time = dateTime.split(' ')[1]; // Extract '12:00:00'
    
    // Keep only the record closest to 12:00 PM for each day
    if (time === '12:00:00') {
      dailyTemps.push(forecast.main.temp);
      dailyDates.push(date)
    }
    });
    let daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
    let actualDate2= new Date(dailyDates[1])
    let specificDay2 = daysInWeek[actualDate2.getDay()]

    let actualDate3 = new Date(dailyDates[2])
    let specificDay3 = daysInWeek[actualDate3.getDay()]

    let actualDate4 = new Date(dailyDates[3])
    let specificDay4 = daysInWeek[actualDate4.getDay()]
    
    let actualDate5 = new Date(dailyDates[4])
    let specificDay5 = daysInWeek[actualDate5.getDay()]
    
    tomorrow1.textContent = "Today's average: " + dailyTemps[0] + "°F"
    tomorrow2.textContent = specificDay2 + ": " + dailyTemps[1] + "°F"
    tomorrow3.textContent = specificDay3 + ": " + dailyTemps[2] + "°F"
    tomorrow4.textContent = specificDay4 + ": " + dailyTemps[3] + "°F"
    tomorrow5.textContent = specificDay5 + ": " + dailyTemps[4] + "°F"
    
    })
    .catch(error => console.error('Error fetching data:', error));
    try {
        let enterPlaceText = enterPlace.value.trim()
        if (!enterPlaceText) {
            alert("Please enter a city name.");
            return;
        }
        let urlApi =  weatherData + enterPlaceText + "&units=imperial&appid=" + apiKey
        let response = await fetch(urlApi)
        if (!response.ok) {
            throw new Error("City not found or invalid API call.");
        }
        let data = await response.json()
        weather.textContent = "Current Temperature: " + data.main.temp + "°F"
        cityName.textContent = data.name
        weatherHigh.textContent = "Highest Temperature: " + data.main.temp_max + "°F"
        weatherLow.textContent = "Lowest Temperature: " + data.main.temp_min + "°F"
        realWeather.textContent = "Feels Like: " + data.main.feels_like + "°F"
        weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        weatherIcon.alt = data.weather[0].description
    } catch (error) {
        console.error("Failed to get weather: ", error)
    }
    try {
        let enterPlaceText = enterPlace.value.trim()
        if (!enterPlaceText) {
            alert("Please enter a city name.");
            return;
        }
        let urlApi = fiveDayForecast + enterPlaceText + "cnt=5&units=imperial&APPID=" + apiKey
        let response = await fetch(urlApi)
        if (!response.ok) {
            throw new Error("City not found or invalid API call.");
        }
        let data = await response.json()
        enterPlace.textContent = ""
    } catch (error){
        console.error("Failed to get weather: ", error)
    }
}

searchPlaceButton.addEventListener("click", getWeather)