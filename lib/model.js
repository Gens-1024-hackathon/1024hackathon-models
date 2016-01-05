var _ = require('lodash');

class Model {

  static findAll() {
    return this.db.allDocs({
      include_docs: true,
      startkey: this.type + ':',
      endkey: this.type + ':\uffff'
    }).then((result) => {
      return result.rows.map((record) => {
        return new this(record.doc);
      });
    });
  }

  static create(data) {
    var id = this.type + ':' + new Date().toJSON() + ':' + Math.random();
    data = data || {};
    data.type = this.type;
    return this.db.put(data, id).then((result) => {
      data._id = result.id;
      data._rev = result.rev;
      return new this(data);
    });
  }

  static findById(id) {
    return this.db.get(id).then((data) => {
      return new this(data);
    });
  }

  save() {
    return this.$db.put(this._getDoc()).then((result) => {
      this._id = result.id;
      this._rev = result.rev;
      return this;
    });
  }

  destroy() {
    return this.$db.remove(this._id, this._rev);
  }

  _getDoc() {
    return _.omit(this, function(value, key) {
      return _.isFunction(value) || key.startsWith('$');
    });
  }

}

export default Model;
