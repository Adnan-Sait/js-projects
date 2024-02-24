/**
 * @typedef     {Object}            Prompt
 * @property    {String}            label
 * @property    {Prompt[] | null}   subPrompts
 * @property    {String}            action
 * @property    {String}            condition JS condition that can be evaluated. Must evaluate to a boolean.
 */

/**
 * @typedef     {Object}    User
 * @property    {String}    fullName
 * @property    {String}    city
 * @property    {String}    country
 * @property    {String}    timezone
 * @property    {"celsius" | "fahrenheit"}    defaultDegree
 * @property    {Number}    latitude
 * @property    {Number}    longitude
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
 * @typedef     {Object}            WeatherTransactionsLog
 * @property    {Date}              timestamp
 * @property    {String}            weatherData
 */

/**
 * @typedef     {Object}                      AppState
 * @property    {User}                        selectedUser
 * @property    {WeatherTransactionsLog[]}    weatherTransactions
 */

/**
 * @template    T
 * @typedef     {Object}            AppAction
 * @property    {String}            type
 * @property    {T}                 payload
 */

/**
 * Empty export required for VSCode intellisense to bind types.
 */
export {};