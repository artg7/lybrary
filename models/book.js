const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
    author:{ type: Schema.Types.ObjectId, required: true, ref:'Author' }, //mongoose option to reference another object from a different collection: Author (by Object Id in this case)
    title: { type: String, required: true },
    description: { type: String, required: false },
    publishDate: { type: Date, required: true },
    pageCount: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now }, //for displaying most recently added books
    //coverImageName: { type: String, required: true } //string to file location; file storage better to do in the server filesystem (not in db) (FOR MULTER)
    coverImageName: { type: Buffer, required: true }, // (FOR FILEPOND)
    coverImageType: { type: String, required: true } // (FOR FILEPOND)
});

bookSchema.virtual('coverImageNameDeciphered').get(function() { //virtual bookSchema property to store the deciphered image (when storing with FilePond) | Not arrow function as 
                                                                //we use properties from the db Schema constructor (this.)
if(this.coverImageName && this.coverImageType) { //if both not null
    return `data: ${this.coverImageType};charset=utf-8;base64,${this.coverImageName.toString('base64')}` //decipher file data, stored in key:value "data": "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAA..."
}})

module.exports = model('Book', bookSchema);