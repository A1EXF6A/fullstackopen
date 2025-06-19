const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const config = require('./utils/config');

const pubsub = new PubSub();
const User = require('./models/User');

mongoose.set('strictQuery', false);

console.log('Connecting to MongoDB...');
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error.message));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req?.headers?.authorization;
        if (auth?.startsWith('Bearer ')) {
            const token = auth.substring(7);
            const decodedToken = jwt.verify(token, config.JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser, pubsub };
        }
        return { pubsub };
    },
    subscriptions: {
        path: '/subscriptions',
        onConnect: (connectionParams) => {
            const auth = connectionParams?.authorization;
            if (auth?.startsWith('Bearer ')) {
                const token = auth.substring(7);
                const decodedToken = jwt.verify(token, config.JWT_SECRET);
                return { currentUser: decodedToken };
            }
            throw new Error('Missing auth token!');
        }
    }
});

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});