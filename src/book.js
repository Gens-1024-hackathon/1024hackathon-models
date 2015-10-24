module.exports = function(db) {

  return class Book {

    constructor(data) {
      Object.assign(this, data);
    }

    static create(data) {
      console.log('create book');
      return db.put();
    }

    static findAll() {
      return db.query();
    }

    static findById(id) {
      return db
        .get(id)
        .then(function(data) {
          new Book(data);
        });
    }

    getEventGroups() {
    }

    save() {
      return db
        .put();
    }

    destroy() {
      var id = this.id;
      return db
        .remove(id);
    }

  };

};
