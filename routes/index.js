const { Router } = require('express');
const router = Router();
const BookInDB = require('../models/book')

//Web Main Page
router.get('/', async (req, res) => { //async with try & catch always when querying db (asynchronous process)
    let books = [] //array of book (with objects {} inside)
    try {
        books = await BookInDB.find().sort({ createdAt: 'desc'}).limit(10).exec(); //sorting by creation date, descending order & limiting the max output
    } catch {
        books = []
    }
res.render ('index', { books: books })
})

module.exports = router;