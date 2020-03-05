const mongoose = require('mongoose');

const boothSchema = mongoose.Schema({
  number: {type: Number, required: true},
  isOpen: {type: Boolean, required: true},
  vendor: {type: String, required: false},
  business: {type: String, required: false},
  size: {type: String, required: true},
  outlets: {type: Number, required: true},
  tables: {type: Number, required: true}
});

module.exports = mongoose.model('Booth', boothSchema);
