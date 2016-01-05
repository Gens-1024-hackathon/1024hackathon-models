(function(app) {

  require('babelify/polyfill');
  var PouchDB = require('pouchdb');
  var Registry = require('./lib/registry');

  var db = new PouchDB('store');
  var registry = new Registry(db);

  registry.loadDefinition(require('./definitions/book'));
  registry.loadDefinition(require('./definitions/event-group'));

  var ddoc = {
    _id: '_design/my_index',
    views: {
      by_bookId: {
        map: function(doc) {
          emit(doc.bookId);
        }.toString()
      }
    }
  }

  db.put(ddoc).then(function() {
    console.log('ok');
  }).catch(function() {
    console.log('ddoc already exist');
  });

  registry.bootstrap();

  app.Book = registry._model.Book;
  app.EventGroup = registry._model.EventGroup;

})(window._model || (window._model = {}));
