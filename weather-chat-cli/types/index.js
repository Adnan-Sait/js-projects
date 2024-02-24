/**
 * @typedef     {Object}            Prompt
 * @property    {string}            label
 * @property    {Prompt[] | null}   subPrompts
 * @property    {string}            action
 * @property    {string}            condition JS condition that can be evaluated. Must evaluate to a boolean.
 */

/**
 * @typedef     {Object}    User
 * @property    {string}    fullName
 * @property    {string}    city
 * @property    {string}    country
 * @property    {string}    timezone
 * @property    {"celsius" | "fahrenheit"}    defaultDegree
 * @property    {number}    latitude
 * @property    {number}    longitude
 */

/**
 * @typedef     {Object}            GeoLocationData
 * @property    {string}            name
 * @property    {number}            latitude
 * @property    {number}            longitude
 * @property    {string}            country
 * @property    {string}            timezone
 */

/**
 * @typedef     {Object}              GeoLocationResponse
 * @property    {GeoLocationData[]}   results
 */

/**
 * @typedef     {Object}            WeatherData
 * @property    {string}            time
 * @property    {number}            interval
 * @property    {number}            apparent_temperature
 */

/**
 * @typedef     {Object}            WeatherUnits
 * @property    {string}            time
 * @property    {string}            interval
 * @property    {string}            apparent_temperature
 */

/**
 * @typedef     {Object}            WeatherResponse
 * @property    {number}            latitude
 * @property    {number}            longitude
 * @property    {WeatherUnits}      current_units
 * @property    {WeatherData}       current
 */

/**
 * @typedef     {Object}            WeatherTransactionsLog
 * @property    {Date}              timestamp
 * @property    {string}            weatherData
 */

/**
 * @typedef     {Object}                      AppState
 * @property    {User}                        selectedUser
 * @property    {WeatherTransactionsLog[]}    weatherTransactions
 */

/**
 * @template    T
 * @typedef     {Object}            AppAction
 * @property    {string}            type
 * @property    {T}                 payload
 */

/**
 * Empty export required for VSCode intellisense to bind types.
 */
export {};
