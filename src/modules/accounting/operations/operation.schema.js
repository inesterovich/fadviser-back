const { Schema } = require('mongoose');

const OperationSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  category: {
    type: String,
    required: true,
  },
  operationType: {
    type: String,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = OperationSchema;
