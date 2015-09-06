var mongo = require('mongodb');
var assert = require('assert');

var Server = mongo.Server;
var Db = mongo.Db;

var server = new Server('localhost', 27017, { auto_reconnect : true });
var db = new Db('booksDb', server);

db.open(function (err, db) {
    if (err) {
        console.log("Failed connectiong to the 'booksDb' database..")
    } else {
        console.log("Successfully connected to the 'booksDb' database.")
        
        db.collection('books', function (err, collection) {
            collection.find().toArray(function (err, items) {
                if (items.length == 0) {
                    console.log("The 'booksDb''s empty, populating.")
                    populateDb();
                } else {
                    console.log("The 'booksDb' already contains books, aborting the population.")
                }
            });
        });
    }
})

exports.findAll = function (req, res) {
    db.collection('books', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (!err) {
                if (items.length != 0) {
                    res.send(items);
                } else {
                    res.send({
                        message : "There are no books available at this moment.",
                        error : "NO_CONTENT"
                    });
                }
            } else {
                console.log("There was an error in 'findAll'");
            }
        });
    });
}

exports.findById = function (req, res) {
    var id = req.params.id;
    console.log("Retrieving a book with the id " + id);
    
    db.collection('books', function (err, collection) {
        if (err) {
            console.log("There was an error : " + err);
            res.send({
                message : "There are no books available at this moment.",
                error : "NO_CONTENT"
            });
        } else {
            collection.findOne({
                _id : mongo.ObjectID(id)
            }, function (err, item) {
                if (item == null) {
                    console.log("Couldn't retrieve the item.");
                    res.send({
                        message : "Couldn't find an item with the specified Id.",
                        error : "NO_CONTENT"
                    });
                } else {
                    console.log("Retrieved the item : " + item);
                    res.send(item);
                }
            });
        }
    });
}

exports.addBook = function (req, res) {
    var book = req.body;
    var valid = true;
    
    console.log("Name : " + book.name);
    var name = book.name;
    if (name == null) {
        valid = false;
    }
    
    db.collection('books', function (err, collection) {
        if (err) {
            console.log("[ADD BOOK] There was an internal error, couldn't open the 'books' collection.");
            res.send({
                message : "There was an internal error.",
                error : "INTERNAL"
            });
        } else {
            if (valid) {
                collection.insert(book, { safe : true }, function (err, results) {
                    if (err) {
                        console.log("There was an error inserting the object.");
                        res.send({
                            message : "Failed to insert the sent object.",
                            error : "ERROR"
                        });
                    } else {
                        res.send({
                            message : "Successfully inserted the object.",
                            error : "SUCCESS"
                        });
                    }
                });
            } else {
                res.send({
                    message : "The object sent was invalid (missing fields).",
                    error : "ERROR"
                });
            }
        }
    });
}

exports.updateBook = function (req, res) {
    console.log("Update book")
}

exports.deleteBook = function (req, res) {
    console.log("Delete book")
}

var populateDb = function () {
    var books = [
        {
            name : "The Prettiest One: A Thriller",
            author : "James Hankins",
            cost : 5.99,
            rating : 4
        },
        {
            name : "Still Waters (Sandhamn Murders Book 1)",
            author : "Viveca Sten, Marlaine Delargy",
            cost : 5.99,
            rating : 3.5
        },
        {
            name : "The Capital of Latecomers",
            author : "Nina Nenova, Vladimir Poleganov",
            cost : 5.99,
            rating : 3
        },
        {
            name : "The Good Neighbor",
            author : "A. J. Banner",
            cost : 4.99,
            rating : 3.7
        },
        {
            name : "First to Kill",
            author : "Andrew Peterson",
            cost : 3.99,
            rating : 4.7
        }, 
        {
            name : "The Atlantis Gene: A Thriller",
            author : "A.G. Riddle",
            cost : 0.99,
            rating : 4
        }, 
        {
            name : "The Murderer's Daughter: A Novel",
            author : "Jonathan Kellerman",
            cost : 13.99,
            rating : 4
        }
    ];
    
    db.collection('books', function (err, collection) {
        collection.insert(
            books, 
            { safe : true },
            function (err, res) {
                assert.equal(null, err);
                assert.equal(books.length, res.ops.length);
            }
        )
    });
}