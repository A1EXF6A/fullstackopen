import { useEffect, useState } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      find countries <input value={search} onChange={e => setSearch(e.target.value)} />
      <CountryList countries={filtered} setSelected={setSelected} />
      {filtered.length === 1 && <CountryDetails country={filtered[0]} />}
      {selected && <CountryDetails country={selected} />}
    </div>
  )
}

export default App