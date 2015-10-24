require('babelify/polyfill');
var PouchDB = require('pouchdb');

var db = new PouchDB('store');
var Book = require('./src/book')(db);
var EventGroup = require('./src/event-group')(db);

Book.prototype.getEventGroups = function getEventGroups() {
};

Book.prototype.setEventGroups = function setEventGroups() {
};

EventGroup.prototype.getBook = function getBook() {
};

EventGroup.prototype.setBook = function setBook() {
};

window._model = window._models || {};
window._model.Book = Book(db);
window._model.EventGroup = EventGroup(db);
