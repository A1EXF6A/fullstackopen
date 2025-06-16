import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/blogReducer'

const CommentForm = ({ blogId }) => {
    const [content, setContent] = useState('')
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(createComment(blogId, content))
            setContent('')
        } catch (error) {
            // El error ya se maneja en el reducer
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={content}
                onChange={({ target }) => setContent(target.value)}
                placeholder="Add a comment..."
                required
            />
            <button type="submit">add comment</button>
        </form>
    )
}

export default CommentForm