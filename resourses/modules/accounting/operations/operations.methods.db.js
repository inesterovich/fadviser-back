const AccountModel = require('../accounts/account.model');

const addOperation = async (accountId, operationData) => {
  try {

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

const updateOperation = async (accountId, operationData) => {
  try {

  
    
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

const deleteOperation = async (accountId, operationId) => {
  
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

module.exports = {
  addOperation,
  updateOperation,
  deleteOperation
}
