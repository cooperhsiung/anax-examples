/**
 * Created by Cooper on 2018/8/5.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
  pid: {
    type: String,
  },
  user: {
    type: String,
  },
  content: {
    type: String,
  },
  remark: {
    type: String,
  },
});

const itemSchema = Schema({
  name: {
    type: String,
    trim: true,
  },
  pid: {
    type: String,
  },
  sales: {
    type: String,
  },
  price: {
    type: String,
  },
  shop: {
    type: String,
    trim: true,
  },
});

itemSchema.statics.store = function(data, cb) {
  this.findOne({ pid: data.pid }, (e1, r1) => {
    if (e1) {
      return cb(e1);
    }
    if (!r1) {
      this.create(data, cb);
    } else {
      this.updateOne({ pid: data.pid }, data, cb);
    }
  });
};

const Product = mongoose.model('Product', itemSchema);
const Comment = mongoose.model('Comment', commentSchema);
module.exports = [Product, Comment];
