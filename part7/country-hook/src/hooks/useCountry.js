import { useState } from 'react'

export const useCountry = () => {
    const [error, setError] = useState(null)

    const searchCountry = async (name) => {
        try {
            setError(null)
            if (!name.trim()) return null

            const response = await fetch(
                `https://restcountries.com/v3.1/name/${name}?fullText=true`
            )

            if (!response.ok) {
                throw new Error('Country not found')
            }

            const data = await response.json()
            return data[0]
        } catch (err) {
            setError(err.message)
            return null
        }
    }

    return { searchCountry, error }
}