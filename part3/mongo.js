const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      return Person.find({}).then(result => {
        result.forEach(person => console.log(person))
        return mongoose.connection.close()
      })
    } else {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      return person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        return mongoose.connection.close()
      })
    }
  })
  .catch(err => console.log(err))