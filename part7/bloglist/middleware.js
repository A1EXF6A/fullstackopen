module.exports = (req, res, next) => {
    if (req.method === 'POST' && req.path.includes('/comments')) {
        const blogId = req.path.split('/')[2]
        const fs = require('fs')
        const path = require('path')
        const dbPath = path.join(__dirname, 'db.json')
        const db = JSON.parse(fs.readFileSync(dbPath))

        const blog = db.blogs.find(b => b.id === blogId)

        if (blog) {
            const newComment = {
                id: Date.now().toString(),
                content: req.body.content,
                date: new Date().toISOString()
            }

            blog.comments = blog.comments || []
            blog.comments.push(newComment)

            // Guardar los cambios en el archivo db.json
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

            res.status(201).json(newComment)
            return
        }
    }
    next()
}