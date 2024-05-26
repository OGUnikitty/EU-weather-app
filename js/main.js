//Get city coordinates from JSON file
async function getCitiesData() {
    try {
      const response = await fetch('cities_and_coordinates.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      loopThroughCities(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

//GLOBAL VARIABLES 
const selectElement = document.getElementById("select-city");
const httpHeader = "https://api.open-meteo.com/v1/forecast?";
const outputContainer = document.querySelector('.weather-card-container')
const fahrenheitCheck = document.getElementById('fahrenheit-check')



  function loopThroughCities(cities) {

  
    for (const city of cities) {
      const option = document.createElement("option");
      option.text = `${city.city} | ${city.country}`;
      option.value = `latitude=${city.latitude}&longitude=${city.longitude}`;
  

      selectElement.appendChild(option);
    }
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
        getCitiesData();
        changeValue();  

  });


async function changeValue(){
    selectElement.addEventListener("input", () => {
      
      console.log(`${httpHeader}${selectElement.value}`);
      outputContainer.innerHTML = "";
      getAPIData(selectElement.value);
      
      
        
      });
}


async function getAPIData(selectedCity) {
  const dates = getFutureDates();
  const apiUrl = `${httpHeader}${selectElement.value}&hourly=temperature_2m,weather_code&timezone=auto&timeformat=unixtime`;
  outputContainer.classList.add("loading");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching weather data: status ${response.status}`);
    }
    // getFutureDates();
    const weatherData = await response.json();
    console.log(weatherData); // log is data recieved 
    const processsed_data = processWeatherData(weatherData)
    console.log(processsed_data)

    //process data

    const weatherCardContainer = document.querySelector(".weather-card-container"); 

  processsed_data.forEach(data => {
  const card = document.createElement("div");
  card.classList.add("card");

  const dayHeader = document.createElement("h1");
  dayHeader.id = "day";
  dayHeader.textContent = data.highest.time;

  const weatherIcon = document.createElement("div");
  weatherIcon.classList.add("weather-icon");
  weatherIcon.textContent = data.highest.description;



  const highestTemp = document.createElement("p");
  const highestSpan = document.createElement("span");
  highestSpan.id = "highest";
  highestTemp.textContent = "Highest: ";
  highestTemp.appendChild(highestSpan);

  const lowestTemp = document.createElement("p");
  const lowestSpan = document.createElement("span");
  lowestSpan.id = "lowest";

  lowestTemp.textContent = "Lowest: ";
  lowestTemp.appendChild(lowestSpan);

  //checking if farenheight is checked
  if(fahrenheitCheck.checked){
    highestSpan.textContent = data.highest.value + " °F";
    lowestSpan.textContent = data.lowest.value + " °F";
  }
  else{
    highestSpan.textContent = data.highest.value + "°C";
    lowestSpan.textContent = data.lowest.value + "°C";
  }

  //end check

  // Append elements to the card
  card.appendChild(dayHeader);
  card.appendChild(weatherIcon);
  card.appendChild(highestTemp);
  card.appendChild(lowestTemp);

  // Append the card to the container
  weatherCardContainer.appendChild(card);
});

  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
  finally{
    outputContainer.classList.remove("loading");
  }
}

function getFutureDates() {
  const today = new Date();

  const days = 10

  // Add 7 days to today
  // today.setDate(today.getDate() + 7);

  // DIsplay dates  YYYY-MM-DD
  const start_date = today.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const end_date_actual = new Date(today.setDate(today.getDate() + days));

  const end_date = end_date_actual.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  //Adjust start date
  const start_date_preadjusted = start_date.split('/')
  const start_date_adjusted = `${start_date_preadjusted[2]}-${start_date_preadjusted[0]}-${start_date_preadjusted[1]}`

  //Adjust end date
  const end_date_preadjusted = end_date.split('/')
  const end_date_adjusted = `${end_date_preadjusted[2]}-${end_date_preadjusted[0]}-${end_date_preadjusted[1]}`

 return `&start_date=${start_date_adjusted}&end_date=${end_date_adjusted}`


};


function processWeatherData(data) {
  const weatherValues = data.hourly.temperature_2m;
  const timestamps = data.hourly.time;
  const weatherCodes = data.hourly.weather_code;

  // Create classes for weather codes
  const weatherCodeMap = { 
    0 : "😎",
    1 : "☀️",
    2 : "☀️",
    3 : "☀️",
    4 : "☀️",
    5 : "🌫️",
    6 : "🌫️",
    7 : "🌫️",
    8 : "🌪️",
    9 : "🌪️",
    10 : "🌫️",
    11 : "🌨",
    12 : "🌨",
    13 : "⚡",
    14 : "☁️",
    15 : "☁️",
    16 : "☁️",
    17 : "🌩️",
    18: "☁️",
    19: "☁️",
    20: "☁️",
    21: "☔",
    22: "🌨️",
    23: "🌨️",
    24: "🌨️",
    25: "🌨",
    26: "🌨",
    26: "🌨",
    27: "⛆",
    28: "🌫️",
    29: "🌩️",
    30: "🌪️",
    31: "🌪️",
    32: "🌪️",
    33: "🌪️",
    34: "🌪️",
    35: "🌪️",
    36: "❄️",
    37: "❄️",
    38: "🏂",
    39: "❄️",
    40: "❄️🌫️",
    41: "❄️🌫️",
    42: "❄️🌫️",
    43: "❄️🌫️",
    44: "❄️🌫️",
    45: "❄️🌫️",
    46: "❄️🌫️",
    47: "❄️🌫️",
    48: "🌫️",
    49: "🌫️",
    50: "🌨",
    51: "🌨",
    52: "🌨",
    53: "🌨",
    54: "🌨",
    55: "🌨",
    56: "🌨",
    57: "🌨",
    58: "🌨",
    59: "🌨",
    60: "🌨",
    61: "☔",
    62: "☔",
    63: "☔",
    64: "☔",
    65: "☔",
    66: "☔",
    67: "☔",
    68: "☔",
    69: "☔",
    70: "❄️",
    71: "❄️",
    72: "❄️",
    73: "❄️",
    74: "❄️",
    75: "❄️",
    76: "❄️🌪️",
    77: "❄️",
    78: "❄️",
    79: "❄️",
    80: "🌨",
    81: "🌨",
    82: "🌨",
    83: "🌨",
    84: "🌨",
    85: "🌨️",
    86: "🌨️",
    87: "🌨️",
    88: "🌨️",
    89: "🌨️",
    90: "🌨️",
    91: "🌨",
    92: "🌨",
    93: "🌨",
    94: "🌨️",
    95: "🌩️",
    96: "🌩️",
    97: "🌩️",
    98: "🌩️",
    99: "🌩️"
  };

  // Split data into daily chunks
  const dailyData = [];
  for (let i = 0; i < weatherValues.length; i += 24) {
    const dailyValues = weatherValues.slice(i, i + 24);
    const dailyTimestamps = timestamps.slice(i, i + 24);
    const dailyCodes = weatherCodes.slice(i, i + 24);
    dailyData.push({ values: dailyValues, timestamps: dailyTimestamps, codes: dailyCodes });
  }

  // Process each day's data
  const formattedData = dailyData.map((day) => {
    const { values, timestamps, codes } = day;

    // Convert temperature values to Fahrenheit if checkbox is checked
    const isFahrenheit = fahrenheitCheck.checked;
    const convertedValues = isFahrenheit ? values.map(value => Math.floor((value * 9/5) + 32)) : values;

    // Find highest and lowest values with corresponding timestamps and codes
    const highestValue = Math.max(...convertedValues);
    const lowestValue = Math.min(...convertedValues);
    const highestIndex = convertedValues.indexOf(highestValue);
    const lowestIndex = convertedValues.indexOf(lowestValue);

    const highestTime = new Date(timestamps[highestIndex] * 1000); // Convert timestamp to milliseconds
    const lowestTime = new Date(timestamps[lowestIndex] * 1000);

    const highestCode = codes[highestIndex];

    return {
      highest: {
        value: highestValue,
        time: highestTime.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }), // Format for display
        code: highestCode,
        description: weatherCodeMap[highestCode] || "Unknown"
      },
      lowest: {
        value: lowestValue,
      },
    };
  });

  return formattedData;
}

fahrenheitCheck.addEventListener('change', () => {
  outputContainer.innerHTML = "";
  getAPIData(selectElement.value);
})

