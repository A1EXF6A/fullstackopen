import { useState } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import Anecdote from './components/Anecdote'
import CreateAnecdote from './components/CreateAnecdote'
import Footer from './components/Footer'
import Notification from './components/Notification'
import { anecdotes as initialAnecdotes } from './data'

const App = () => {
    const [anecdotes, setAnecdotes] = useState(initialAnecdotes)
    const [notification, setNotification] = useState('')

    const match = useMatch('/anecdotes/:id')
    const anecdote = match
        ? anecdotes.find(a => a.id === Number(match.params.id))
        : null

    const addNew = (anecdote) => {
        anecdote.id = Math.round(Math.random() * 10000)
        setAnecdotes(anecdotes.concat(anecdote))
        setNotification(`A new anecdote "${anecdote.content}" created!`)
        setTimeout(() => {
            setNotification('')
        }, 5000)
    }

    const anecdoteById = (id) => anecdotes.find(a => a.id === id)

    const vote = (id) => {
        const anecdote = anecdoteById(id)
        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1
        }
        setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
    }

    return (
        <div>
            <h1>Software anecdotes</h1>
            <Menu />
            <Notification message={notification} />
            <Routes>
                <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
                <Route path="/create" element={<CreateAnecdote addNew={addNew} />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App