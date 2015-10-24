var PouchDB = require('pouchdb');
var Book = require('./src/book');
var EventGroup = require('./src/event-group');

var db = new PouchDB('store');

window._model = window._models || {};
window._model.Book = Book(db);
window._model.EventGroup = EventGroup(db);
