const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?q='
const WEATHER_KEY = 'a95c64fe40a9545d52fecb05db8ddea4'

const IMG_URL = 'https://pixabay.com/api/?key=';
const IMG_KEY = '13989136-76f08e52ab6eb82da4f884b8d';

let tempDiv = document.getElementById('tempContainer');
let nameDiv = document.getElementById('nameContainer');
let descDiv = document.getElementById('descContainer');
let hiloDiv = document.getElementById('hiloContainer');
let nameInputContainer = document.getElementById('nameInput');
let nameInput = document.getElementById('nameText');
let nameSubmit = document.getElementById('nameSubmit');

// change input width when a key is pressed
nameInput.addEventListener('input', function() {
  this.style.width = this.value.length + 'ch';
});

// switch to input mode when city name is clicked
nameDiv.addEventListener('click', function() {
  nameDiv.classList.toggle('hidden');
  nameInputContainer.style.display = 'flex';
  nameInput.focus();
  nameInput.style.width = '100px';
});

// refresh page when new city is submitted
nameSubmit.addEventListener('click', function() {
  getWeatherData(nameInput.value);
  nameInput.value = '';
  nameDiv.classList.toggle('hidden');
  nameInputContainer.style.display = 'none';
})

async function getWeatherData(city) {
  // clear current data
  clearData();

  // get weather data as json object
  let link = WEATHER_URL + city + '&appid=' + WEATHER_KEY;
  let response = await fetch(link, { mode: 'cors' });
  let weatherData = await response.json();
  console.log(weatherData);

  if (weatherData.cod != 200) {
    let nameText = document.createTextNode('City not found.');
    nameDiv.appendChild(nameText);
    return null;
  }

  // write weather data to DOM
  let tempText = document.createTextNode(`${Math.ceil(toFarenheit(weatherData.main.temp))}°`);
  let nameText = document.createTextNode(weatherData.name);
  let descText = document.createTextNode(capitalize(weatherData.weather[0].description));
  let hiloText = document.createTextNode(`High ${Math.ceil(toFarenheit(weatherData.main.temp_max))}° | ` +
                                        `Low ${Math.ceil(toFarenheit(weatherData.main.temp_min))}°`);
  tempDiv.appendChild(tempText);
  nameDiv.appendChild(nameText);
  descDiv.appendChild(descText);
  hiloDiv.appendChild(hiloText);

  // get the background image based on weather
  getImage(weatherData.weather[0].description);
}

async function getImage(desc) {
  // get image data as json object
  let link = IMG_URL + IMG_KEY + '&q=' + desc;
  let response = await fetch(link, { mode: 'cors' });
  let imageData = await response.json();
  console.log(imageData);

  // set the background image to first hit, darkened
  document.body.style.backgroundImage = `linear-gradient(
                                          rgba(0, 0, 0, 0.5),
                                          rgba(0, 0, 0, 0.5)
                                        ),
                                        url(${imageData.hits[0].largeImageURL})`;

}

getWeatherData('Atlanta');

function toFarenheit(kelvin) {
  let farenheit = ((kelvin * 9.0 / 5.0) - 459.67)
  console.log(`Converted ${kelvin} degrees Kelvin to ${farenheit} degrees Farenheit.`);
  return farenheit;
  
}

function toCelsius(kelvin) {
  let celsius = (kelvin - 273.15);
  console.log(`Converted ${kelvin} degrees Kelvin to ${celsius} degrees Celsius.`);
  return celsius;
}

function capitalize(str) {
 return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function clearData() {
  tempDiv.innerText = '';
  nameDiv.innerText = '';
  descDiv.innerText = '';
  hiloDiv.innerText = '';
}