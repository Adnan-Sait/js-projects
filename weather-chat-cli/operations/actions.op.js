import { getCurrentWeather, searchCity } from '../services/weather.sv.js';
import {
  getFormattedTimeZone,
  getGmtFormattedDateTime,
} from '../utils/dateFunctions.js';
import consoleUtils from '../utils/consoleFunctions.js';
import {
  findWeatherSeverity,
  formatTemperature,
} from '../utils/temperatureFunctions.js';
import { DEGREE_UNIT } from '../utils/constants.js';
import store from '../store/store.js';

/**
 * Invokes reducers based on the specified action
 *
 * @param {string} action Action to be performed.
 * @param {import('../types/index.js').User} user The active user.
 * @param {readline.Interface} rlInterface Interface to get user input
 * @returns {Promise<boolean>}  true - if the chat needs to be terminated, false - if the chat must be restarted.
 */
export async function actionsReducer(action, user, rlInterface) {
  let returnVal;
  switch (action) {
    case 'weather-home': {
      const response = await getWeather(
        user.latitude,
        user.longitude,
        user.timezone,
        user.city,
        user.defaultDegree,
      );
      if (response?.length > 0) {
        consoleUtils.data(response);
      } else if (response === undefined) {
        consoleUtils.error('Error getting weather data for your home location');
      }
      returnVal = false;
      break;
    }
    case 'weather-other': {
      const chosenCity = await selectCity(rlInterface);

      if (chosenCity) {
        const response = await getWeather(
          chosenCity.latitude,
          chosenCity.longitude,
          chosenCity.timezone || user.timezone,
          chosenCity.name,
          user.defaultDegree,
        );

        if (response?.length > 0) {
          consoleUtils.data(response);
        } else if (response === undefined) {
          consoleUtils.error('Error getting weather data for the location');
        }
      }
      returnVal = false;
      break;
    }
    case 'settings-temp-C': {
      const degree = updateTempUnit(DEGREE_UNIT.c);
      consoleUtils.info('Temperature Unit Set to: ', degree);
      returnVal = false;
      break;
    }
    case 'settings-temp-F': {
      const degree = updateTempUnit(DEGREE_UNIT.f);
      consoleUtils.info('Temperature Unit Set to: ', degree);
      returnVal = false;
      break;
    }
    case 'settings-city': {
      const chosenCity = await selectCity(rlInterface);

      if (chosenCity) {
        /**
         * @type {import('../types/index.js').User}
         */
        const updatedUser = {
          city: chosenCity.name,
          latitude: chosenCity.latitude,
          longitude: chosenCity.longitude,
          country: chosenCity.country,
          timezone: chosenCity.timezone || user.timezone,
        };
        store.dispatch({ type: 'user/updateCity', payload: updatedUser });
        const { selectedUser } = store.getState((state) => state.app);

        consoleUtils.info(
          `Hometown Set to: ${selectedUser.city}, ${selectedUser.country}`,
        );
      }

      returnVal = false;
      break;
    }
    case 'transaction-logs': {
      const { weatherTransactions } = store.getState((state) => state.app);

      const logs = weatherTransactions.map((data) => {
        return `${getGmtFormattedDateTime(data.timestamp)}: ${
          data.weatherData
        }`;
      });

      consoleUtils.info(logs.join('\n'));

      returnVal = false;
      break;
    }
    default: {
      returnVal = false;
    }
  }

  return returnVal;
}

/**
 * Retrieves the weather and returns the string to be shown.
 *
 * @param {number} latitude Latitude
 * @param {number} longitude Longitude
 * @param {string} timezone Timezone
 * @param {string} cityName Name of the city
 * @param {"celsius" | "fahrenheit"} unit Temperature unit
 * @returns {Promise<string | null>} null is returned incase of an error.
 */
