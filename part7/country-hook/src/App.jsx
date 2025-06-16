import { useState } from 'react'
import Search from './components/Search'
import Country from './components/Country'

const App = () => {
    const [country, setCountry] = useState(null)

    return (
        <div>
            <h1>Country Search</h1>
            <Search onCountryFound={setCountry} />
            {country && <Country country={country} />}
        </div>
    )
}

export default App