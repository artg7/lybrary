const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
    author:{ type: Schema.Types.ObjectId, required: true, ref:'Author' }, //mongoose option to reference another object from a different collection: Author (by Object Id in this case)
    title: { type: String, required: true },
    description: { type: String, required: false },
    publishDate: { type: Date, required: true },
    pageCount: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now }, //for displaying most recently added books
    coverImageName: { type: String, required: true } //string to file location; file storage better to do in the server filesystem (not in db)
});

module.exports = model('Book', bookSchema);