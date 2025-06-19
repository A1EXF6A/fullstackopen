db = db.getSiblingDB('library');

db.createUser({
    user: 'library',
    pwd: 'library123',
    roles: [{ role: 'readWrite', db: 'library' }],
});

db.createCollection('books');
db.createCollection('authors');
db.createCollection('users');