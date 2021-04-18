const { Schema, model, Types } = require('mongoose');
const OperationModel = require('../operations/operation.schema');

const { BAD_REQUEST_ERROR } = require('../../../errors/appError');

const AccountSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  operations: [
    OperationModel,
  ],

  sum: {
    type: Number,
    default: 0,
  },

  categories: {
    type: Types.ObjectId,
    ref: 'financeCategories'
  },

  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },

});

AccountSchema.methods.sortOperations = function () {
  if (this.operations.length > 1) {
    const croppedArray = this.operations.slice(1).sort((a, b) => (a.date > b.date ? 1 : -1));

    this.operations = [this.operations[0], ...croppedArray];
  }
};

AccountSchema.methods.updateSum = function () {
  const updatedSum = this.operations
    .map((item) => item = Number(item.sum))
    .reduce((sum, current) => sum + current, 0);

  this.sum = Number(updatedSum.toFixed(2));
};

AccountSchema.methods.updateDate = function (editedOperation) {
  if (this.operations.length > 1) {
    if (this.operations[0].date >= this.operations[1].date) {
      if (String(editedOperation?._id) === String(this.operations[0]._id)) {
        throw new BAD_REQUEST_ERROR('Операция запрещена: дата создания счёта не может быть больше следующей операции.');
      }

      this.operations[0].date = new Date(this.operations[1].date - 1);
    }
  }
};

module.exports = model('Account', AccountSchema);
