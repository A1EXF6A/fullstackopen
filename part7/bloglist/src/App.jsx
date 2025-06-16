import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { showNotification } from './reducers/notificationReducer'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import User from './components/User'

const App = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const blogs = useSelector(state => state.blogs)
    const notification = useSelector(state => state.notification)

    useEffect(() => {
        dispatch(initializeBlogs())
        dispatch(initializeUser())
    }, [dispatch])

    const blogFormRef = useRef()

    const handleCreateBlog = async (blog) => {
        try {
            blogFormRef.current.toggleVisibility()
            await dispatch(createBlog(blog))
            dispatch(showNotification(`a new blog ${blog.title} by ${blog.author} added`))
        } catch (exception) {
            dispatch(showNotification('failed to create blog', 'error'))
        }
    }

    const handleUpdateBlog = async (id, blog) => {
        try {
            await dispatch(updateBlog(id, blog))
            dispatch(showNotification(`blog ${blog.title} updated`))
        } catch (exception) {
            dispatch(showNotification('failed to update blog', 'error'))
        }
    }

    const handleDeleteBlog = async (id) => {
        try {
            await dispatch(deleteBlog(id))
            dispatch(showNotification('blog deleted'))
        } catch (exception) {
            dispatch(showNotification('failed to delete blog', 'error'))
        }
    }

    if (user === null) {
        return (
            <div>
                <Notification notification={notification} />
                <LoginForm />
            </div>
        )
    }

    return (
        <div>
            <Notification notification={notification} />
            <User user={user} />
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm createBlog={handleCreateBlog} />
            </Togglable>
            <BlogList
                blogs={blogs}
                updateBlog={handleUpdateBlog}
                deleteBlog={handleDeleteBlog}
                user={user}
            />
        </div>
    )
}

export default App