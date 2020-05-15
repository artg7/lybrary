const { Router } = require('express');
const router = Router();
const BookInDB = require('../models/book')
const AuthorInDB = require('../models/author') //required to created a book, since an Author has to be registed first to be assigned a book
const path = require('path');
const { unlink } = require('fs-extra'); //to unlink/delete uploaded images

//
/* const multer = require('multer');
const imageMimeTypes = ['image/jpeg','image/jpg','image/png','image/gif']
const storage = multer.diskStorage({
    destination: 'public/uploads/bookCovers',
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))},
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }}) */
//

//Books Index
router.get('/', async (req, res) => {
    let query = BookInDB.find(); //in this case the query is of elements stored in the db, not just browser query 
    if(req.query.title) {
        query = query.regex('title', new RegExp(req.query.title, 'i'))  
    }

    if(req.query.publishedBefore) {
        query = query.lte('publishDate', req.query.publishedBefore) //lte:lesser than
    }

    if(req.query.publishedAfter) {
        query = query.gte('publishDate', req.query.publishedAfter) //gte:greater than
    }

    try {
        const books = await query.exec() //replacing BookInDB.find({});
        res.render('books/index', { books: books, 
                                    searchBar: req.query
    })} catch {
        res.redirect('/')
    }})

//New Book Create
router.get('/new', async (req, res) => {
    renderNewPage(res, new BookInDB()) //no need to pass anything for error, as /new will never have
    })

//Create New Book on Book Index
router.post('/', async (req, res) => { //pasing the stored file: input name @ books/_form_fields HTML/ejs
    /* let fileName = req.file != null ? req.file.filename : null */ //if we get a file from user, store name in filename var, otherwise store null
    const book = new BookInDB ({
        author: req.body.author,
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate), // to convert the splitted string from the form again into a date
        pageCount: req.body.pageCount,
        //coverImageName: '/uploads/bookCovers/' + req.file.filename //Required for MULTER
    })
    saveCover(book, req.body.cover) //To save to FilePond as image are not files anymore, but strings of the body @ _form_fields input name="cover"

    try {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch (e) {
        //Required for MULTER
/*         if (book.coverImageName) {
            const fileName = book.coverImageName
            removeBookCover(fileName) //delete the failed book upload
        } */
        renderNewPage(res, book, hasError = true) //as the form may have an error
        console.error(e)
    }
})

//Required for MULTER, as we are removing files (multipart/form-data)
/* function removeBookCover (fileName) {
    unlink(path.resolve('./public' + fileName), err => { //as fileName already contains '/uploads/bookCovers/' string
        if (err) console.error(err)}) //redirect the error to console, so we dont ruin user experience displaying internal errors on the broswer
} */

async function renderNewPage (res, book, hasError = false) { //res to render/redirect, book data for try, hasError for catch
    try {
        const authors = await AuthorInDB.find({})
        const newBookParams = { authors: authors, book: book }
        if (hasError) newBookParams.errorMessage = "Error creando Libro. Falta información Requerida"
        res.render('books/new', newBookParams) 
    } catch {
        res.redirect('/books')
    }
}

//FilePond File Saving Function
const imageMimeTypes = ['image/jpeg','image/jpg','image/png','image/gif']
function saveCover(book, coverEncoded) { //as files get encoded in a string form, i.e.: "data": "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAA..."
    if (coverEncoded) {
        const cover = JSON.parse(coverEncoded) //analyzing the coverEncoded to decipher the image itself
        if (imageMimeTypes.includes(cover.type)) { //mimetype in multer is named just type in FilePond
            book.coverImageName = new Buffer.from(cover.data, 'base64') // data=string of characters that FilePond encode generates from image (using base64 format), and later deciphers
            book.coverImageType = cover.type //to indicate the decipher what extension has to add
        }
    else {
        return //when coverEncoded == null, stop the function execution
    }
}}

module.exports = router;