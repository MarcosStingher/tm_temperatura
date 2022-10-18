const api = {
    key: "64ed82577ced7f69cb1687f0ce536131",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

const city = document.querySelector('.city')
const date = document.querySelector('.date');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const weather_t = document.querySelector('.weather');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.low-high');
const lat = document.querySelector('.lat');
const lon = document.querySelector('.lon');
const swind = document.querySelector('.speed');
const humidity = document.querySelector('.humidity');
const pressao = document.querySelector('.pressao');
const co = document.querySelector('.co');
const no2 = document.querySelector('.no2');
const o3 = document.querySelector('.o3');
const so2 = document.querySelector('.so2');
const pm25 = document.querySelector('.pm25');
const pm10 = document.querySelector('.pm10');

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('Navegador não suporta geolocalização');
    }
    function setPosition(position) {
        console.log(position)
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
})

function coordResults(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Hhttp error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

search_button.addEventListener('click', function() {
    searchResults(search_input.value)
})

search_input.addEventListener('keypress', enter)
function enter(event) {
    key = event.keyCode
    if (key === 13) {
        searchResults(search_input.value)
    }
}

function searchResults(city) {
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

function searchPollution(lat,lon) {
    fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayPollution(response)
        });

}

function displayPollution(list){
    console.log(list)
    co.innerText = `${list.list[0].components.co} ppm`;
    no2.innerText = `${list.list[0].components.no2} µg/m³`;
    o3.innerText = `${list.list[0].components.o3} µg/m³`;
    so2.innerText = `${list.list[0].components.so2} µg/m³`;
    pm25.innerText = `${list.list[0].components.pm2_5} µg/m³`;
    pm10.innerText = `${list.list[0].components.pm10} µg/m³`;
}

function displayResults(weather) {
    console.log(weather)

    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    date.innerText = dateBuilder(now);

    let iconName = weather.weather[0].icon;
    container_img.innerHTML = `<img src="./icons/${iconName}.png">`;

    let temperature = `${Math.round(weather.main.temp)}`
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `°C`;

    weather_tempo = weather.weather[0].description;
    weather_t.innerText = capitalizeFirstLetter(weather_tempo)

    low_high.innerText = `Sensação: ${Math.round(weather.main.feels_like)}°C`;

    lat.innerText = `Latitude: ${weather.coord.lat}`;
    lon.innerText = `Longitude: ${weather.coord.lon}`;
    swind.innerText = `Velocidade do Vento: ${weather.wind.speed}km/h`;
    humidity.innerText = `Nível de Humidade: ${weather.main.humidity}%`;
    pressao.innerText = `Pressão: ${weather.main.pressure} mb`;

    searchPollution(`${weather.coord.lat}`,`${weather.coord.lon}`);

}

function dateBuilder(d) {
    let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

container_temp.addEventListener('click', changeTemp)
function changeTemp() {
    temp_number_now = temp_number.innerHTML

    if (temp_unit.innerHTML === "°C") {
        let f = (temp_number_now * 1.8) + 32
        temp_unit.innerHTML = "°F"
        temp_number.innerHTML = Math.round(f)
    }
    else {
        let c = (temp_number_now - 32) / 1.8
        temp_unit.innerHTML = "°C"
        temp_number.innerHTML = Math.round(c)
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
