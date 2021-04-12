
const add = AccountModel =>  async (accountId, operationData) => {
  try {

    // Проверка на наличие данных

    const account = await AccountModel.findOneAndUpdate({ _id: accountId }, {
      $push: {
        operations: operationData
      }
    }, { new: true });

    account.sortOperations();
    account.updateSum();
    account.updateDate();

    await account.save();

    return account;
  } catch (error) {
    throw error;
  }
  
}
const update = AccountModel =>  async (accountId, operationData) => {
  try {

    // Проверка, переданны ли данные
    const account = await AccountModel.findOneAndUpdate({
      _id: accountId,
      'operations._id': operationData._id
    },
      {
        $set: {
          'operations.$': operationData
        }
      
      }
      , { new: true });
    
   
    account.sortOperations();
    account.updateSum();
    account.updateDate(operationData);
    await account.save();
  
    return account; 
  } catch (error) {
    throw error;
  }
}
const remove = AccountModel =>  async (accountId, operationId) => {
  
  try {
    const account = await AccountModel.findOneAndUpdate({ _id: accountId },
      {
      $pull: {
        operations: {
          _id: operationId
        }
      }
      },
      {
        new: true
      }
    )

    account.updateSum();
    await account.save();
    return account;
    
  } catch (error) {
    throw error;
  }

}



module.exports = AccountModel => {
  return {
    add: add(AccountModel),
    update: update(AccountModel),
    remove: remove(AccountModel)
  }
}