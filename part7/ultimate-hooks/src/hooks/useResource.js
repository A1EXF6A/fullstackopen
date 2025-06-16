import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    useEffect(() => {
        axios.get(baseUrl)
            .then(response => setResources(response.data))
            .catch(error => console.error('Error fetching resources:', error))
    }, [baseUrl])

    const create = async (resource) => {
        try {
            const response = await axios.post(baseUrl, resource)
            setResources([...resources, response.data])
        } catch (error) {
            console.error('Error creating resource:', error)
        }
    }

    const update = async (id, resource) => {
        try {
            const response = await axios.put(`${baseUrl}/${id}`, resource)
            setResources(resources.map(r => r.id === id ? response.data : r))
        } catch (error) {
            console.error('Error updating resource:', error)
        }
    }

    const remove = async (id) => {
        try {
            await axios.delete(`${baseUrl}/${id}`)
            setResources(resources.filter(r => r.id !== id))
        } catch (error) {
            console.error('Error deleting resource:', error)
        }
    }

    const service = {
        create,
        update,
        remove
    }

    return [resources, service]
}