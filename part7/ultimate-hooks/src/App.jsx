import { useState } from 'react'
import { useResource } from './hooks/useResource'

const App = () => {
    const [value, setValue] = useState('')
    const [notes, noteService] = useResource('/api/notes')
    const [persons, personService] = useResource('/api/persons')

    const handleNoteSubmit = (e) => {
        e.preventDefault()
        noteService.create({ content: value })
        setValue('')
    }

    const handlePersonSubmit = (e) => {
        e.preventDefault()
        personService.create({ name: value, number: '123-4567890' })
        setValue('')
    }

    return (
        <div>
            <h2>Notes</h2>
            <form onSubmit={handleNoteSubmit}>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button>create</button>
            </form>
            {notes.map(n => <p key={n.id}>{n.content}</p>)}

            <h2>Persons</h2>
            <form onSubmit={handlePersonSubmit}>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button>create</button>
            </form>
            {persons.map(p => <p key={p.id}>{p.name} {p.number}</p>)}
        </div>
    )
}

export default App