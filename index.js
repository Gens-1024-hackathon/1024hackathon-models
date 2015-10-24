require('babelify/polyfill');
var PouchDB = require('pouchdb');

var db = new PouchDB('store');
var Book = require('./src/book')(db);
var EventGroup = require('./src/event-group')(db);

Book.prototype.getEventGroups = function getEventGroups() {
  // ugly hack, slow temporary query
  var bookId = this.id;
  db.query((doc, emit) => {
    if (doc.bookId === bookId) {
      emit(doc);
    }
  }).then((result) => {
    return result;
  });
};

Book.prototype.setEventGroups = function setEventGroups(eventGroupIds) {
  var bookId = this.id;
  return db.bulkDocs(eventGroupIds.map((eventGroupId) => {
    return {
      bookId: bookId,
      _id: eventGroupId
    };
  }));
};

EventGroup.prototype.getBook = function getBook() {
  return Book.findById(this.bookId);
};

EventGroup.prototype.setBook = function setBook(bookId) {
  this.bookId = bookId;
  return this.save();
};

window._model = window._models || {};
window._model.Book = Book(db);
window._model.EventGroup = EventGroup(db);
