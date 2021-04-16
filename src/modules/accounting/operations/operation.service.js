const { BAD_REQUEST_ERROR } = require('../../../errors/appError');

const add = (AccountModel) => async (accountId, operationData) => {
  if (!accountId || !operationData) throw new BAD_REQUEST_ERROR('accountId and operationData required');
  const account = await AccountModel.findOneAndUpdate({ _id: accountId }, {
    $push: {
      operations: operationData,
    },
  }, { new: true });

  account.sortOperations();
  account.updateSum();
  account.updateDate();

  await account.save();

  return account;
};
const update = (AccountModel) => async (accountId, operationData) => {
  if (!accountId || !operationData) throw new BAD_REQUEST_ERROR('accountId and operationData required');
  const account = await AccountModel.findOneAndUpdate({
    _id: accountId,
    'operations._id': operationData._id,
  },
  {
    $set: {
      'operations.$': operationData,
    },

  },
  { new: true });

  account.sortOperations();
  account.updateSum();
  account.updateDate(operationData);
  await account.save();

  return account;
};
const remove = (AccountModel) => async (accountId, operationId) => {
  if (!accountId || !operationId) throw new BAD_REQUEST_ERROR('accountId and operationId required');

  const account = await AccountModel.findOneAndUpdate({ _id: accountId },
    {
      $pull: {
        operations: {
          _id: operationId,
        },
      },
    },
    {
      new: true,
    });

  account.updateSum();
  await account.save();
  return account;
};

module.exports = (AccountModel) => ({
  add: add(AccountModel),
  update: update(AccountModel),
  remove: remove(AccountModel),
});
