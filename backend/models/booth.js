const mongoose = require('mongoose');

const boothSchema = mongoose.Schema({
  number: {type: Number, required: true},
  isOpen: {type: Boolean, required: true},
  vendor: {type: String, required: false},
  size: {type: String, required: true},
  outlets: {type: Number, required: true},
  tables: {type: Number, required: true}
});

module.exports = mongoose.model('Booth', boothSchema);

/* Structure for a vendor is
{ firstName: String
  lastName: String,
  business: String,
  address: String,
  applicationSent: Boolean,
  applicationRecieved: Boolean
} */
