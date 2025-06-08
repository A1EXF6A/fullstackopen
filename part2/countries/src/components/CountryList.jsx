const CountryList = ({ countries, setSelected }) => {
  if (countries.length > 10) return <p>Too many matches, specify another filter</p>
  if (countries.length <= 10 && countries.length > 1) {
    return (
      <ul>
        {countries.map(c => (
          <li key={c.cca3}>
            {c.name.common} <button onClick={() => setSelected(c)}>show</button>
          </li>
        ))}
      </ul>
    )
  }
  return null
}

export default CountryList