const { Schema, model, Types } = require('mongoose');

const financeCategoriesSchema = new Schema({
  income: {
    type: Array,
    default: ['Зарплата', 'Бизнес', 'Инвестиции', 'Подработки', 'Подарки', 'Долги', 'Кредиты']
  },
  expenses: {
    type: Array,
    default: ['Фонд богатства', 'Текущие расходы', 'Долгосрочные накопления', 'Здоровье', 'Образование', 'Развлечения', 'Благотворительность']
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = model('financeCategories', financeCategoriesSchema);