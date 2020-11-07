import Budget from './Budget'
import BudgetItem from './BudgetItem'

export default {
  async initDatabase() {
    // Budget.dropTable()
    // BudgetItem.dropTable()
    Budget.createTable()
    BudgetItem.createTable()
    console.log('Table created.....')
  },
  newBudget(budget) {
    return new Budget(budget)
  },
  newBudgetItem(budgetItem) {
    return new BudgetItem(budgetItem)
  },
  Budget,
  BudgetItem,
}
