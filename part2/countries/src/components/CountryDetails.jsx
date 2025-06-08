import { useEffect, useState } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`)

      .then(response => setWeather(response.data))
  }, [country.capital, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" width="100" />
      {weather && (
        <>
          <h4>Weather in {country.capital[0]}</h4>
          <p>temperature: {weather.main.temp} °C</p>
          <img src={`https://openweathermap.org/img/wn/\${weather.weather[0].icon}@2x.png`} alt="weather icon" />
          <p>wind: {weather.wind.speed} m/s</p>
        </>
      )}
    </div>
  )
}

export default CountryDetails