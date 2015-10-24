module.exports = function(db) {

  var type = 'eventgroup';

  return class EventGroup {

    constructor(data) {
      Object.assign(this, data);
    }

    static create(data) {
      var id = type + ':' + new Date().toJSON() + ':' + Math.random();
      data = data || {};
      data.type = type;
      return db
        .put(data, id)
        .then((result) => {
          data._id = result.id;
          data._rev = result.rev;
          return new EventGroup(data);
        });
    }

    static findAll() {
      return db
        .allDocs({
          include_docs: true,
          startkey: type + ':',
          endkey: type + ':\uffff'
        })
        .then((result) => {
          return result.rows.map((record) => {
            return new EventGroup(record.doc);
          });
        });
    }

    static findById(id) {
      return db
        .get(id)
        .then((data) => {
          return new EventGroup(data);
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
