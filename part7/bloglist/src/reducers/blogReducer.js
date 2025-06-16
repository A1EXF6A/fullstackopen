import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        appendBlog(state, action) {
            state.push(action.payload)
        },
        updateBlogInState(state, action) {
            return state.map(blog =>
                blog.id === action.payload.id ? action.payload : blog
            )
        },
        removeBlogFromState(state, action) {
            return state.filter(blog => blog.id !== action.payload)
        },
        appendComment(state, action) {
            const { blogId, comment } = action.payload
            return state.map(blog =>
                blog.id === blogId
                    ? {
                        ...blog,
                        comments: blog.comments
                            ? blog.comments.concat(comment)
                            : [comment]
                    }
                    : blog
            )
        }
    }
})

export const {
    setBlogs,
    appendBlog,
    updateBlogInState,
    removeBlogFromState,
    appendComment
} = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blog) => {
    return async dispatch => {
        const newBlog = await blogService.create(blog)
        dispatch(appendBlog(newBlog))
        return newBlog
    }
}

export const updateBlog = (id, blog) => {
    return async dispatch => {
        const updatedBlog = await blogService.update(id, blog)
        dispatch(updateBlogInState(updatedBlog))
        return updatedBlog
    }
}

export const deleteBlog = (id) => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(removeBlogFromState(id))
    }
}

export const createComment = (blogId, content) => {
    return async dispatch => {
        try {
            const comment = await blogService.createComment(blogId, content)
            dispatch(appendComment({ blogId, comment }))
            return comment
        } catch (error) {
            console.error('Error creating comment:', error)
            throw error
        }
    }
}

export default blogSlice.reducer