async function getWeather(latitude, longitude, timezone, cityName, unit) {
  try {
    const response = await getCurrentWeather(
      latitude,
      longitude,
      timezone,
      unit,
    );
    if (response?.current && response?.current_units) {
      const time = new Date(response.current.time);
      const formattedTime = getFormattedTimeZone(time);
      const responseUnit =
        DEGREE_UNIT[
          response.current_units.apparent_temperature.toLowerCase().at(1)
        ];
      const severity = findWeatherSeverity(
        response.current.apparent_temperature,
        responseUnit,
      );

      const weatherResponse = `Temperature in ${cityName} was ${formatTemperature(
        `${response.current.apparent_temperature}${response.current_units.apparent_temperature}`,
        severity,
      )} at ${formattedTime} ${timezone}`;

      /**
       * @type {import('../types/index.js').WeatherTransactionsLog}
       */
      const weatherTransaction = {
        timestamp: new Date(),
        weatherData: weatherResponse,
      };

      store.dispatch({ type: 'weather/add', payload: weatherTransaction });
      return weatherResponse;
    }
    throw new Error('Data field is not present');
  } catch (err) {
    consoleUtils.error(
      'Error getting data from Weather Service: ',
      err.message,
      '\nPlease try again later.',
    );
    return '';
  }
}

/**
 * Retrieves the cities that match this name.
 *
 * @param {string} name City name to search
 * @returns {Promise<import('../types/index.js').GeoLocationData[] | null>}
 */
async function getCitiesByName(name) {
  try {
    const response = await searchCity(name);

    if (response) {
      if (!response.results || response.results.length === 0) {
        return [];
      }
      return response.results;
    }
    throw new Error('Data field is not present');
  } catch (err) {
    consoleUtils.error(
      'Error getting data from Weather Service: ',
      err.message,
      '\nPlease try again later.',
    );
    return '';
  }
}

/**
 * Prompts the user to enter the name of city and select it.
 *
 * @param {readline.Interface} rlInterface
 *
 * @returns {Promise<import('../types/index.js').GeoLocationData | null>} City if found, else null.
 */
async function selectCity(rlInterface) {
  const cityName = await rlInterface.question(
    consoleUtils.prompt('Please enter the name of the city: '),
  );
  const cities = await getCitiesByName(cityName);
  if (!cities || cities.length === 0) {
    consoleUtils.error(
      'Could not find any matching cities. Please check the entered city name.',
    );
    return null;
  }

  const filteredCities = cities.filter(validateCityData);

  consoleUtils.data(
    `Found ${filteredCities.length} ${
      filteredCities.length > 1 ? 'Cities' : 'City'
    }.`,
  );
  const prompt = filteredCities.reduce((acc, item, index) => {
    const promptStr = `${index}: ${item.name}, ${item.country}`;
    const endChar = filteredCities.length - index > 1 ? '\n' : '';
    return `${acc}${promptStr}${endChar}`;
  }, '');

  let selectedOption;

  while (!selectedOption) {
    consoleUtils.options(prompt);
    // eslint-disable-next-line no-await-in-loop
    selectedOption = await rlInterface.question(
      consoleUtils.prompt('Enter your response: '),
    );

    if (!filteredCities[Number(selectedOption)]) {
      consoleUtils.error(
        `Invalid option '${selectedOption}'.\nPlease select a valid option.`,
      );
      selectedOption = null;
    }
  }

  const chosenCity = filteredCities[Number(selectedOption)];

  if (chosenCity) {
    return chosenCity;
  }
  return null;
}

/**
 * Validates if the city object is valid.
 * The city object must contain name, latitude, longitude, and country to be valid.
 *
 * @param {import('../types/index.js').GeoLocationData} city
 *
 * @returns {boolean} true if valid, false if invalid.
 */
function validateCityData(city) {
  if (city.name && city.country && city.latitude && city.longitude) {
    return true;
  }
  return false;
}

/**
 * Updates the Temperature Unit and returns the updated value.
 *
 * @param {"celsius" | "fahrenheit"} degreeUnit Degree Unit
 *
 * @returns {"celsius" | "fahrenheit"} updated degree unit
 */
function updateTempUnit(degreeUnit) {
  store.dispatch({
    type: 'user/updateMetric',
    payload: degreeUnit,
  });
  const {
    selectedUser: { defaultDegree },
  } = store.getState((state) => state.app);

  return defaultDegree;
}

export default actionsReducer;
