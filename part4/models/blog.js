const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    author: {
        type: String,
        required: true,
        minlength: 3
    },
    url: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: String,
            minlength: 1
        }
    ]
})

blogSchema.plugin(uniqueValidator)

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)