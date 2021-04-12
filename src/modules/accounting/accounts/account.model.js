const { Schema, model, Types} = require('mongoose');
const OperationModel = require('../operations/operation.schema');

const { BAD_REQUEST_ERROR } = require('../../../errors/appError')
const AccountSchema = new Schema ({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  operations: [
    OperationModel
  ],

  sum: {
    type: Number,
    default: 0
  },

  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }

})

AccountSchema.methods.sortOperations = function () {

  try {
      
      if (this.operations.length > 1) {

          const croppedArray = this.operations.slice(1).sort((a, b) => a.date > b.date ? 1 : -1)
  
          this.operations = [this.operations[0], ...croppedArray];
 
      }
     
    
  } catch (error) {
    throw error;
  }

 


}

AccountSchema.methods.updateSum = function () {
  
  this.sum = this.operations.map((item) => item = item.sum).reduce((sum, current) => sum + current, 0);
}

AccountSchema.methods.updateDate = function (editedOperaation) {

   
  if (this.operations.length > 1) {
    
   
    
      if (this.operations[0].date >= this.operations[1].date) {
        
          this.operations[0].date = new Date(this.operations[1].date - 1)
          
          
              if (String(editedOperaation._id) === String(this.operations[0]._id)) {
  
                  throw new Error('Операция запрещена: дата создания счёта не может быть больше следующей операции.')
              } 
  
              
          }
      
  } 
  
}







module.exports = model('Account', AccountSchema);