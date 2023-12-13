import readline from "node:readline/promises";
import { getCurrentWeather, searchCity } from "../services/weather.sv.js";
import { getFormattedTimeZone } from "../utils/dateFunctions.js";
import consoleUtils from "../utils/consoleFunctions.js";
import {
  findWeatherSeverity,
  formatTemperature,
} from "../utils/temperatureFunctions.js";
import constants from "../utils/constants.js";
import store from "../store/store.js";

/**
 * Invokes reducers based on the specified action
 *
 * @param {String} action Action to be performed.
 * @param {import("..").User} user The active user.
 * @param {readline.Interface} rlInterface Interface to get user input
 * @returns {Promise<Boolean>}  true - if the chat needs to be terminated, false - if the chat must be restarted.
 */
export async function actionsReducer(action, user, rlInterface) {
  let returnVal;
  switch (action) {
    case "weather-home": {
      const response = await getWeather(
        user.latitude,
        user.longitude,
        user.timezone,
        user.city,
        user.defaultDegree
      );
      if (response) {
        consoleUtils.data(response);
      } else {
        consoleUtils.error("Error getting weather data for your home location");
      }
      returnVal = false;
      break;
    }
    case "weather-other": {
      const cityName = await rlInterface.question(
        consoleUtils.prompt("Please enter the name of the city: ")
      );
      const cities = await getCitiesByName(cityName);
      if (cities && cities.length > 0) {
        consoleUtils.data(`Found ${cities.length} cities.`);
        const prompt = cities.reduce((acc, item, index) => {
          const promptStr = `${index}: ${item.name}, ${item.country}`;
          const endChar = cities.length - index > 1 ? "\n" : "";
          return `${acc}${promptStr}${endChar}`;
        }, "");
        consoleUtils.options(prompt);
        const option = await rlInterface.question(
          consoleUtils.prompt("Enter your response: ")
        );

        const chosenOption = cities[Number(option)];

        if (chosenOption) {
          const response = await getWeather(
            chosenOption.latitude,
            chosenOption.longitude,
            chosenOption.timezone || user.timezone,
            chosenOption.name,
            user.defaultDegree
          );

          if (response) {
            consoleUtils.data(response);
          } else {
            consoleUtils.error("Error getting weather data for the location");
          }
        }
      } else {
        consoleUtils.error(
          "Could not find any matching cities. Please check the entered city name."
        );
      }
      returnVal = false;
      break;
    }
    case "settings-temp-C": {
      const degree = updateTempUnit(constants.DEGREE_UNIT.c);
      consoleUtils.info("Temperature Unit Set to: ", degree);
      returnVal = false;
      break;
    }
    case "settings-temp-F": {
      const degree = updateTempUnit(constants.DEGREE_UNIT.f);
      consoleUtils.info("Temperature Unit Set to: ", degree);
      returnVal = false;
      break;
    }
    case "settings-city": {
      console.log("settings city");
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
 * @param {Number} latitude Latitude
 * @param {Number} longitude Longitude
 * @param {String} timezone Timezone
 * @param {String} cityName Name of the city
 * @param {"celsius" | "fahrenheit"} unit Temperature unit
 * @returns {Promise<String | null>} null is returned incase of an error.
 */
async function getWeather(latitude, longitude, timezone, cityName, unit) {
  try {
    const response = await getCurrentWeather(
      latitude,
      longitude,
      timezone,
      unit
    );
    if (response?.current && response?.current_units) {
      const time = new Date(response.current.time);
      const formattedTime = getFormattedTimeZone(time);
      const unit =
        constants.DEGREE_UNIT[
          response.current_units.apparent_temperature.toLowerCase().at(1)
        ];
      const severity = findWeatherSeverity(
        response.current.apparent_temperature,
        unit
      );
      return `Temperature in ${cityName} was ${formatTemperature(
        `${response.current.apparent_temperature}${response.current_units.apparent_temperature}`,
        severity
      )} at ${formattedTime} ${timezone}`;
    } else {
      throw new Error("Data field is not present");
    }
  } catch (err) {
    // console.error(`Error in 'getWeather', `, err);
    return null;
  }
}

/**
 * Retrieves the cities that match this name.
 *
 * @param {String} name City name to search
 * @returns {Promise<import("..").GeoLocationData[] | null>}
 */
async function getCitiesByName(name) {
  try {
    const response = await searchCity(name);

    if (response) {
      if (!response.results || response.results.length === 0) {
        return [];
      } else {
        return response.results;
      }
    } else {
      throw new Error("Data field is not present");
    }
  } catch (err) {
    // console.err(`Error in 'getCitiesByName', `, err.message);
    return null;
  }
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
    type: "user/updateMetric",
    payload: degreeUnit,
  });
  const { defaultDegree } = store.getState().selectedUser;

  return defaultDegree;
}
