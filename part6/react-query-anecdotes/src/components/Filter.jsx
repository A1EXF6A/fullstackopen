import { useState } from 'react'

const Filter = () => {
    const [filter, setFilter] = useState('')

    const handleChange = (event) => {
        setFilter(event.target.value)
    }

    return (
        <div>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter