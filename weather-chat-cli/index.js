import fs from "node:fs";
import { startChat } from "./operations/chat.op.js";

/**
 * @typedef     {Object}            Prompt
 * @property    {String}            label
 * @property    {String}            id
 * @property    {Prompt[] | null}   subPrompts
 * @property    {String}            action
 */

/**
 * @typedef     {Object}            GeoLocationData
 * @property    {String}            name
 * @property    {Number}            latitude
 * @property    {Number}            longitude
 * @property    {String}            country
 * @property    {String}            timezone
 */

/**
 * @typedef     {Object}              GeoLocationResponse
 * @property    {GeoLocationData[]}   results
 */

/**
 * @typedef     {Object}            WeatherData
 * @property    {String}            time
 * @property    {Number}            interval
 * @property    {Number}            apparent_temperature
 */

/**
 * @typedef     {Object}            WeatherUnits
 * @property    {String}            time
 * @property    {String}            interval
 * @property    {String}            apparent_temperature
 */

/**
 * @typedef     {Object}            WeatherResponse
 * @property    {Number}            latitude
 * @property    {Number}            longitude
 * @property    {WeatherUnits}      current_units
 * @property    {WeatherData}       current
 */

/**
 * @type {Prompt[]}
 */
const promptsJson = JSON.parse(fs.readFileSync("./data/prompts.json"));
const labelsJson = JSON.parse(fs.readFileSync("./data/labels.json"));

function main() {
  startChat(promptsJson, labelsJson);
}

main();
