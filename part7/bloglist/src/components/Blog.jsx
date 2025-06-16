import { useState } from 'react'
import CommentForm from './CommentForm'
import Comment from './Comment'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = () => {
        updateBlog(blog.id, {
            ...blog,
            likes: blog.likes + 1,
        })
    }

    const handleRemove = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            deleteBlog(blog.id)
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle} className="blog">
            <div>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>
                    {visible ? 'hide' : 'view'}
                </button>
            </div>
            {visible && (
                <div>
                    <div>{blog.url}</div>
                    <div>
                        likes {blog.likes}
                        <button onClick={handleLike}>like</button>
                    </div>
                    <div>{blog.user.name}</div>
                    {user.username === blog.user.username && (
                        <button onClick={handleRemove}>remove</button>
                    )}
                    <h3>comments</h3>
                    <CommentForm blogId={blog.id} />
                    {blog.comments && blog.comments.map(comment => (
                        <Comment key={comment.id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Blog