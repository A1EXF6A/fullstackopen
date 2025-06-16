const Country = ({ country }) => {
    if (!country) return null

    return (
        <div className="country-info">
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}</p>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>Region: {country.region}</p>
            <p>Languages: {Object.values(country.languages).join(', ')}</p>
            <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
            />
        </div>
    )
}

export default Country