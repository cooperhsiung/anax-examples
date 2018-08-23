/**
 * Created by Cooper on 2018/08/23.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  url: {
    type: String,
    required: true,
    trim: true,
  },

  desc: {
    type: String,
    required: true,
    trim: true,
  },

  language: {
    type: String,
    trim: true,
  },

  star: {
    type: String,
    trim: true,
  },

  lastModified: {
    type: Date,
    required: true,
  },
});

itemSchema.statics.store = function(data, cb) {
  this.findOne({ url: data.url }, (e1, r1) => {
    if (e1) {
      return cb(e1);
    }
    if (!r1) {
      this.create(data, cb);
    } else {
      this.updateOne({ url: data.url }, data, cb);
    }
  });
};

const Repo = mongoose.model('Repo', itemSchema);

module.exports = [Repo];
