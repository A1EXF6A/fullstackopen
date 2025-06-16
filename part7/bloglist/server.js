// server.js
import jsonServer from 'json-server'
import bodyParser from 'body-parser'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(bodyParser.json())

// Endpoint personalizado: /login
server.post('/login', (req, res) => {
    const { username, password } = req.body
    const users = router.db.get('users').value()

    const user = users.find(u => u.username === username && u.password === password)

    if (user) {
        res.status(200).json({
            username: user.username,
            name: user.name,
            token: 'fake-jwt-token',
        })
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' })
    }
})

server.use(router)

server.listen(3001, () => {
    console.log('✅ JSON Server corriendo en http://localhost:3001')
})
