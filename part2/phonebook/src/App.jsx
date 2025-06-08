import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    personService.getAll().then(setPersons)
  }, [])

  const handleNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: '' }), 5000)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()
    const existing = persons.find(p => p.name === newName)

    if (existing) {
      const confirmUpdate = window.confirm(`${newName} is already added. Replace the number?`)
      if (confirmUpdate) {
        const updated = { ...existing, number: newNumber }
        personService.update(existing.id, updated)
          .then(returned => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returned))
            handleNotification(`Updated ${newName}`)
          })
          .catch(() => {
            handleNotification(`Info of ${newName} was already removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }
    personService.create(newPerson).then(returned => {
      setPersons(persons.concat(returned))
      handleNotification(`Added ${newName}`)
      setNewName('')
      setNewNumber('')
    })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        handleNotification(`Deleted ${person.name}`)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={e => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleAddPerson}
        name={newName}
        number={newNumber}
        onNameChange={e => setNewName(e.target.value)}
        onNumberChange={e => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} onDelete={handleDelete} />
    </div>
  )
}

export default App