import { useState } from 'react'
import { useCountry } from '../hooks/useCountry'

const Search = ({ onCountryFound }) => {
    const [query, setQuery] = useState('')
    const { searchCountry } = useCountry()

    const handleSearch = async (e) => {
        e.preventDefault()
        const country = await searchCountry(query)
        onCountryFound(country)
    }

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter country name"
            />
            <button type="submit">Search</button>
        </form>
    )
}

export default Search