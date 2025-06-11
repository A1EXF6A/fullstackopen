const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let token = ''

beforeEach(async () => {
    // Limpieza completa de la base de datos
    await mongoose.connection.dropDatabase()

    // Crear usuario de prueba con username único
    const username = `testuser_${Date.now()}`
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username, passwordHash })
    await user.save()

    // Generar token JWT
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

    // Crear blogs iniciales asociados al usuario
    const blogObjects = helper.initialBlogs.map(blog => ({
        ...blog,
        user: user._id
    }))
    await Blog.insertMany(blogObjects)
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
        const titles = response.body.map(r => r.title)
        expect(titles).toContain('React patterns')
    })

    test('blogs have id property', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
        expect(response.body[0].id).toBeDefined()
    })
})

describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://test.com',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('Test Blog')
    })

    test('defaults likes to 0 if missing', async () => {
        const newBlog = {
            title: 'No Likes Blog',
            author: 'No Likes Author',
            url: 'http://nolikes.com'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        expect(response.body.likes).toBe(0)
    })

    test('fails with status code 400 if title is missing', async () => {
        const newBlog = {
            author: 'No Title Author',
            url: 'http://notitle.com',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('fails with status code 400 if url is missing', async () => {
        const newBlog = {
            title: 'No URL Blog',
            author: 'No URL Author',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('fails with status code 401 if token is missing', async () => {
        const newBlog = {
            title: 'Unauthorized Blog',
            author: 'Unauthorized Author',
            url: 'http://unauthorized.com',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blogToDelete.title)
    })



    test('fails with status code 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .delete(`/api/blogs/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })
})

describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
        expect(updatedBlogInDb.likes).toBe(blogToUpdate.likes + 1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})