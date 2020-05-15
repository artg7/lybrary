const { Router } = require('express');
const router = Router();
const AuthorInDB = require('../models/author')

//Authors Index
router.get('/', async (req, res) => {
    let searchBar = {} //adding the search functionality
    if (req.query.name) {//if contains smth (req.query.name != null && req.query.name !== '')
        searchBar.name = new RegExp(req.query.name, 'i')} //regex for not require identical search; i = capital letters insenstive
    try{
        const authors = await AuthorInDB.find(searchBar) //mongoose functionality 'find' in saved db collections paired with created searchBar
        res.render ('authors/index', {authors: authors, //allowing authors/index.ejs to ask for authors found in db (stored in prev. const authors)
                                     searchBar: req.query})//keeping searchBar with user input after search request has been made
    }catch{
        res.redirect('/')
        }
    })

//New Author Create
router.get('/new', (req, res) => {
    res.render ('authors/new', {author: new AuthorInDB()}) //received data from New Author form fields
    })

//Create New Author on Author Index
router.post('/', async (req, res) => {
    const author = new AuthorInDB ({ //sending received data to db
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
            //res.redirect(`authors/${newAuthor.id}`)
            res.redirect('authors')

    }catch{
        res.render('authors/new', {
            author: author, //repopulating author input (not cleaning the name field)
            errorMessage: "Error creando Autor"
        }
    )}
})
/*     author.save((err, newAuthor) => {
        if (err) {
            res.render('authors/new', {
                author: author, //repopulating author input (not cleaning the name field)
                errorMessage: "Error creando Autor"
            })
        }else{
            //res.redirect(`authors/${newAuthor.id}`)
            res.redirect('authors/index')
        }
    })
}) */

module.exports = router;