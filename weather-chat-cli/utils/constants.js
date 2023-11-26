export const EXIT_PROMPT = {
  label: "Exit",
  option: "9",
  subPrompts: null,
  action: "exit",
};

export const GUEST_USER = {
  fullName: "Guest",
  city: "New York",
  country: "United States",
  defaultDegree: "celsius",
};

export const SERVICE_URLS = {
  currentWeather:
    "https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=apparent_temperature&timezone={timezone}",
  geoSearch:
    "https://geocoding-api.open-meteo.com/v1/search?name={name}&count=5",
};

export const DEGREE_UNIT = {
  c: "celsius",
  f: "fahrenheit",
};

export const constants = {
  EXIT_PROMPT,
  SERVICE_URLS,
  DEGREE_UNIT,
};

export default constants;
