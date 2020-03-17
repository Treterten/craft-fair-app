const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  applicationSent: {type: Boolean, required: true},
  applicationRecieved: {type: Boolean, required: true},
  boothNumber: {type: Number, required: true}
});


module.exports = mongoose.model('Customer', customerSchema);
