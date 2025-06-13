import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs => {
            setBlogs(blogs.sort((a, b) => b.likes - a.likes))
        })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (credentials) => {
        try {
            const user = await loginService.login(credentials)
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setNotification({ message: 'Login successful', type: 'success' })
            setTimeout(() => setNotification(null), 5000)
        } catch (exception) {
            setNotification({ message: 'Wrong credentials', type: 'error' })
            setTimeout(() => setNotification(null), 5000)
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    const addBlog = async (blogObject) => {
        try {
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
            setNotification({
                message: `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
                type: 'success'
            })
            setTimeout(() => setNotification(null), 5000)
            return true
        } catch (exception) {
            setNotification({ message: 'Failed to add blog', type: 'error' })
            setTimeout(() => setNotification(null), 5000)
            return false
        }
    }

    const updateBlog = async (id, blogObject) => {
        try {
            const updatedBlog = await blogService.update(id, blogObject)
            setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog)
                .sort((a, b) => b.likes - a.likes))
            return updatedBlog
        } catch (exception) {
            setNotification({ message: 'Failed to update blog', type: 'error' })
            setTimeout(() => setNotification(null), 5000)
            return null
        }
    }

    const removeBlog = async (id) => {
        if (window.confirm('Remove blog?')) {
            try {
                await blogService.remove(id)
                setBlogs(blogs.filter(blog => blog.id !== id))
                setNotification({ message: 'Blog removed', type: 'success' })
                setTimeout(() => setNotification(null), 5000)
            } catch (exception) {
                setNotification({ message: 'Failed to remove blog', type: 'error' })
                setTimeout(() => setNotification(null), 5000)
            }
        }
    }

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification notification={notification} />
                <LoginForm handleLogin={handleLogin} />
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification notification={notification} />
            <p>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>

            <Togglable buttonLabel="create new blog">
                <BlogForm createBlog={addBlog} />
            </Togglable>

            {blogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    updateBlog={updateBlog}
                    removeBlog={removeBlog}
                    user={user}
                />
            )}
        </div>
    )
}

export default App