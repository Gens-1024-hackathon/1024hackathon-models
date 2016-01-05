import Model from './model';

class Registry {

  constructor(db) {
    this.db = db;
  }

  loadDefinition(definition) {
    var db = this.db;
    this._model = this._model || {};
    this._definition = this._definition || {};

    var model = class extends Model {
      constructor(data) {
        super();
        Object.assign(this, data);
        // static
        this.$db = db;
        this.type = definition.type;
      }
    };

    // static
    model.db = db;
    model.type = definition.type;

    model.findAll = Model.findAll;
    model.create = Model.create;
    model.findById = Model.findById;

    this._definition[definition.type] = definition;
    this._model[definition.type] = model;
  }

  addRelationship(definition, db, registry) {
    var model = registry._model[definition.type];

    if (Array.isArray(definition.belongsTo)) {
      definition.belongsTo.forEach((targetType) => {

        model.prototype['set' + targetType] = function(parentId) {
          this[targetType + 'Id'] = parentId;
          return this.save();
        };

        model.prototype['get' + targetType] = function() {
          return model.findById(this[targetType + 'Id']);
        };

      });
    }

    if (Array.isArray(definition.hasMany)) {
      definition.hasMany.forEach((targetType) => {

        model.prototype['set' + targetType + 's'] = function(childIds) {
          var bookId = this._id;
          return this.$db.bulkDocs(childIds.map((childId) => {
            var reply = {
              _id: childId
            };
            reply[targetType + 'Id'] = this._id;
            return reply;
          }));
        };

        model.prototype['get' + targetType + 's'] = function() {
          var parentId = this._id;
          return this.$db.query('my_index/by_bookId', {
            key: parentId,
            include_docs: true
          }).then(result => {
            return result.rows.map(record => {
              return new registry._model[targetType](record.doc);
            });
          });
        };

      });
    }

  }

  bootstrap() {
    Object.keys(this._definition).forEach((key) => {
      this.addRelationship(this._definition[key], this.db, this);
    });
  }

}

export default Registry;
