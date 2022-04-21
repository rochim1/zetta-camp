// import express
const {
    Router
} = require('express');
const express = require('express');

// import mongoose 
const mongoose = require('mongoose');

// import express Router
const router = express.Router();

// import bookShelf from model
const BookShelf = require('../model/bookShelfSchema');

module.exports = router;

// try connection if the route is working or not
router.get('/', async (req, res) => {
    try {
        res.send(`Hello World`);
    } catch (err) {
        console.log(`Error hello world bookShelf ${err.message}`);
    }
});

// get all data bookshelf with distinct bookshelf name
router.get('/get-book-shelf', async (req, res) => {

    try {
        // get all data
        const result = await BookShelf.find();
        // const result = await BookShelf.find().distinct('book_shelf_name');
        res.send(result);
    } catch (err) {
        res.send(`Error get all data : ${err.message}`);
    }

});

// filter data with elemMatch
// get book with certain id using elemMatch in
router.get('/get-book-match-in/:id', async (req, res) => {
    try {
        // destruct params
        const {
            id
        } = req.params;
        const result = await BookShelf.find({
            book_list: {
                $elemMatch: {
                    book_id: id
                }
            }
        });
        res.send(result);
    } catch (err) {
        res.send(`Error get book match: ${err.message}`);
    }
});

// get book with certain id using elemMatch ne
router.get('/get-book-match-ne/:id', async (req, res) => {
    try {
        // destruct params
        const {
            id
        } = req.params;
        const result = await BookShelf.find({
            'book_list': {
                $elemMatch: {
                    book_id: {
                        "$ne": id
                    }
                }
            }
        });
        res.send(result);
    } catch (err) {
        res.send(`Error get book match: ${err.message}`);
    }
});

// update data with arrayFilter
// update book wit arrayFilter
router.put('/update-book-filter', async (req, res) => {
    try {

        // destruct query
        const {
            idLibrary,
            idBook,
            date
        } = req.query;

        // update data
        const result = await BookShelf.updateOne({
            _id: idLibrary
        }, {
            $set: {
                "book_list.$[element].date_updated": date
            }
        }, {
            arrayFilters: [{
                'element.book_id': idBook
            }]
        });
        res.send(`Data filter updated`);
    } catch (err) {
        res.send(`Error update book filter : ${err.message}`);
    }
});


// insert data from parameters
router.post('/insert-book-shelf', async (req, res) => {
    try {
        // destruct query
        const {
            name,
            id,
            date
        } = req.query;

        // store id and date to variable
        // const bookList = {
        //     bo
        // }

        // store the result in variable
        const saveBook = new BookShelf({
            book_shelf_name: name,
            book_list: {
                book_id: id,
                date_updated: date
            },
        });

        // save into database
        const result = await saveBook.save();

        // send respond to server data is inserted
        res.send(`Data inserted`);
        // res.json(saveBook);
    } catch (err) {
        res.send(`Error insert book : ${err.message}`);
    }
});


// insert book into shelf
router.post('/insert-book', async (req, res) => {
    try {
        // destruct query
        const {
            idShelf,
            idBook,
            date
        } = req.query;

        // insert book using updateOne method
        const result = await BookShelf.updateOne({
            _id: idShelf
        }, {
            $addToSet: {
                book_list: {
                    book_id: idBook,
                    date_updated: date
                }

            }
        });
        res.send(`Book Inserted`);
    } catch (err) {
        res.send(`Error insert book : ${err.message}}`);
    }
});

// update book in bookshelf
// router.put('/update-book', async (req, res) => {

//     // update book using updateOne
//     try {

//         // destruct query
//         const {
//             idBookSearch,
//             idShelf,
//             idBookNew
//         } = req.query;

//         // pull the value to update
//         const resultPull = await BookShelf.updateOne({
//             _id: idShelf
//         }, {
//             $pullAll: {
//                 book_list: [idBookSearch]
//             }
//         });

//         // add new book to array
//         const resultPush = await BookShelf.updateOne({
//             _id: idShelf
//         }, {
//             $addToSet: {
//                 book_list: idBookNew
//             }
//         });
//         res.send(`Book Updated`);
//     } catch (err) {
//         console.log(`Error update book ${err.message}`);
//     }
// });

// update book shelf
router.put('/update-book-shelf', async (req, res) => {
    try {
        // destruct query
        const {
            id,
            name
        } = req.query;

        // update library name 
        const result = await BookShelf.findByIdAndUpdate(id, {
            book_shelf_name: name
        }, {
            new: true
        });

        res.send(`Book Shelf Updated`);
    } catch (er) {
        res.send(`Error update book shelf ${err.message}`);
    }
});

// delete book in book shelf
router.delete('/delete-book/:idShelf/:idBook', async (req, res) => {
    try {
        // destruct params
        const {
            idShelf,
            idBook
        } = req.params;

        // delete book
        const result = await BookShelf.findOneAndUpdate({
            _id: idShelf
        }, {
            $pull: {
                book_list: {
                    book_id: idBook
                }
            }
        }, {
            new: true
        });
        res.send(`Book id ${idBook} deleted`);
    } catch (er) {
        res.send(`Error deleting book : ${er.message}`);
    }
});

// delete book shelf 
router.delete('/delete-book-shelf/:id', async (req, res) => {

    try {
        // destruct id from params
        const {
            id
        } = req.params;

        // delete book shelf
        const result = await BookShelf.findByIdAndDelete(id);
        res.send(`Book Shelf id ${id} is deleted`);
    } catch (err) {
        res.send(`Error delete book shelf : ${err.message}`);
    }
});