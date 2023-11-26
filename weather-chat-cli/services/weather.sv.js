import constants from "../utils/constants.js";

/**
 * Invokes the weather service with the specified parameters.
 *
 * @param {Number} latitude Latitude
 * @param {Number} longitude Longitude
 * @param {String} timezone Timezone name
 * @returns {Promise<import("..").WeatherResponse>} Weather data
 */
export async function getCurrentWeather(latitude, longitude, timezone) {
  let url = constants.SERVICE_URLS.currentWeather;
  url = url
    .replace("{latitude}", latitude)
    .replace("{longitude}", longitude)
    .replace("{timezone}", timezone);
  try {
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else {
      const responseText = await response.text();
      throw new Error(responseText);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Get list of cities that match the name.
 *
 * @param {String} name Name of the city to be searched.
 * @returns {Promise<import("..").GeoLocationResponse>} Cities
 */
export async function searchCity(name) {
  let url = constants.SERVICE_URLS.geoSearch;
  url = url.replace("{name}", name);
  try {
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else {
      const responseText = await response.text();
      throw new Error(responseText);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
