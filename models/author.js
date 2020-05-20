const { Schema, model } = require('mongoose');
const BookInDB = require('./book') // to be used @ pre function

const authorSchema = new Schema({
    name: { type: String, required: true }
});

//Preventing Remove if other models reference the data (otherwise tons of error because of ids pointing to data that doesn´t exits)
authorSchema.pre('remove', function(next) { //method from mongoose to run specific code before/during/after an action | In this case before 'remove' (action called @delete method in authors route)
BookInDB.find({author: this.id}, (error, books) => { //it can throw back an error or some books asociated to that author.id
    if(error) {
        next(error)//if there is an error in mongodb find, just avoid the remove
    } else if (books.length > 0){
        next(new Error ('El autor que intentas eliminar tiene libros asociados'))
    } else {
        next()
    }
})
})

module.exports = model('Author', authorSchema);