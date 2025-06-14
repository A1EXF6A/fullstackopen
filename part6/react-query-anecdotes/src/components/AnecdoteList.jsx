import { useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NotificationContext } from '../contexts/NotificationContext'
import { getAnecdotes, updateAnecdote } from '../services/anecdotes'

const AnecdoteList = () => {
    const { notificationDispatch } = useContext(NotificationContext)
    const queryClient = useQueryClient()

    // Obtener anécdotas con React Query
    const { isLoading, isError, data: anecdotes } = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        refetchOnWindowFocus: false
    })

    // Mutación para votar
    const voteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            notificationDispatch({
                type: 'SET',
                payload: {
                    message: `Voted for "${updatedAnecdote.content}"`,
                    type: 'success'
                }
            })
        },
        onError: (error) => {
            notificationDispatch({
                type: 'SET',
                payload: {
                    message: error.response?.data?.error || 'Failed to vote',
                    type: 'error'
                }
            })
        }
    })

    if (isLoading) return <div>Loading anecdotes...</div>
    if (isError) return <div>Error loading anecdotes</div>

    const handleVote = (anecdote) => {
        voteMutation.mutate({
            ...anecdote,
            votes: anecdote.votes + 1
        })
    }

    return (
        <div>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id} style={{ marginBottom: '1rem' }}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes} votes
                        <button
                            onClick={() => handleVote(anecdote)}
                            style={{ marginLeft: '0.5rem' }}
                        >
                            vote
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList