const mongoose = require('mongoose');

const boothSchema = mongoose.Schema({
  number: {type: Number, required: true},
  isOpen: {type: Boolean, required: true},
  vendor: {type: String, required: true},
  business: {type: String, required: true},
  size: {type: String, required: true},
  outlets: {type: Number, required: true},
  tables: {type: Number, required: true}
});

module.exports = mongoose.model('Booth', boothSchema);
