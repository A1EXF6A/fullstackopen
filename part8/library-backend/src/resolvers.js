const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const jwt = require('jsonwebtoken');
const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');
const config = require('./utils/config');

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            let filter = {};

            if (args.author) {
                const author = await Author.findOne({ name: args.author });
                if (author) {
                    filter.author = author._id;
                }
            }

            if (args.genre) {
                filter.genres = { $in: [args.genre] };
            }

            return Book.find(filter).populate('author');
        },
        allAuthors: async () => Author.find({}),
        me: (root, args, context) => context.currentUser,
    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({ author: root._id });
            return books.length;
        },
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new Error('not authenticated');
            }

            let author = await Author.findOne({ name: args.author });

            if (!author) {
                author = new Author({ name: args.author });
                try {
                    await author.save();
                } catch (error) {
                    throw new Error(error.message);
                }
            }

            const book = new Book({ ...args, author: author._id });

            try {
                await book.save();
            } catch (error) {
                throw new Error(error.message);
            }

            const populatedBook = await Book.findById(book._id).populate('author');
            pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });

            return populatedBook;
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new Error('not authenticated');
            }

            const author = await Author.findOne({ name: args.name });
            if (!author) {
                return null;
            }

            author.born = args.setBornTo;

            try {
                await author.save();
            } catch (error) {
                throw new Error(error.message);
            }

            return author;
        },
        createUser: async (root, args) => {
            const user = new User({
                username: args.username,
                favoriteGenre: args.favoriteGenre,
            });

            try {
                await user.save();
            } catch (error) {
                throw new Error(error.message);
            }

            return user;
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });

            if (!user || args.password !== 'secret') {
                throw new Error('wrong credentials');
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };

            return { value: jwt.sign(userForToken, config.JWT_SECRET) };
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
        },
    },
};

module.exports = resolvers;