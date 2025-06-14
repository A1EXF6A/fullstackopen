import { useState, useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationContext } from '../contexts/NotificationContext'
import { createAnecdote } from '../services/anecdotes'

const AnecdoteForm = () => {
    const [content, setContent] = useState('')
    const { notificationDispatch } = useContext(NotificationContext)
    const queryClient = useQueryClient()

    // Mutación para crear nueva anécdota
    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            notificationDispatch({
                type: 'SET',
                payload: {
                    message: `Created new anecdote: "${newAnecdote.content}"`,
                    type: 'success'
                }
            })
            setContent('')
        },
        onError: (error) => {
            notificationDispatch({
                type: 'SET',
                payload: {
                    message: error.response?.data?.error || 'Failed to create anecdote',
                    type: 'error'
                }
            })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (content.length < 5) {
            notificationDispatch({
                type: 'SET',
                payload: {
                    message: 'Anecdote must be at least 5 characters long',
                    type: 'error'
                }
            })
            return
        }
        newAnecdoteMutation.mutate(content)
    }

    return (
        <div>
            <h3>Create new</h3>
            <form onSubmit={handleSubmit}>
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your anecdote here..."
                    style={{ marginRight: '0.5rem' }}
                />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm