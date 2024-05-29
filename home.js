const yourWeather = document.querySelector("[your-weather]");
const searchWeather = document.querySelector("[search-weather]");
const weatherConatainer = document.querySelector(".weather-container");
const grantAccessLocation = document.querySelector(".grant-location-container");
const loadingForm = document.querySelector(".loading-container");
const formContainer = document.querySelector(".form-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchForm = document.querySelector("[data-searchForm]");
const notfoundImg = document.querySelector(".not-found-img");


let oldTab = yourWeather;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getYourWeather();


function swichFunction(newTab){
    if(oldTab != newTab)
    {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        if(!formContainer.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessLocation.classList.remove("active");
            formContainer.classList.add("active");
            notfoundImg.classList.remove("active");
        }
        else{
            formContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notfoundImg.classList.remove("active");
            getYourWeather();
        }
    }
}


yourWeather.addEventListener("click", () => {
    swichFunction(yourWeather);
});

searchWeather.addEventListener("click", () => {
    swichFunction(searchWeather);
});


async function getYourWeather(){
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        console.log("grantAccessLocation active");
        grantAccessLocation.classList.add("active");
    }
    else{
        console.log("gAL");
        const coordinates = JSON.parse(localCoordinates);
        feachYourLocationInfo(coordinates);
    }
}


async function feachYourLocationInfo(coordinates)
{
    const{lat,lon} = coordinates;
    grantAccessLocation.classList.remove("active");
    loadingForm.classList.add("active");
    notfoundImg.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        // console.log(await response.json());
        const data = await response.json();
        loadingForm.classList.remove("active");
        userInfoContainer.classList.add("active");
        showWeatherInfo(data);
    }
    catch(error)
    {
        loadingForm.classList.remove("active");
        notfoundImg.classList.add("active");
    }
}


function showWeatherInfo(weatherInfo)
{
    const cityName = document.querySelector("[city-name]");
    const countryIcon = document.querySelector("[country-icon]");
    const weather = document.querySelector("[weather-name]");
    const weatherIcon = document.querySelector("[weather-icon]");
    const temp = document.querySelector("[temprature]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const huminity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");
    
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weather.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    huminity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
         console.log("get Location Problem");
    }
}


function showPosition(position){
    const userCoordinates = {
         lat : position.coords.latitude,
         lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    feachYourLocationInfo(userCoordinates)}


const grantAccessBut = document.querySelector("[data-grantAccess]");
grantAccessBut.addEventListener("click",getLocation);

const searchCity = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit" ,(e) => {
    e.preventDefault();
    let cityName = searchCity.value;
    console.log(cityName);
    if(cityName === "")
    {
        return;
    }
    else{
        feachSearchWeatherInfo(cityName);
    }
})


async function feachSearchWeatherInfo(city)
{
    loadingForm.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessLocation.classList.remove("active");
    notfoundImg.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        if(data?.cod != '404')
        {
            console.log(data);
            loadingForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            showWeatherInfo(data);
        }
        else{
            loadingForm.classList.remove("active");
            // userInfoContainer.classList.remove("active");
            notfoundImg.classList.add("active");
        }
    }
    catch(err){
       
    }
}
