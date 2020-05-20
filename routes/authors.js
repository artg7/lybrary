const { Router } = require('express');
const router = Router();
const AuthorInDB = require('../models/author')
const BookInDB = require('../models/book')

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

//New Author Create - IMPORTANT: It always goes before /:id, otherwise the program thinks that 'new' is an actual user id
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
            res.redirect(`authors/${newAuthor.id}`)
            //res.redirect('authors')

    }catch{
        res.render('authors/new', {
            author: author, //repopulating author input (not cleaning the name field)
            errorMessage: "Error creando Autor"
        }
    )}
})
//Request a Specific Author
router.get('/:id', async (req, res) => {
    try {
        const author = await AuthorInDB.findById(req.params.id)
        const books = await BookInDB.find({author: author.id}).limit(6).exec() //setting the maximum number of books to show on each author page to 6, so we do not retrieve more data that we wont print later @show.ejs | .exec() to execute that function of finding passing author.id, with a limit of 6 results
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

//Edit a Specific Author
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await AuthorInDB.findById(req.params.id) //params sent in URL query
        res.render ('authors/edit', {author: author}) //specific author found
    } catch {
        res.redirect('/authors')
    }

})

//Updating a Specific Author
router.put('/:id', async (req, res) => {
    let author
    try{
        author = await AuthorInDB.findById(req.params.id)
        author.name = req.body.name //specifing the value we allow to be changed
        await author.save()
        res.redirect(`/authors/${author.id}`)
        //res.redirect('authors')
    }catch{
        if(author == null) {
            res.redirect('/')
        } else {
        res.render('authors/edit', {
            author: author, //repopulating author input (not cleaning the name field)
            errorMessage: "Error actualizando Autor"
        }
    )}}
})

//Deleting a Specific Author ¡Never ever use get for a delete req, as google click everysingle get route when linking the website to the search engine & that will delete all our data!
router.delete('/:id', async (req, res) => {
    let author
    try{
        author = await AuthorInDB.findById(req.params.id)
        await author.remove() //method to DELETE from mongodb
        res.redirect('/authors')
        //res.redirect('authors')
    }catch{
        if(author == null) {
            res.redirect('/')
        } else {
        res.redirect(`/authors/${author.id}`)
    }}
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