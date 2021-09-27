const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

contactSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

contactSchema.set('toJSON', {
  virtuals: true,
});

exports.Contact = mongoose.model('Contact', contactSchema);
