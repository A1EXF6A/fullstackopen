const mongoose = require('mongoose');
const Book = require('../models/Book');
const Author = require('../models/Author');
const User = require('../models/User');
const config = require('../utils/config');

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB for seeding');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const seedDatabase = async () => {
    await Book.deleteMany({});
    await Author.deleteMany({});
    await User.deleteMany({});

    const authors = [
        { name: 'Robert Martin', born: 1952 },
        { name: 'Martin Fowler', born: 1963 },
        { name: 'Fyodor Dostoevsky', born: 1821 },
        { name: 'Joshua Kerievsky' },
        { name: 'Sandi Metz' },
    ];

    const savedAuthors = await Author.insertMany(authors);

    const books = [
        {
            title: 'Clean Code',
            published: 2008,
            author: savedAuthors[0]._id,
            genres: ['refactoring'],
        },
        {
            title: 'Agile Software Development',
            published: 2002,
            author: savedAuthors[0]._id,
            genres: ['agile', 'patterns', 'design'],
        },
        {
            title: 'Refactoring',
            published: 1999,
            author: savedAuthors[1]._id,
            genres: ['refactoring', 'patterns'],
        },
        {
            title: 'Crime and Punishment',
            published: 1866,
            author: savedAuthors[2]._id,
            genres: ['classic', 'crime'],
        },
        {
            title: 'The Brothers Karamazov',
            published: 1880,
            author: savedAuthors[2]._id,
            genres: ['classic', 'philosophy'],
        },
        {
            title: 'Patterns of Enterprise Application Architecture',
            published: 2002,
            author: savedAuthors[1]._id,
            genres: ['patterns', 'architecture'],
        },
        {
            title: 'Practical Object-Oriented Design in Ruby',
            published: 2012,
            author: savedAuthors[4]._id,
            genres: ['ruby', 'object-oriented'],
        },
    ];

    await Book.insertMany(books);

    const users = [
        {
            username: 'root',
            favoriteGenre: 'refactoring',
        },
        {
            username: 'admin',
            favoriteGenre: 'patterns',
        },
    ];

    await User.insertMany(users);

    mongoose.connection.close();
};

seedDatabase().catch((error) => {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
});