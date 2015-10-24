module.exports = function(db) {

  return class Book {

    constructor(data) {
      Object.assign(this, data);
    }

    static create(data) {
      var id = 'book:' + new Date().toJSON() + ':' + Math.random();
      data = data || {};
      return db
        .put(data, id)
        .then((result) => {
          data._id = result.id;
          data._rev = result.rev;
          return new Book(data);
        });
    }

    static findAll() {
      return db
        .allDocs({
          include_docs: true,
          startkey: 'book:',
          endkey: 'book:\uffff'
        })
        .then((result) => {
          return result.rows.map((record) => {
            return new Book(record.doc);
          });
        });
    }

    static findById(id) {
      return db
        .get(id)
        .then((data) => {
          return new Book(data);
        });
    }

    save() {
      return db
        .put(this)
        .then((result) => {
          this._id = result.id;
          this._rev = result.rev;
          return this;
        });
    }

    destroy() {
      return db
        .remove(this);
    }

  };

};
